
import React, { useState, useRef, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Area } from 'react-easy-crop';
import getCroppedImg from '../../helpers/croppedImage';
import { accountSetup } from '../../services/api/user/apiMethods';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../utils/reducers/authSlice';
import CropModal from '../../components/Modals/CropModal';
import BGCropModal from '../../components/Modals/BGCropModal';
import { uploadImageToCloudinary } from '../../helpers/cloudinaryUpload';

function AccountSetup() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [bgImage, setBGImage] = useState<File | null>(null);
  const [crop, setCrop] = useState<Area>({ x: 0, y: 0, width: 1, height: 1 });
  const [bgCrop, setBGCrop] = useState<Area>({ x: 0, y: 0, width: 1, height: 1 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [bgCroppedAreaPixels, setBGCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [bgCroppedImage, setBGCroppedImage] = useState<string | null>(null);
  const [preview, setPreview] = useState(true);
  const [bgPreview, setBGPreview] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBGModal, setShowBGModal] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const validationSchema = Yup.object().shape({
    userName: Yup.string()
    .required('Username is required')
    .min(5,"Requires more that 5 letters")
    .max(15,"Limit exceeded"),
    gender: Yup.string().required('Gender is required').oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
    bio: Yup.string()
    .required('Bio is required')
    .test('word-count', 'Bio must contain between 20 and 50 words', (value) => {
      if (!value) return false; // If value is empty, fail validation
      const wordCount = value.trim().split(/\s+/).length;
      return wordCount >= 2 && wordCount <= 10;
    }),
    phone: Yup.string()
    .required('Phone is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  });

  const initialValues = { userName: '', gender: '', bio: '', phone: '' };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      if (selectedImage.type === 'image/png' || selectedImage.type === 'image/jpeg') {
        setImage(selectedImage);
        setShowModal(true);
      }else {
        toast.error('Only PNG and JPEG image files are allowed for the Profile image.');
      }
    }
  };
  const handleBGFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      if (selectedImage.type === 'image/png' || selectedImage.type === 'image/jpeg') {
        setBGImage(selectedImage);
        setShowBGModal(true);
      } else {
        toast.error('Only PNG and JPEG image files are allowed for the background image.');
      }
    }
  };
  

  const onCropChange = (crop: Area, croppedAreaPixels: Area) => {
    setCrop(crop);
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onBGCropChange = (crop: Area, croppedAreaPixels: Area) => {
    setBGCrop(crop);
    setBGCroppedAreaPixels(croppedAreaPixels);
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onBGCropComplete = useCallback((croppedArea: Area, bgCroppedAreaPixels: Area) => {
    setBGCroppedAreaPixels(bgCroppedAreaPixels);
  }, []);

  const handleCropImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (croppedAreaPixels && image) {
        const croppedImageBase64 = await getCroppedImg(image, croppedAreaPixels);
        setCroppedImage(croppedImageBase64);
        setShowModal(false);
        setPreview(false);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleBGCropImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (bgCroppedAreaPixels && bgImage) {
        const croppedImageBase64 = await getCroppedImg(bgImage, bgCroppedAreaPixels);
        setBGCroppedImage(croppedImageBase64);
        setShowBGModal(false);
        setBGPreview(false);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

   

  const handleCloseModal = () => {
    setShowModal(false);
    setImage(null);
    setCrop({ x: 0, y: 0, width: 1, height: 1 });
    setCroppedAreaPixels(null);
    setPreview(true);
  };

  const handleBGCloseModal = () => {
    setShowBGModal(false);
    setBGImage(null);
    setBGCrop({ x: 0, y: 0, width: 1, height: 1 });
    setBGCroppedAreaPixels(null);
    setBGPreview(true);
  };

  const onSubmit = async (values: { userName: string, gender: string, bio: string, phone: number, profileImage: string, bgImage: string, userId:string }) => {
    try {
      
      if (croppedAreaPixels && image) {
        const croppedImageBase64 = await getCroppedImg(image, croppedAreaPixels);
        setCroppedImage(croppedImageBase64);
        setShowModal(false);
        setPreview(false);
        const profileImageURL = await uploadImageToCloudinary(croppedImageBase64);
        values.profileImage = profileImageURL;
      }
  
      
      if (bgCroppedAreaPixels && bgImage) {
        const bgCroppedImageBase64 = await getCroppedImg(bgImage, bgCroppedAreaPixels);
        setBGCroppedImage(bgCroppedImageBase64);
        setShowBGModal(false);
        setBGPreview(false);
        const bgImageURL = await uploadImageToCloudinary(bgCroppedImageBase64);
        values.bgImage = bgImageURL;
      }
      if(!values.bgImage || !values.profileImage){
        return toast.error("Please provide profile image and Background image")
      }
      values.userId = localStorage.getItem("userId") || ""
      console.log(values);
      accountSetup(values)
      .then((response:any)=>{
        const data = response.data;
        console.log(data)
        if(response.status===200){
          toast.success(data.message)
          console.log(data.updatedUser);
          
          dispatch(updateUser({user:data.updatedUser}))
          navigate('/my-profile')
        }else{
          toast.error(data.error);
      }
      })     
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className='w-screen bg-gray-100 min-h-screen'>
      <div className='w-screen bg-gradient-to-r from-blue-500 to-indigo-600 h-16 shadow-md'>
        <p className='text-center text-3xl font-extrabold text-white py-3'>SocialConnect</p>
      </div>
      <div className='flex justify-center mt-8 rounded-lg'>
        <div className="bg-white w-full max-w-4xl shadow-xl rounded-lg overflow-hidden">
          <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, errors }) => (
            <Form>
              <div className='w-full h-64 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-lg'>
                <img src={bgCroppedImage || "https://getuikit.com/v2/docs/images/placeholder_600x400.svg"} className='w-full h-64 object-cover opacity-80' alt="" />
              </div>
              <div className='flex justify-center flex-col items-center -mt-20'>
                <div className='bg-gradient-to-r from-blue-500 to-indigo-600 w-40 h-40 rounded-full shadow-lg border-4 border-white z-10'>
                  <img src={croppedImage || "https://upload.wikimedia.org/wikipedia/commons/b/b5/Windows_10_Default_Profile_Picture.svg"} alt="Cropped" className='rounded-full w-full h-full object-cover' />
                </div>
              </div>
              <div className="flex justify-center flex-col w-full px-8 md:px-16 py-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Profile</h2>
                <div className='space-y-6'>
                  <div className='flex flex-col md:flex-row md:items-center gap-4'>
                    <label className='font-medium text-gray-700 md:w-1/4'>Username</label>
                    <Field type="text" name="userName" className="flex-grow h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="@johndoe" />
                  </div>
                  <ErrorMessage name="userName" component="div" className="text-red-500 ml-auto w-3/4" />
                  
                  <div className='flex flex-col md:flex-row md:items-center gap-4'>
                    <label className='font-medium text-gray-700 md:w-1/4'>Bio</label>
                    <Field as="textarea" type="text" name="bio" className="flex-grow h-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tell us about yourself..." />
                  </div>
                  <ErrorMessage name="bio" component="div" className="text-red-500 ml-auto w-3/4" />
                  
                  <div className='flex flex-col md:flex-row md:items-center gap-4'>
                    <label className='font-medium text-gray-700 md:w-1/4'>Gender</label>
                    <select name="gender" onChange={(e) => setFieldValue('gender', e.target.value)}
                    className="flex-grow h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Gender</option> 
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>     
                  </div>           
                  <ErrorMessage name="gender" component="div" className="text-red-500 ml-auto w-3/4" />
                  
                  <div className='flex flex-col md:flex-row md:items-center gap-4'>
                    <label className='font-medium text-gray-700 md:w-1/4'>Phone</label>
                    <Field type="number" name="phone" className="flex-grow h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(123) 456-7890" />
                  </div>
                  <ErrorMessage name="phone" component="div" className="text-red-500 ml-auto w-3/4" />
  
                  {showModal && (
                    <CropModal 
                    image={URL.createObjectURL(image)}
                    crop={crop}
                    setCroppedAreaPixels={setCroppedAreaPixels}
                    onCropChange={onCropChange}
                    onCropComplete={onCropComplete}
                    onClose={handleCloseModal}
                    onCropImage={handleCropImage}
                    />  
                  )}
  
                  <div className='flex flex-col md:flex-row md:items-center gap-4'>
                    <label className="font-medium text-gray-700 md:w-1/4">Profile Photo</label>
                    <input 
                      ref={inputRef} 
                      onChange={handleFileChange}  
                      onClick={() => setPreview(true)} 
                      accept="image/*"
                      className="flex-grow text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                      type="file"
                    />
                  </div>
                  <ErrorMessage name="profileImage" component="div" className="text-red-500 ml-auto w-3/4" />
  
                  <div className='flex flex-col md:flex-row md:items-center gap-4'>
                    <label className="font-medium text-gray-700 md:w-1/4">Cover Photo</label>
                    <input 
                      type="file"
                      ref={inputRef}
                      onChange={handleBGFileChange}
                      accept="image/*"
                      className="flex-grow text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                      onClick={() => setBGPreview(true)}
                    />
                  </div>
                  <ErrorMessage name="image" component="div" className="text-red-500 ml-auto w-3/4" />
  
                  {showBGModal && (
                    <BGCropModal 
                    image={URL.createObjectURL(bgImage)}
                    crop={bgCrop}
                    setCroppedAreaPixels={setBGCroppedAreaPixels}
                    onCropChange={onBGCropChange}
                    onCropComplete={onBGCropComplete}
                    onClose={handleBGCloseModal}
                    onCropImage={handleBGCropImage}
                     />
                  )}
                  
                  <button className='w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out' type="submit">Create Account</button>
                </div>
              </div>
            </Form>
          )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default AccountSetup;


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

  const uploadImageToCloudinary = async (croppedImageBase64: string) => {
    const blob = await fetch(croppedImageBase64).then(res => res.blob());
    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'esvik6y6'); 
    formData.append('cloud_name', 'dsirnl1mh'); 
  
    const res = await fetch("https://api.cloudinary.com/v1_1/dsirnl1mh/image/upload", {
      method: 'POST',
      body: formData
    });
  
    const data = await res.json();
    console.log(data.secure_url);
    return data.secure_url;
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
    <div className='w-screen'>
      <div className='w-screen bg-white h-11 '>
        <p className='text-center text-2xl font-bold'>Account Setup</p>
      </div>
      <div className='h-[130vh] flex justify-center mt-5 rounded-md '>
        <div className=" bg-white w-[70rem] md:w-[60rem] text-center rounded-md ">
          <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            >
            {({ values, setFieldValue, errors }) => (
            <Form>
              <div className='w-full h-[12rem] bg-[#32A6D5] rounded-md'>
              <img src={bgCroppedImage?bgCroppedImage:"https://getuikit.com/v2/docs/images/placeholder_600x400.svg"} className='w-full h-[11.99rem]' alt="" />
              
              
              </div>
              <div className='flex justify-center flex-col items-center -mt-12'>
                <div className='bg-blue-400 w-32 h-32 border rounded-full'>
                  <img src={croppedImage?croppedImage:"https://upload.wikimedia.org/wikipedia/commons/b/b5/Windows_10_Default_Profile_Picture.svg"} alt="Cropped" className='rounded-full' />
                </div>
                
              </div>
              <div className="flex justify-center flex-col w-[24rem] ml-[4rem] md:ml-[18rem]">
                <div className='flex flex-row gap-32'>
                <p className='mt-5 font-semibold text-[#837D7D]'>Username</p>
                <Field type="text" name="userName" className="mt-3 h-9  border border-neutral-300 rounded-md"  />
                </div>
                <ErrorMessage name="userName" component="div" className="text-red-500 ml-[7.1rem] w-full" />
                <div className='flex flex-row gap-32'>
                <p className='mt-5 font-semibold text-[#837D7D]'>Bio</p>
                <Field as="textarea" type="text" name="bio" className="mt-3 w-[30rem] h-9 ml-12 rounded-md border border-neutral-300" />
                </div>
                <ErrorMessage name="bio" component="div" className=" text-red-500 ml-[5.5rem] w-full" />
                <div className='flex flex-row gap-32'>
                <p className='mt-5 font-semibold rounded-md text-[#837D7D]'>Gender</p>

                <select name="gender"onChange={(e) => setFieldValue('gender', e.target.value)}
                className="mt-3 ml-5 h-9 border border-neutral-300 rounded-md ">
                <option value="">Select Gender</option> 
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                </select>     
                </div>           
                <ErrorMessage name="gender" component="div" className="text-red-500" />
                <div className='flex flex-row gap-32'>
                <p className='mt-5 font-semibold text-[#837D7D]'>Phone</p>
                <Field type="number" name="phone"  className="mt-3 ml-7 h-9 rounded-md border border-neutral-300" />
                </div>
                <ErrorMessage name="phone" component="div" className="text-red-500 ml-[6.4rem] w-full" />
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
                <label className="block mb-2  font-semibold text-[#837D7D]  dark:text-white">Upload Profile Photo </label>
                <input 
                      ref={inputRef} 
                      onChange={handleFileChange}  
                      onClick={() => setPreview(true)} 
                      accept="image/*"
                      className=" my-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                      type="file"
                />
                <ErrorMessage name="profileImage" component="div" className="text-red-500 ml-[6.4rem] w-full" />


                <label className="block mb-1 font-semibold text-[#837D7D] dark:text-white">Upload Background Image </label>
                <input 
                      type="file"
                      ref={inputRef}
                      onChange={handleBGFileChange}
                      accept="image/*"
                      className=" my-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                      onClick={() => setBGPreview(true)}
                />
                <ErrorMessage name="image" component="div" className="text-red-500 ml-[6.4rem] w-full" />


                
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
                
                <button className='mt-7 h-10 w-full bg-[#8B8DF2] text-white rounded-md' type="submit">Submit</button>
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

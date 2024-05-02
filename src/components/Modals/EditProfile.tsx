import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from "react-modal";

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { Area } from 'react-easy-crop';
import { toast } from 'sonner';
import getCroppedImg from '../../helpers/croppedImage';
import BGCropModal from './BGCropModal';
import CropModal from './CropModal';
import { uploadImageToCloudinary } from '../../helpers/cloudinaryUpload';
import { EditUserProfile } from '../../services/api/user/apiMethods';
import { login, updateUser } from '../../utils/reducers/authSlice';

function EditProfile({ isOpen, onClose }) {
    const user = useSelector((state: any) => state.auth.user);

        const [valid, setValid] = useState(false);
        const [description, setDescription] = useState(user.bio);
        const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [bgImage, setBGImage] = useState<File | null>(null);
  const [crop, setCrop] = useState<Area>({ x: 0, y: 0, width: 1, height: 1 });
  const [bgCrop, setBGCrop] = useState<Area>({ x: 0, y: 0, width: 1, height: 1 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [bgCroppedAreaPixels, setBGCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [bgCroppedImage, setBGCroppedImage] = useState<string | null>(null);
  const [img,setImg] = useState(false)
  const [preview, setPreview] = useState(true);
  const [bgPreview, setBGPreview] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBGModal, setShowBGModal] = useState(false);

      
        const dispatch = useDispatch();
        const formik = useFormik({
          initialValues: {
            bio: user.bio,
            userName:user.userName
          },
          validationSchema: Yup.object({
            bio: Yup.string().trim().min(7, "Enter something.."),
            userName: Yup.string().trim().min(5,"UserName should be more than 5 letters")
          }),
          onSubmit: async (values) => {
            console.log("Form submitted with values:", values);
            if (valid&&!img) {
            const profileImageUrl = await uploadImageToCloudinary(croppedImage);
            const bgImageUrl = await uploadImageToCloudinary(bgCroppedImage);
            console.log("UUUUU",user);
            
            const data = {
              userId: user._id,
              userName: values.userName===user.userName?undefined:values.userName,
              bio: values.bio,
              profileImage: profileImageUrl,
              bgImage: bgImageUrl
            };
            console.log("data before sendng",data);
            
              EditUserProfile(data)
              .then((response:any)=>{
                const data = response.data;
                console.log(data)
                if(response.status===200){
                  toast.success(data.message)
                  onClose();
                  dispatch(login({user:data}))
                  

                  
                }else{
                  toast.error(data.error);
              }
              })     
              
            }
          },
        });
    //   const handleSubmit = async()=>{
    //     const profileImageUrl = await uploadImageToCloudinary(croppedImage);
    //         const bgImageUrl = await uploadImageToCloudinary(bgCroppedImage);
    //         const data = {
    //           userId: user._id,
    //           bio: formik.values.bio,
    //           userName: formik.values.userName,
    //           profileImage: profileImageUrl,
    //           bgImage: bgImageUrl
    //         };
    //         if (valid) {
    //             console.log("sdfsdf",data);
                
    //           }
    //   }
        useEffect(() => {
          if (description.length >= 7 || image!==null || bgImage!==null) {
            setValid(true);
          } else {
            setValid(false);
          }
        }, [description,image,bgImage]);
        
        const fileInputRef = useRef<HTMLInputElement | null>(null); // Define useRef inside the component function body
        const bgFileInputRef = useRef(null); // Add this line

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const selectedImage = e.target.files[0];
//       if (selectedImage.type === 'image/png' || selectedImage.type === 'image/jpeg') {
//         setImage(selectedImage);
//         setShowModal(true);
//       }else {
//         toast.error('Only PNG and JPEG image files are allowed for the Profile image.');
//       }
//     }
//   };
//   const handleBGFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const selectedImage = e.target.files[0];
//       if (selectedImage.type === 'image/png' || selectedImage.type === 'image/jpeg') {
//         setBGImage(selectedImage);
//         setShowBGModal(true);
//       } else {
//         toast.error('Only PNG and JPEG image files are allowed for the background image.');
//       }
//     }
//   };
  

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
        setImg(false)
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
        setImg(false)
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
  const handleAddPhotoClick = () => {
    setImg(true)
    if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        console.error("fileInputRef is null!"); 
      }
    }; 
  const handleAddBGClick = () => {
    setImg(true)
    bgFileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (
      selectedImage.type === "image/png" ||
      selectedImage.type === "image/jpeg"
    ) {
      setImage(selectedImage);
      setShowModal(true);
    } else {
      toast.error(
        "Only PNG and JPEG image files are allowed for the post."
      );
    }
}


const handleBGImageChange = (e) => {
    e.preventDefault()
    const selectedImage = e.target.files[0];
    if (
      selectedImage.type === "image/png" ||
      selectedImage.type === "image/jpeg"
    ) {
      setBGImage(selectedImage);
      setShowBGModal(true);
    } else {
      toast.error(
        "Only PNG and JPEG image files are allowed for the post."
      );
    }
}

      
        return (
          <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
      
            <form onSubmit={formik.handleSubmit}>
            {user.profileImage && (
                <div className="rounded-md w-full h-32 relative">
                  <>
                    <img
                      src={bgCroppedImage?bgCroppedImage:user.bgImage}
                      alt="Uploaded"
                      className="object-conain w-full h-full rounded-md object-cover"
                    />
                  </>
                </div>
              )}
              {user.profileImage && (
                <div className=" ml-auto mr-auto rounded-md w-20 h-20 -mt-10  relative">
                  <>
                    <img
                      src={croppedImage?croppedImage:user.profileImage}
                      alt="Uploaded"
                      className="object-conain w-full h-full rounded-full object-cover"
                    />
                  </>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Bio:</label>
                <input
                  type="text"
                  name="bio"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formik.values.bio}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setDescription(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.bio && formik.errors.bio && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.bio}
                  </div>
                )}
                <label className="block text-sm font-medium mb-2">UserName:</label>
                <input
                  type="text"
                  name="userName"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formik.values.userName}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.userName && formik.errors.userName && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.userName}
                  </div>
                )}
              </div>
              
              <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
              <div className="mb-4 flex">
              <button
  onClick={handleAddBGClick}
  className="rounded-md border border-2 pl-1 pr-1 border-slate-400"
>
  <input
    type="file"
    onChange={handleBGImageChange}
    ref={bgFileInputRef} // Use bgFileInputRef here
    className="hidden"
  />
  <FontAwesomeIcon icon={faImage} /> Change BG
</button>

<button
  onClick={handleAddPhotoClick}
  className="rounded-md border border-2 pl-1 pr-1 ml-auto border-slate-400"
>
  <input
    type="file"
    onChange={handleImageChange}
    ref={fileInputRef}
    className="hidden"
  />
  <FontAwesomeIcon icon={faImage} /> Change profile
</button>

            
              </div>
                {valid && (
                  <button
                    type="submit"
                    className={` ${valid ? "bg-blue-500" : "bg-slate-400"} ${
                      valid ? "" : "disabled"
                    } h-8 flex items-center ml-auto text-white px-4 py-2 rounded-md`}
                  >
                    Add
                  </button>
                )}
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
            </form>
          </Modal>
        );
      
}

export default EditProfile;
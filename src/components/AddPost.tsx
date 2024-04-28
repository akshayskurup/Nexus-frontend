import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronRight,
  faImage,
  faMagnifyingGlass,
  faMultiply,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import Modal from "react-modal";
import { addPost } from "../services/api/user/apiMethods";
import { toast } from "sonner";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Area } from "react-easy-crop";
import CropModal from "./Modals/CropModal";
import getCroppedImg from "../helpers/croppedImage";
import PostCropModal from "./Modals/PostCropModal";
import { uploadImageToCloudinary } from "../helpers/cloudinaryUpload";

// Make sure Modal is imported properly
// Ensure that the Modal is properly styled and rendered in the component tree

function AddPostModal({ isOpen, onClose }) {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState<Area>({ x: 0, y: 0, width: 1, height: 1 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string>(null);
  const [preview, setPreview] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [addImageBtn, setAddImageBtn] = useState(true);
  const [valid, setValid] = useState(false);
  const [description, setDescription] = useState("");

  const user = useSelector((state:any)=>state.auth.user);
  const fileInputRef = useRef(null);
  

  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().trim().min(7, "Enter something.."),
    }),
    onSubmit: async(values) => {
      console.log("Form submitted with values:", values);
      console.log("Image:", image);
      const imageUrl = await uploadImageToCloudinary(croppedImage);
      const data = {
        userId: user._id,
        description: values.description,
        image:imageUrl
      };
      if(valid){

          addPost(data)
          .then((response:any)=>{
            const data = response.data;
            if(response.status===200){
                onClose()
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
          })
      }

    },
  });

  useEffect(() => {
    if (image && description.length >=7) {
        console.log(valid);
        setValid(true);
      
    } else {
        console.log(valid);
        
      setValid(false);
    }
  }, [image, description]);

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
    //   if (file) {
    //       const reader = new FileReader();
    //       reader.onload = () => {
    //           setImage(reader.result);
    //       };
    //       reader.readAsDataURL(file);
    //   }
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setAddImageBtn(true);
  };

  const onCropChange = (crop: Area, croppedAreaPixels: Area) => {
    setCrop(crop);
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );
  const handleCropImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (croppedAreaPixels && image) {
        const croppedImageBase64 = await getCroppedImg(
          image,
          croppedAreaPixels
        );

        setCroppedImage(croppedImageBase64);
        setShowModal(false);
        setPreview(false);
        setAddImageBtn(false);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setImage(null);
    setCrop({ x: 0, y: 0, width: 1, height: 1 });
    setCroppedAreaPixels(null);
    setPreview(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Add Post</h2>
      <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description:</label>
          <input
            type="text"
            name="description"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formik.values.description}
            onChange={(e) => {
                formik.handleChange(e);
                setDescription(e.target.value);
              }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </div>
          )}
        </div>
        {image && (
          <div className="rounded-md w-36 h-48 relative">
            <>
              <div
                className="absolute top-2 right-2 flex justify-center items-center bg-black opacity-75 w-6 h-6 rounded-full"
                onClick={handleRemoveImage}
              >
                <FontAwesomeIcon icon={faMultiply} className="text-white" />
              </div>
              <img
                src={croppedImage}
                alt="Uploaded"
                className="object-conain w-full h-full rounded-md object-cover"
              />
            </>
          </div>
        )}
        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="mb-4 flex space-x-56">
          {addImageBtn && (
            <button
              onClick={handleAddPhotoClick}
              className="rounded-md border border-2 w-28 border-slate-400 "
            >
              <input
                type="file"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
              <FontAwesomeIcon icon={faImage} /> Add photo
            </button>
          )}
          {valid && <button
            type="submit"
            className={` ${valid ? "bg-blue-500" : "bg-slate-400"} ${
              valid ? "" : "disabled"
            } h-8 flex items-center text-white px-4 py-2 rounded-md`}
          >
            Add
          </button>}
          
        </div>
      </form>
      {showModal && (
        <PostCropModal
          image={URL.createObjectURL(image)}
          crop={crop}
          setCroppedAreaPixels={setCroppedAreaPixels}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onClose={handleCloseModal}
          onCropImage={handleCropImage}
        />
      )}
    </Modal>
  );
}

//------------------------------------------------------------------------------
function AddPost() {
  const user = useSelector((state) => state.auth.user);
  const [isInputValid, setIsInputValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().trim().min(7, "Enter something.."),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      const data = {
        userId: user._id,
        description: values.description,
      };
      confirmAlert({
        title: "Confirm",
        message: "Are you sure you want to upload the post?",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              addPost(data).then((response: any) => {
                const data = response.data;
                if (response.status === 200) {
                  toast.success(data.message);
                  console.log("data", data);
                } else {
                  toast.error(data.message);
                }
              });
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    },
  });

  const handleInputChange = (e) => {
    formik.handleChange(e);

    formik.validateForm().then((errors) => {
      setIsInputValid(!errors.description && e.target.value.trim() !== "");
      if (e.target.value.length === 1 || e.target.value.length === 0) {
        setIsInputValid(false);
      }
    });
  };

  return (
    <div className="bg-white w-[40rem] ml-3 rounded-md">
      <div className="flex ml-5 mt-5">
        <img
          className="w-9 h-9 mt-3 rounded-full"
          src={user.profileImage}
          alt=""
        />
        <div className="ml-5">
          <div className="bg-[#EAEAEA] mt-3 h-8 w-[32rem] rounded-full flex items-center">
            <FontAwesomeIcon
              className="ml-2 text-[#837D7D]"
              icon={faMagnifyingGlass}
            />
            <input
              type="text"
              name="description"
              className="ml-2 bg-transparent border-none focus:outline-none flex-grow"
              placeholder="Say Something....."
              value={formik.values.description}
              onChange={handleInputChange}
            />
            {isInputValid && (
              <button type="submit" onClick={formik.handleSubmit}>
                <FontAwesomeIcon
                  className="ml-7 text-[#2892FF]"
                  size="xl"
                  icon={faCircleChevronRight}
                />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="text-center font-semibold">OR</p>
      <div className="flex justify-center ">
        <button
          className="mt-1 h-8 w-1/2  bg-[#2892FF] text-white rounded-xl mb-4"
          onClick={openModal}
        >
          Add Post
        </button>
      </div>

      {isModalOpen && (
        <AddPostModal isOpen={isModalOpen} onClose={closeModal} />
      )}
    </div>
  );
}

export default AddPost;
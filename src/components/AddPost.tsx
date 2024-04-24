import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";

function AddPost() {
    const user = useSelector((state:any)=>state.auth.user);
    const [isInputValid, setIsInputValid] = useState(false);

    const formik = useFormik({
        initialValues:{
            description:""
        },
        validationSchema:Yup.object({
            description:Yup.string().trim().min(7,"Enter something..")
        }),
        onSubmit:(values)=>{
            console.log("Form submitted with values:", values);
        }
    })

    const handleInputChange = (e) => {
        formik.handleChange(e);
        
        formik.validateForm().then((errors) => {
            setIsInputValid(!errors.description && e.target.value.trim() !== "");
            if(e.target.value.length===1 || e.target.value.length===0){
                setIsInputValid(false)
            }
        });
    }

  return (
    <div className=" bg-white  w-[40rem] ml-3 rounded-md">
      <div className="flex ml-5 mt-5">
        <img className="w-9 h-9 mt-3 rounded-full" src={user.profileImage} alt="" />
        <form onSubmit={formik.handleSubmit}> {/* Form element added here */}
          <div className="bg-[#EAEAEA] mt-3 ml-8 h-8 w-[32rem] rounded-full flex items-center">
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
              <button type="submit">
                <FontAwesomeIcon
                  className="ml-7 text-[#2892FF]"
                  size="xl"
                  icon={faCircleChevronRight}
                />
              </button>
            )}
          </div>
          
        </form>
      </div>
      <p className="text-center font-semibold">OR</p>
      <div className="flex justify-center">
        <button className="mt-1 h-8 w-1/2 bg-[#2892FF] text-white rounded-xl mb-4">Add Post</button>
      </div>
    </div>
  );
}

export default AddPost;

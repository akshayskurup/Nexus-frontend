import {Formik,Form,Field,ErrorMessage} from "formik";
import * as yup from "yup";
import { adminPostLogin } from "../../services/api/admin/apiMethods";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../utils/reducers/adminAuthSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


function AdminLogin() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const initialValues = {
        email:"",
        password:""
    };
    
    const admin = useSelector((state:any)=>state.adminAuth.admin);
    useEffect(()=>{
        if(admin){
            navigate('/admin/all-users')
        }
    },[])

    const validationSchema = yup.object({
        email:yup.string().email("Invalid email address").required("Required"),
        password:yup.string().min(6,"Password must be at least 6 characters").required("Required")
    });

    const onSubmit = (values:{email:string,password:string})=>{
        adminPostLogin(values)
        .then((response:any)=>{
            const data = response.data;
            if(response.status===200){
                console.log(data);
                dispatch(adminLogin({admin:data}))  
                toast.success(data.message)
                navigate('/admin/all-users')
            }else{
                toast.error(data.message)
            }
        })
    }
    return (
        <div className='bg-[#F7FCF6] grid md:grid-cols-2 items-center justify-center w-screen h-screen'> 
        <div className='hidden md:block'> 
            <img className="h-[100vh] w-[50vw]" src="/images/Img.jpg" alt="" />
        </div>
        <div className='bg-[#F7FCF6] md:col-start-2 pl-[9vw] mt-5 md:mt-[-90px]'> 
            <p className='text-5xl font-bold text-black'>Admin Login</p>
            <p className='mt-7 text-[#837D7D]'>Welcome back!</p>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                <Form className="mt-5 w-full md:w-[18.5rem]">
                    <p className="text-[#837D7D]">Email:</p>
                    <Field className="mt-3 h-9 w-full border border-neutral-300" type="text" name="email" />
                    <ErrorMessage name="email" component="div" className="text-red-500" />
                    <p className="mt-3 text-[#837D7D]">Password:</p>
                    <Field className="mt-3 h-9 w-full border border-neutral-300" type="password" name="password" />
                    <ErrorMessage name="password" component="div" className="text-red-500" />
                    <button className="mt-4 h-10 w-full bg-[#8B8DF2] text-white rounded-md" type="submit">Login</button>
                </Form>
            </Formik>
        </div>
    </div>
    
    
      )
}

export default AdminLogin
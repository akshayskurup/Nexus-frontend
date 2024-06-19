
import {Formik,Form,Field,ErrorMessage} from "formik";
import * as yup from "yup";
import { postLogin } from "../../services/api/user/apiMethods";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login,updateToken } from "../../utils/reducers/authSlice";
import HashLoader from "react-spinners/HashLoader";
import { useEffect, useState } from "react";

function Login() {
    
    const user = useSelector((state:any)=>state.auth.user);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const initialValues = {
        email:"",
        password:""
    };

    const validationSchema = yup.object({
        email:yup.string().email("Invalid email address").required("Required"),
        password:yup.string().min(6,"Password must be at least 6 characters").required("Required")
    });

    useEffect(()=>{
        if(user&&!user.isBlocked){
            navigate('/home')
        }
    },[]);

    const onSubmit = async  (values: { email: string; password: string }) => {
        setLoading(true);
        console.log("dataa",loading)
        try {
            await postLogin(values)
            .then((response: any) => {
                const data = response.data;
                if (response.status === 200) {
                    if (data.isBlocked === true) {
                        return toast.error("No Access!");
                    }
                    dispatch(updateToken({ token: data.token }));
                    localStorage.setItem('refreshToken',data.refreshToken)
                    
                    // Check if data.bio is empty
                    if (data.bio == "") {
                        localStorage.setItem("userId",data._id)
                        navigate('/account-setup');
                    } else {
                        dispatch(login({ user: data }));
                        toast.info(data.message);
                        navigate('/home');
                    }
                } else {
                    toast.error(data.message);
                }
            });
        } catch (error) {
            console.log(error)
        } finally {
      setLoading(false);
    }
        
    };
  return (
    <div className='bg-[#F7FCF6] h-screen grid md:grid-cols-2 items-center justify-center w-screen'> 
    <div className='relative hidden md:block'> 
    <img className="h-[100vh] w-[50vw] object-cover" src="/images/Img.jpg" alt="Welcome Image" />
    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl tracking-wide font-bold">Welcome Back !</p>
</div>

    <div className='bg-[#F7FCF6] -ml-5 md:col-start-2 pl-[9vw]  mt-5 md:mt-[-90px] md:ml-5'> 
        <p className='text-5xl font-bold'>Login</p>
        <p className='mt-7 text-[#837D7D]'>Welcome back! Please login to your account</p>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            <Form className="mt-5 w-full md:w-[18.5rem]">
                <p className="text-[#837D7D]">Email:</p>
                <Field className="mt-3 h-9 w-full border border-neutral-300" type="text" name="email" />
                <ErrorMessage name="email" component="div" className="text-red-500" />
                <p className="mt-3 text-[#837D7D]">Password:</p>
                <Field className="mt-3 h-9 w-full border border-neutral-300" type="password" name="password" />
                <ErrorMessage name="password" component="div" className="text-red-500" />
                <Link className="flex mt-2 text-xs text-[#837D7D] w-full md:w-[96px]" to="/forget-password">Forget Password?</Link> 
                <button className="mt-4 h-10 w-full bg-[#8B8DF2] text-white rounded-md hover:shadow-md" type="submit" disabled={loading}>
                {loading ? <HashLoader size={20} color="#ffffff" className="mt-1" /> : "Login"}
                </button>

                <Link className="flex mt-2 text-xs text-[#837D7D] w-full" to="/signup">New User? Signup</Link> 
            </Form>
        </Formik>
    </div>
</div>


  )
}

export default Login
import { Formik,Field, Form, ErrorMessage } from "formik";
import * as yup from "yup"; 
import { postResetPass } from "../../services/api/user/apiMethods";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


function ChangePassword() {
    const initialValues = {
        password:"",
        confirmPassword:""
    };
    const navigate = useNavigate()

    const validationSchema = yup.object({
        password:yup.string().min(6,"Password must be at least 6 characters").required("Required"),
        confirmPassword:yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password')
    });

    const onSubmit = (values:{password:string,confirmPassword:string})=>{
        postResetPass(values)
        .then((response:any)=>{
            const data = response.data;
            if(response.status===200){
                toast.success(data.message);
                navigate('/login');
            }else{
                toast.error(data.message);
            }
        })
    }
  return (
    <div className='grid md:grid-cols-2 items-center justify-center'> 
    <div className='hidden md:block'> 
        <img className="h-[100vh] w-[50vw]" src="../public/images/Img.jpg" alt="" />
    </div>
    <div className='md:col-start-2 pl-[9vw] mt-5 md:mt-[-90px]'> 
        <p className='text-5xl font-bold'>Change Password</p>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            <Form className="mt-5 w-full md:w-[18.5rem]">
                <p className="text-[#837D7D]">New Password:</p>
                <Field className="mt-3 h-9 w-full border border-neutral-300" type="password" name="password" />
                <ErrorMessage name="password" component="div" className="text-red-500" />
                <p className="mt-3 text-[#837D7D]">Confirm Password:</p>
                <Field className="mt-3 h-9 w-full border border-neutral-300" type="password" name="confirmPassword" />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
                <button className="mt-4 h-10 w-full bg-[#8B8DF2] text-white rounded-md" type="submit">Submit</button>
            </Form>
        </Formik>
    </div>
</div>
  )
}

export default ChangePassword
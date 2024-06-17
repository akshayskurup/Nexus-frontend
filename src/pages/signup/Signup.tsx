
import {Formik,Form,Field,ErrorMessage} from "formik"
import * as yup from "yup"
import { Link, useNavigate } from 'react-router-dom'
import { postOTP, postRegister, postResendOtp } from "../../services/api/user/apiMethods"
import { toast } from "sonner"
import { useState, useRef, useEffect } from "react"
import HashLoader from "react-spinners/HashLoader";



export interface OTPModalProps {
    email: string;
    onClose: () => void;
}
function OTPModal({ email, onClose }: OTPModalProps): JSX.Element {
    const [OTP, setOtp] = useState(['', '', '', '', '', '']);
    const [timer,setTimer] = useState(60)
    const [resendVisible,setResendVisible] = useState(false)
    const [loading ,setLoading] = useState(false)
    const otpInputs = Array.from({ length: 6 }, (_, i) => i); 
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();

    

    useEffect(()=>{
        const interval = setInterval(()=>{
            setTimer((prevTimer)=>{
                if(prevTimer===0){
                    setResendVisible(true);
                    clearInterval(interval);
                    return 0;
                }
                return prevTimer-1
            })
        },1000)
        return()=>clearInterval(interval);
    },[timer,resendVisible]);


    const handleChange = (index: number, value: string) => {
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newOtp = [...OTP];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === 'Backspace' && !OTP[index] && index > 0) {
            const newOtp = [...OTP];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend =()=>{
        setTimer(60);
        setResendVisible(false);
        setOtp(['', '', '', '', '', '']);
        postResendOtp()
        .then((response:any)=>{
            const data = response.data;
            if(response.status===200){
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        })
    }

    const handleSubmit = async()=>{
        setLoading(true)
        const otp:string = OTP.join('');
        try {
            await postOTP({otp})
            .then((response:any)=>{
                const data = response.data;
                if(response.status===200){
                    toast.success(data.message);
                    localStorage.setItem('userId',data.newUser._id);
                    navigate('/login')
                }else{
                    toast.error(data.error);
                }
            }) 
        } catch (error:any) {
            toast.error(error)
        } finally {
          setLoading(false)
        }
        
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500 bg-opacity-50">
            <div className="bg-white p-8 w-[500px] rounded-lg shadow-md">
                <span className="absolute top-0 right-0 m-4 text-gray-700 cursor-pointer" onClick={onClose}>
                    &times;
                </span>
                <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
                <p>An OTP has been sent to {email}.</p>
                <p className="mb-4">Please enter the OTP below:</p>
                <div className="grid grid-cols-6 gap-4">
                    {otpInputs.map((index) => (
                        <input
                            key={index}
                            ref={(ref) => inputRefs.current[index] = ref}
                            type="text"
                            value={OTP[index]}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            maxLength={1}
                            className="w-full h-12 border border-gray-300 rounded-md px-4 text-center"
                        />
                    ))}
                    {timer > 0 && (
                        <p className= "w-[190px] text-gray-600 mt-2">Resend OTP in {timer} seconds</p>
                    )}
                    {timer === 0 && (
                        <button
                            className="mt-2 text-blue-500 hover:underline focus:outline-none"
                            onClick={handleResend}
                            disabled={!resendVisible}
                        >
                            Resend
                        </button>
                    )}
                </div>
                <div className="flex flex-col items-center ">
                {OTP.every((digit) => !isNaN(parseInt(digit))) && OTP.length === 6 && (
                <button
                type="submit"
                onClick={handleSubmit}
                className="w-[9rem] mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
                >
              {loading ? <HashLoader size={20} className='ml-auto mr-auto' color="#ffffff" /> : "Submit OTP"}

            
        </button>
    )}
                
                </div>
            </div>
        </div>
    );
}







function Signup() {
    const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [loading ,setLoading] = useState(false)
    
    const initialValues = {
        name:"",
        email:"",
        password:"",
        confirmPassword:""
    }
    const validationSchema = yup.object({
        name:yup.string().matches(/^[A-Za-z]+$/, "Name must contain only characters")
        .min(3,"Name must be at least 3 character").required("Required").max(25,"Name cannot be more than 25 characters"),
        email:yup.string().email("Invalid email address").required("Required"),
        password:yup.string().min(6,"Password must be at least 6 characters").required("Required"),
        confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password')
    })
    const onSubmit = async(values:{name:string,email:string,password:string,confirmPassword:string})=>{
        setLoading(true)
        try {
            await postRegister(values)    
        .then((response:any)=>{
            const data = response.data;
            if(response.status===200){
                toast.success(data.message)
                setEmail(values.email);
                setShowOTPModal(true);
                
            }else{
                toast.error(data.message)
            }
        })
        } catch (error) {
            toast.error(error)
        } finally {
          setLoading(false)
        }
    }
  return (
    <div className=' bg-[#F7FCF6] w-screen h-screen  grid md:grid-cols-2 items-center justify-center'>
        <div className='relative hidden md:block'> 
    <img className="h-[100vh] w-[50vw] object-cover" src="../public/images/Img.jpg" alt="Welcome Image" />
    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl tracking-wide font-bold">Join With Us !</p>
</div>
        <div className='bg-[#F7FCF6] md:col-start-2 pl-[9vw] mt-6 md:mt-[-90px]'>
            <p className='text-5xl mb-4 font-bold'>Signup</p>
            
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            <Form className="-ml-5 w-full md:w-[18.5rem]">
            <p className="text-[#837D7D]">Name:</p>
            <Field className="mt-3 h-9 w-full border border-neutral-300" type="text" name="name" />
            <ErrorMessage name="name" component="div" className="text-red-500" />
            <p className="text-[#837D7D]">Email:</p>
            <Field className="mt-3 h-9 w-full border border-neutral-300" type="text" name="email" />
            <ErrorMessage name="email" component="div" className="text-red-500" />
            <p className="text-[#837D7D]">Password:</p>
            <Field className="mt-3 h-9 w-full border border-neutral-300" type="password" name="password" />
            <ErrorMessage name="password" component="div" className="text-red-500" />
            <p className="text-[#837D7D]">Confirm Password:</p>
            <Field className="mt-3 h-9 w-full border border-neutral-300" type="password" name="confirmPassword" />
            <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
            
            <button  type="submit" className="mt-4 h-10 w-full bg-[#8B8DF2] text-white rounded-md hover:shadow-md" disabled={loading}>
              {loading ? <HashLoader size={20} className='mt-1' color="#ffffff" /> : "Signup"}

            </button>
            <Link className="flex mt-2 text-xs text-[#837D7D] w-full md:w-[196px]" to="/login">Already have an account? SignIn</Link>
            
            </Form>
            </Formik>
            {showOTPModal && <OTPModal email={email} onClose={() => setShowOTPModal(false)} />}
        </div>
    </div>
  )
}

export default Signup
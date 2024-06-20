import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { forgetOtp, postForgetPassword, postResendOtp } from '../../services/api/user/apiMethods';
import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
import { OTPModalProps } from '../signup/Signup';
import { useNavigate } from 'react-router-dom';



function OTPModal({email,onClose}:OTPModalProps){
    const [OTP,setOtp] = useState(['','','','','','']);
    const [timer,setTimer] = useState(60)
    const [resendVisible,setResendVisible] = useState(false)
    const otpInputs = Array.from({ length: 6 }, (_, i) => i); 
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate()

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
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        })
    }

    const handleSubmit = ()=>{
        const otp:string = OTP.join('');
        forgetOtp({otp})
        .then((response:any)=>{
            const data = response.data;
            if(response.status===200){
                toast.success(data.message);
                navigate('/change-password');
            }else{
                toast.error(data.error)
            }
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500 bg-opacity-50">
            <div className="bg-white p-8 w-[500px] rounded-lg shadow-md">
                <span className="absolute top-0 right-0 m-4 text-gray-700 cursor-pointer" onClick={onClose}>
                    &times;
                </span>
                <h2 className="text-xl font-bold mb-4 text-black">Enter OTP</h2>
                <p className='text-black'>An OTP has been sent to {email}.</p>
                <p className="mb-4 text-black">Please enter the OTP below:</p>
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
                            className="w-full h-12 border  border-gray-300 rounded-md px-4 text-center"
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
                >
            Submit OTP
        </button>
    )}
                
                </div>
            </div>
        </div>
    );
}


function ForgetPassword() {
    const [email,setEmail] = useState('');
    const [showOTPModal,setShowOTPModal] = useState(false);
    const initialValues = {
        email:""
    };
    
    const validationSchema = yup.object({
        email:yup.string().email("Invalid email address").required("Required")
    });
    const onSubmit = (values:{email:string})=>{
        postForgetPassword(values)
        .then((response:any)=>{
            const data = response.data;
            setEmail(values.email);
            if(response.status===200){
                setShowOTPModal(true);
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        })
    };
  return (
    <div className='bg-[#F7FCF6] h-screen w-screen grid md:grid-cols-2 items-center justify-center'>
        <div className='hidden md:block'>
            <img className="h-[100vh] w-[50vw]" src="/images/Img.jpg" alt="" />
        </div>
        <div className='bg-[#F7FCF6] -ml-8 md:col-start-2 pl-[9vw] mt-5 md:mt-[-210px] md:ml-8'>
            <p className=' text-4xl font-bold text-black'>Forget Password?</p>
            <p className='mt-7 text-[#837D7D]'>Enter your email</p>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                <Form className="mt-2 w-full md:w-[18.5rem]">
                <Field name="email" className="mt-3 h-9 w-full border border-neutral-300" type="text"  />
                <ErrorMessage name="email" component="div" className="text-red-500" />
            
                <button className=" mt-4 h-10 w-full bg-[#8B8DF2] text-white rounded-md hover:shadow-md">Submit</button>
            </Form>
            </Formik>
        </div>
        {showOTPModal && <OTPModal email={email} onClose={()=>setShowOTPModal(false)} />}
    </div>
  )
}

export default ForgetPassword
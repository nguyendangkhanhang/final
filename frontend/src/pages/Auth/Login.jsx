import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
        if (userInfo) {
          navigate(redirect);
        }
      }, [navigate, redirect, userInfo]);
    
      const submitHandler = async (e) => {
        e.preventDefault();
        try {
          const res = await login({ email, password }).unwrap();
          console.log(res);
          dispatch(setCredentials({ ...res }));
          navigate(redirect);
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      };

    return (
      <form onSubmit={submitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
          <div className='inline-flex items-center gap-2 mb-2 mt-10'>
              <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
              <p className='prata-regular text-3xl'>LOGIN</p>
              <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
          </div>
          <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              type="email" 
              className='w-full px-3 py-2 border border-gray-800' 
              placeholder='Email' required
          />
          <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              type="password" 
              className='w-full px-3 py-2 border border-gray-800' 
              placeholder='Password' required
          />
          <div className='w-full flex justify-between text-sm mt-[-8px]'>
              <p className='cursor-pointer'>Forgot your password?</p>
              <p>
                New Customer? 
                <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className='text-black hover:underline'> Register</Link>
              </p>
          </div>
          <button disabled={isLoading} type="submit" className='bg-black text-white font-light px-8 py-2 mt-4'>
              {isLoading ? "Signing In..." : "Sign In"}
          </button>
          {isLoading && <Loader />}
      </form>
    );
};
    
export default Login



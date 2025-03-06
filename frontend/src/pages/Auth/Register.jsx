import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <form onSubmit={submitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        <p className='prata-regular text-3xl'>REGISTER</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      <input 
        onChange={(e) => setName(e.target.value)} 
        value={username} 
        type="text" 
        className='w-full px-3 py-2 border border-gray-800' 
        placeholder='Name' required
      />
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
      <input 
        onChange={(e) => setConfirmPassword(e.target.value)} 
        value={confirmPassword} 
        type="password" 
        className='w-full px-3 py-2 border border-gray-800' 
        placeholder='Confirm Password' required
      />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p>Already have an account? 
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className='text-black hover:underline'> Login</Link>
        </p>
      </div>
      <button disabled={isLoading} type="submit" className='bg-black text-white font-light px-8 py-2 mt-4'>
        {isLoading ? "Registering..." : "Register"}
      </button>
      {isLoading && <Loader />}
    </form>
  );
};


export default Register;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation, useLogoutMutation } from "../../redux/api/usersApiSlice";
import { setCredentials, logout } from "../../redux/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import Title from '../../components/Title';
import ScrollAnimator from '../../components/ScrollAnimator';
import { FaUser, FaEnvelope, FaLock, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#efe9e0] min-h-screen">
      <ScrollAnimator>
        <div 
          className="relative h-64 md:h-80 flex items-center justify-center text-black bg-white overflow-hidden"
        >
          <div className='relative z-10 text-center px-4'>
            <div className='text-7xl text-center'>
              <Title text1={'USER'} text2={'PROFILE'} />
            </div>
            <p className="mt-2 text-lg md:text-xl text-[#5b3f15]">Manage your account and preferences</p>
          </div>
        </div>
        <div className="bg-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="block" fill="#efe9e0">
            <path d="M1440,50 C1200,100 900,0 720,0 C540,0 240,100 0,50 L0,100 L1440,100 Z"></path>
          </svg>
        </div>
      </ScrollAnimator>

      <div className="max-w-[1400px] mx-auto pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 rounded-full bg-[#efe9e0] flex items-center justify-center mb-4">
                  <FaUser className="text-6xl text-[#5b3f15]" />
                </div>
                <h3 className="text-xl font-semibold text-[#5b3f15]">{userInfo.username}</h3>
                <p className="text-[#bd8837]">{userInfo.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'profile' ? 'bg-[#efe9e0] text-[#5b3f15]' : 'text-[#5b3f15] hover:bg-[#efe9e0]'
                  }`}
                >
                  <FaUser className="text-lg" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'settings' ? 'bg-[#efe9e0] text-[#5b3f15]' : 'text-[#5b3f15] hover:bg-[#efe9e0]'
                  }`}
                >
                  <FaCog className="text-lg" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={logoutHandler}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl text-[#5b3f15] hover:bg-[#efe9e0] transition-all duration-300"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-[#5b3f15]">Profile Information</h2>
                  <form onSubmit={submitHandler} className="space-y-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-[#bd8837]" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter name"
                        className="w-full pl-10 p-4 border border-[#efe9e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent transition-all duration-300"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-[#bd8837]" />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter email"
                        className="w-full pl-10 p-4 border border-[#efe9e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent transition-all duration-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-[#bd8837]" />
                      </div>
                      <input
                        type="password"
                        placeholder="Enter password"
                        className="w-full pl-10 p-4 border border-[#efe9e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent transition-all duration-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-[#bd8837]" />
                      </div>
                      <input
                        type="password"
                        placeholder="Confirm password"
                        className="w-full pl-10 p-4 border border-[#efe9e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:border-transparent transition-all duration-300"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="w-full bg-[#5b3f15] text-white py-4 px-6 rounded-xl hover:bg-[#bd8837] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#bd8837] focus:ring-offset-2"
                      >
                        Update Profile
                      </button>
                    </div>

                    {loadingUpdateProfile && (
                      <div className="flex justify-center">
                        <Loader />
                      </div>
                    )}
                  </form>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-[#5b3f15]">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-[#efe9e0] rounded-xl">
                      <div>
                        <h3 className="font-medium text-[#5b3f15]">Email Notifications</h3>
                        <p className="text-sm text-[#bd8837]">Receive updates about your orders and promotions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#efe9e0] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#bd8837] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#efe9e0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5b3f15]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#efe9e0] rounded-xl">
                      <div>
                        <h3 className="font-medium text-[#5b3f15]">Two-Factor Authentication</h3>
                        <p className="text-sm text-[#bd8837]">Add an extra layer of security to your account</p>
                      </div>
                      <button className="bg-[#5b3f15] text-white py-2 px-4 rounded-lg hover:bg-[#bd8837] transition-colors duration-300">
                        Enable
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#efe9e0] rounded-xl">
                      <div>
                        <h3 className="font-medium text-[#5b3f15]">Delete Account</h3>
                        <p className="text-sm text-[#bd8837]">Permanently delete your account and all data</p>
                      </div>
                      <button className="bg-[#5b3f15] text-white py-2 px-4 rounded-lg hover:bg-[#bd8837] transition-colors duration-300">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
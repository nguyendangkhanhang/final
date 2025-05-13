import React from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Header = ({ setAdminInfo }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('adminToken'); 
    setAdminInfo(null);
    navigate('/admin');
    toast.success('Logged out successfully');
  };

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img className='w-[max(10%,80px)]' src={assets.logo} alt='Admin Logo' />
      <button
        onClick={handleLogout}
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'
      >
        Logout
      </button>
    </div>
  );
};

export default Header;

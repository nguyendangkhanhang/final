import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineSearch,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import {assets} from '../../assets/assets'

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <nav className="flex justify-between items-center bg-white shadow-md fixed w-full top-0 z-50 px-[5%] py-3">
      <Link to="/" className="flex items-center">
        <img className="w-[max(10%,170px)]" src={assets.logo} alt="Logo" />
      </Link>

      <ul className="flex space-x-10 text-gray-800 text-lg font-medium">
        <li>
          <Link to="/" className="hover:text-pink-500 transition">HOME</Link>
        </li>
        <li>
          <Link to="/shop" className="hover:text-pink-500 transition">COLLECTION</Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-pink-500 transition">ABOUT</Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-pink-500 transition">CONTACT</Link>
        </li>
      </ul>

      <div className="flex items-center space-x-6 text-xl">
        <Link to="/shop" className="hover:text-pink-500 transition">
          <AiOutlineSearch className="cursor-pointer hover:text-pink-500" />
        </Link>

        <Link to="/cart" className="relative">
          <AiOutlineShoppingCart className="hover:text-pink-500" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 rounded-full">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </Link>

        {userInfo ? (
          <div className="relative group">
            <AiOutlineUser className="cursor-pointer hover:text-pink-500" />
            <div className="absolute hidden group-hover:block right-0 bg-white shadow-lg rounded-md p-2">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              <Link to="/userorder" className="block px-4 py-2 hover:bg-gray-100">Order</Link>
              <button
                onClick={logoutHandler}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="text-gray-800 hover:text-pink-500 text-lg font-medium">LOGIN</Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
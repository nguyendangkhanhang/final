import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineSearch,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
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


  return (
    <nav className="flex justify-between items-center bg-white shadow-md fixed w-full top-0 z-50 px-[5%] py-3">
      <Link to="/" className="flex items-center">
        <img className="w-[max(10%,170px)]" src={assets.logo} alt="Logo" />
      </Link>

      <ul className="flex space-x-10 text-gray-800 text-lg font-medium">
        <li>
          <Link to="/" className="relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-gray-800 after:transition-all after:duration-300 hover:after:w-full">HOME</Link>
        </li>
        <li>
          <Link to="/shop" className="relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-gray-800 after:transition-all after:duration-300 hover:after:w-full">COLLECTION</Link>
        </li>
        <li>
          <Link to="/coupon" className="relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-gray-800 after:transition-all after:duration-300 hover:after:w-full">COUPON</Link>
        </li>
        <li>
          <Link to="/about" className="relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-gray-800 after:transition-all after:duration-300 hover:after:w-full">ABOUT</Link>
        </li>
        <li>
          <Link to="/contact" className="relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-gray-800 after:transition-all after:duration-300 hover:after:w-full">CONTACT</Link>
        </li>
      </ul>

      <div className="flex items-center space-x-6 text-xl">
        <Link to="/shop" className="inline-block transition-transform duration-300 hover:-translate-y-0.5 text-gray-800">
          <AiOutlineSearch />
        </Link>

        <Link to="/cart" className="relative inline-block transition-transform duration-300 hover:-translate-y-0.5">
          <AiOutlineShoppingCart className="text-gray-800" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </Link>

        {userInfo ? (
          <div className="relative group inline-block transition-transform duration-300 hover:-translate-y-0.5">
            <AiOutlineUser className="cursor-pointer text-gray-800" />
            <div className="absolute hidden group-hover:block right-0 bg-white shadow-lg rounded-md p-2 min-w-max">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              <Link to="/userorder" className="block px-4 py-2 hover:bg-gray-100">Order</Link>
            </div>
          </div>
        ) : (
          <Link to="/login" className="relative inline-block text-gray-800 text-lg font-medium after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-gray-800 after:transition-all after:duration-300 hover:after:w-full">LOGIN</Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
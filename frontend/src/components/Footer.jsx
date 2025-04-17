import React from 'react'
import { Link } from "react-router-dom";
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    
    <div className="container mx-auto px-4">
      <hr className='border-gray-300' />
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm '>
        <div>
          <Link to="/" className="text-5xl font-bold text-gray-900 flex items-center mb-4">
          BORCELLE<span className="text-pink-500">.</span>
          </Link>            
          <p className='w-full text-base md:w-2/3 text-gray-600'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>

        <div className='ml-[-70px]'>
            <p className='text-2xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col text-base gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>

        <div className='ml-[-70px]'>
            <p className='text-2xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col text-base gap-1 text-gray-600'>
                <li>0901 123 456</li>
                <li>admin@gmail.com</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@ khanhhang.com - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer

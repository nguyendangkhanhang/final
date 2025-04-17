import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import ScrollAnimator from '../components/ScrollAnimator'

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <ScrollAnimator>
        <div 
          className="relative h-64 md:h-80 flex items-center justify-center text-black bg-[#efe9e0] overflow-hidden"
        >
          <div className='relative z-10 text-center px-4'>
            <div className='text-7xl text-center'>
              <Title text1={'CONTACT'} text2={'US'} />
            </div>
            <p className="mt-2 text-lg md:text-xl text-gray-700">Get in touch with our team</p>
          </div>
        </div>
        <div className="bg-[#efe9e0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="block" fill="#f9fafb">
            <path d="M1440,50 C1200,100 900,0 720,0 C540,0 240,100 0,50 L0,100 L1440,100 Z"></path>
          </svg>
        </div>
      </ScrollAnimator>

      <div className="max-w-[1400px] mx-auto mr-[-40px]">
        <div className="my-10 flex flex-col md:flex-row gap-10 mb-20 items-center">
          <img
            className="w-full md:w-[40%] rounded-lg"
            src={assets.contact_img}
            alt=""
          />
          <div className="w-full md:w-[60%] flex flex-col justify-center items-start gap-6 px-6">
            <p className="font-semibold text-5xl text-gray-800">Our Store</p>
            <p className="text-[1.1rem] text-gray-600">
              123 DBP <br /> Thanh Khe, Da Nang, Viet Nam
            </p>
            <p className="text-[1.1rem] text-gray-600">
              Tel: 0901 123 456 <br /> Email: admin@gmail.com
            </p>
            <p className="font-semibold text-2xl text-gray-800">Careers at Sweetie</p>
            <p className="text-[1.1rem] text-gray-600">
              Learn more about our teams and job openings.
            </p>
            <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 rounded-lg">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
      <NewsletterBox/>
    </div>
  )
}

export default Contact

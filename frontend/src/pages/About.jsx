import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import ScrollAnimator from '../components/ScrollAnimator'

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <ScrollAnimator>
        <div 
          className="relative h-64 md:h-80 flex items-center justify-center text-black bg-[#efe9e0] overflow-hidden"
        >
          <div className='relative z-10 text-center px-4'>
            <div className='text-7xl text-center'>
              <Title text1={'ABOUT'} text2={'US'} />
            </div>
            <p className="mt-2 text-lg md:text-xl text-gray-700">Learn more about our story and mission</p>
          </div>
        </div>
        <div className="bg-[#efe9e0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="block" fill="#f9fafb">
            <path d="M1440,50 C1200,100 900,0 720,0 C540,0 240,100 0,50 L0,100 L1440,100 Z"></path>
          </svg>
        </div>
      </ScrollAnimator>

      <div className="max-w-[1400px] mx-auto">
        <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px] rounded-lg shadow-lg' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
            <p className="text-lg">Sweetie was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.</p>
            <p className="text-lg">Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.</p>
            <b className='text-gray-800 text-xl'>Our Mission</b>
            <p className="text-lg">Our mission at Sweetie is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.</p>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className='text-7xl text-center'>
            <Title text1={'WHY'} text2={'CHOOSE US'} />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
          <div className='bg-white rounded-lg shadow-lg p-8 flex flex-col gap-5 hover:shadow-xl transition-shadow duration-300'>
            <b className="text-xl text-gray-800">Quality Assurance</b>
            <p className='text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
          </div>
          <div className='bg-white rounded-lg shadow-lg p-8 flex flex-col gap-5 hover:shadow-xl transition-shadow duration-300'>
            <b className="text-xl text-gray-800">Convenience</b>
            <p className='text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
          </div>
          <div className='bg-white rounded-lg shadow-lg p-8 flex flex-col gap-5 hover:shadow-xl transition-shadow duration-300'>
            <b className="text-xl text-gray-800">Exceptional Customer Service</b>
            <p className='text-gray-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
          </div>
        </div>

        <NewsletterBox/>
      </div>
    </div>
  )
}

export default About

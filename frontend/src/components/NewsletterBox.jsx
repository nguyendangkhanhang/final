import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className=' text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6'>
        <input className='w-full sm:flex-1 outline-none border p-2.5' type="email" placeholder='Enter your email' required/>
        <button type='submit' className='bg-black text-white text-sm px-8 py-3 transition-colors duration-300 hover:bg-white border border-black hover:text-black'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsletterBox

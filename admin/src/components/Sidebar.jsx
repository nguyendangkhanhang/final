import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const getNavLinkClass = (isActive) => {
    return `flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group relative
      ${isActive 
        ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-600 shadow-sm' 
        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
      }
      ${isCollapsed ? 'justify-center' : ''}
    `
  }

  const getIconContainerClass = (isActive) => {
    return `p-2.5 rounded-xl transition-all duration-300 backdrop-blur-sm
      ${isActive 
        ? 'bg-blue-100/90 shadow-sm' 
        : 'bg-gray-100/80 group-hover:bg-gray-200/80'
      }
    `
  }

  return (
    <div className={`relative min-h-screen bg-white border-r border-gray-200/80 shadow-sm flex flex-col transition-all duration-300`}>
      {/* Logo/Brand Section */}
      <div className='p-6 border-b border-gray-200/80 bg-gradient-to-b from-gray-50/50 to-white'>
        <div className='flex items-center gap-3'>
          <div className='w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 group'>
            <img className='w-6 h-6 text-white transform group-hover:scale-110 transition-transform duration-300' src={assets.layout} alt="" />
          </div>
          {!isCollapsed && (
            <div className='transition-opacity duration-300'>
              <h1 className='text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>Admin</h1>
              <p className='text-sm text-gray-500'>Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className='flex-1 py-8 px-4 space-y-6'>
        {/* Dashboard Section */}
        <div className='space-y-1.5'>
          <NavLink 
            to="/admin/dashboard"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            <div className={getIconContainerClass(false)}>
              <img className='w-[22px] h-[22px] transform group-hover:scale-110 transition-transform duration-300' src={assets.layout} alt="" />
            </div>
            {!isCollapsed && <span className='font-medium'>Dashboard</span>}
          </NavLink>
        </div>

        {/* Products Section */}
        <div className='space-y-1.5'>
          {!isCollapsed && (
            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 mb-3'>
              Products
            </p>
          )}
          <NavLink 
            to="/admin/productlist"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            <div className={getIconContainerClass(false)}>
              <img className='w-[22px] h-[22px] transform group-hover:scale-110 transition-transform duration-300' src={assets.add_icon} alt="" />
            </div>
            {!isCollapsed && <span className='font-medium'>Add Items</span>}
          </NavLink>

          <NavLink 
            to="/admin/allproductslist"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            <div className={getIconContainerClass(false)}>
              <img className='w-[22px] h-[22px] transform group-hover:scale-110 transition-transform duration-300' src={assets.order_icon} alt="" />
            </div>
            {!isCollapsed && <span className='font-medium'>List Items</span>}
          </NavLink>
        </div>

        {/* Management Section */}
        <div className='space-y-1.5'>
          {!isCollapsed && (
            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 mb-3'>
              Management
            </p>
          )}
          <NavLink 
            to="/admin/userlist"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            <div className={getIconContainerClass(false)}>
              <img className='w-[22px] h-[22px] transform group-hover:scale-110 transition-transform duration-300' src={assets.group} alt="" />
            </div>
            {!isCollapsed && <span className='font-medium'>Users</span>}
          </NavLink>

          <NavLink 
            to="/admin/orderlist"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            <div className={getIconContainerClass(false)}>
              <img className='w-[22px] h-[22px] transform group-hover:scale-110 transition-transform duration-300' src={assets.order_icon} alt="" />
            </div>
            {!isCollapsed && <span className='font-medium'>Orders</span>}
          </NavLink>
        </div>
      </nav>

      {/* Footer Section */}
      <div className='p-5 border-t border-gray-200/80 bg-gradient-to-t from-gray-50/50 to-white'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hover:shadow-md transition-all duration-300'>
            <img className='w-5 h-5' src={assets.group} alt="" />
          </div>
          {!isCollapsed && (
            <>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate'>Admin User</p>
                <p className='text-xs text-gray-500 truncate'>admin@example.com</p>
              </div>
              <button className='p-2 rounded-lg hover:bg-gray-100 transition-all duration-300'>
                <img className='w-5 h-5 opacity-75 hover:opacity-100' src={assets.layout} alt="Settings" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
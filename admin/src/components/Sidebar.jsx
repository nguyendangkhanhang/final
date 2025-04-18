import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const getNavLinkClass = (isActive) => {
    return `flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group relative
      ${isActive 
        ? 'bg-[#5b3f15] text-white shadow-sm' 
        : 'text-[#5b3f15] hover:bg-[#efe9e0]'
      }
      ${isCollapsed ? 'justify-center' : ''}
    `
  }

  const getIconContainerClass = (isActive) => {
    return `p-2.5 rounded-xl transition-all duration-300
      ${isActive 
        ? 'bg-white/10' 
        : 'bg-[#efe9e0] group-hover:bg-[#bd8837]/20'
      }
    `
  }

  return (
    <div className={`relative min-h-screen bg-white border-r border-[#efe9e0] shadow-sm flex flex-col transition-all duration-300`}>
      {/* Logo/Brand Section */}
      <div className='p-6 border-b border-[#efe9e0] bg-gradient-to-b from-[#efe9e0]/50 to-white'>
        <div className='flex items-center gap-3'>
          <div className='w-11 h-11 rounded-xl bg-[#5b3f15] flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 group'>
            <img className='w-8 h-8 text-white transform group-hover:scale-110 transition-transform duration-300' src={assets.dashboard} alt="" />
          </div>
          {!isCollapsed && (
            <div className='transition-opacity duration-300'>
              <h1 className='text-xl font-bold text-[#5b3f15]'>ADMIN PANEL</h1>
              <p className='text-sm text-gray-500'>Manage your website</p>
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
            <p className='text-xs font-semibold text-[#bd8837] uppercase tracking-wider px-5 mb-3'>
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
            to="/admin/categorylist"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            <div className={getIconContainerClass(false)}>
              <img className='w-[22px] h-[22px] transform group-hover:scale-110 transition-transform duration-300' src={assets.category} alt="" />
            </div>
            {!isCollapsed && <span className='font-medium'>Add Category</span>}
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
            <p className='text-xs font-semibold text-[#bd8837] uppercase tracking-wider px-5 mb-3'>
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

          <NavLink 
            to="/admin/discountlist"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            <div className={getIconContainerClass(false)}>
              <img className='w-[22px] h-[22px] transform group-hover:scale-110 transition-transform duration-300' src={assets.discount} alt="" />
            </div>
            {!isCollapsed && <span className='font-medium'>Discount Codes</span>}
          </NavLink>
        </div>
      </nav>

      {/* Footer Section */}
      <div className='p-5 border-t border-[#efe9e0] bg-gradient-to-t from-[#efe9e0]/50 to-white'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-[#efe9e0] flex items-center justify-center hover:shadow-md transition-all duration-300'>
            <img className='w-5 h-5' src={assets.group} alt="" />
          </div>
          {!isCollapsed && (
            <>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-[#5b3f15] truncate'>Admin User</p>
                <p className='text-xs text-[#bd8837] truncate'>admin@example.com</p>
              </div>
              <button className='p-2 rounded-lg hover:bg-[#efe9e0] transition-all duration-300'>
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
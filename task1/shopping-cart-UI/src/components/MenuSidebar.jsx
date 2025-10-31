import React from 'react'
import { FaRegTimesCircle } from 'react-icons/fa'
import { Link } from "react-router-dom"


const MenuSidebar = ({isOpen, onClose}) => {
  return (
    <>
       <div className={` fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300
          ${isOpen ? "opacity-100":"opacity-0 pointer-events-none"}`}
       />

        <div className={`fixed right-0 top-0 h-full w-70 max-w-md bg-white shadow-2xl z-50 
            transform transition-transform duration-300 ease-in-out  ${isOpen ? 'translate-x-0':"translate-x-full"}`}>
            <div className='flex items-center justify-between p-4 border-b border-gray-200'>
                <h2 className='text-xl font-semibold text-gray-900 flex items-center space-x-2'>
                    <span>Menu</span>
                </h2>
                <button className='p-2 hover-bg-gray-100 rounded-full tansition-colors duration-200 cursor-pointer'
                onClick={onClose}>
                    <FaRegTimesCircle className='w-6 h-5'/>
                </button>
            </div> 

            <div className='flex-1 overflow-y-auto items-center p-3 font-semibold'>
                <div className='text-center py-4 cursor-pointer font-'>
                    <Link to="/" className='text-dark text-lg mb-8 hover:text-orange-500'>Home</Link><br></br>
                    <Link to="/products" className='text-dark text-lg mb-8 hover:text-orange-500'>Products</Link><br></br>
                    <Link to="/contact" className='text-dark text-lg mb-8 hover:text-orange-500'>Contact</Link><br></br>
                    <Link to="/about" className='text-dark text-lg mb-8 hover:text-orange-500'>About</Link>
                </div>
            </div>
         
        </div>
    </>
    
  )
}

export default MenuSidebar
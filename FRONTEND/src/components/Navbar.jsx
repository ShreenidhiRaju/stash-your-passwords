import React from 'react'

const Navbar = ({ onLogout }) => {
  return (
    <>
      <nav>
        <ul className='flex justify-between items-center px-6 text-[#5738aa] font-extrabold text-xl italic mt-1.5'>
          
          <li>
            PASSWORD-STASH
          </li>


          <div className='flex items-center gap-8'>

            <button
              onClick={onLogout}
              className='text-sm not-italic px-4 py-2 cursor-pointer border border-[#5738aa] rounded-lg hover:bg-[#5738aa] hover:text-white transition duration-200'
            >
              Logout
            </button>
          </div>

        </ul>
      </nav>
    </>
  )
}

export default Navbar
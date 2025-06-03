import React, { useState } from 'react'; // Added useState for mobile menu toggle
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClass = 'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150';
  const activeLinkClass = 'bg-gray-900 text-white';
  const inactiveLinkClass = 'text-gray-300 hover:bg-gray-700 hover:text-white';

  const mobileLinkClass = 'block px-3 py-2 rounded-md text-base font-medium';


  return (
    <nav className='bg-gray-800 shadow-lg border-b border-gray-700'> {/* Added shadow and border */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo/Brand Name */}
          <div className='flex-shrink-0'>
            <Link to='/' className='text-xl font-bold text-white hover:text-gray-200 transition-colors duration-150'>
              The Ainstien
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-4'>
              <NavLink to='/' className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`} end>Home</NavLink>
              <NavLink to='/chat' className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Ainstien Chatbot</NavLink>
              <NavLink to='/test' className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Personality Test</NavLink>
              <NavLink to='/faq' className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>FAQ</NavLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='-mr-2 flex md:hidden'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type='button'
              className='bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
              aria-controls='mobile-menu'
              aria-expanded={isMobileMenuOpen}
            >
              <span className='sr-only'>Open main menu</span>
              {/* Icon when menu is closed. Heroicon name: menu */}
              {!isMobileMenuOpen ? (
                <svg className='block h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              ) : (
                // Icon when menu is open. Heroicon name: x
                <svg className='block h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden' id='mobile-menu'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <NavLink to='/' className={({isActive}) => `${mobileLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`} end onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to='/chat' className={({isActive}) => `${mobileLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`} onClick={() => setIsMobileMenuOpen(false)}>Ainstien Chatbot</NavLink>
            <NavLink to='/test' className={({isActive}) => `${mobileLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`} onClick={() => setIsMobileMenuOpen(false)}>Personality Test</NavLink>
            <NavLink to='/faq' className={({isActive}) => `${mobileLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`} onClick={() => setIsMobileMenuOpen(false)}>FAQ</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
export default Navbar;

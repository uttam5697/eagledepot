import { useState, useEffect, useRef } from 'react';
import { Logo } from '../../assets/Index';
import { CgClose } from 'react-icons/cg';
import { HiMenuAlt3 } from 'react-icons/hi';
import { PiShoppingCartLight } from 'react-icons/pi';
import ShoppingCart from '../shoppingcart/ShoppingCart';
import { Link, useLocation } from 'react-router-dom';
import AuthDropdown from './components/AuthDropdown';
import { useCart } from '../../api/cart';

export default function Header() {
  const { data: fetchedCartItems = [] , refetch } = useCart(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = useLocation().pathname;

  // Refs for outside click detection
  const menuRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsCartOpen(false);
      }
    }

    if (isMenuOpen || isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isCartOpen]);

  useEffect(() => {
    console.log('Cart items:', fetchedCartItems); 
    refetch();
  }, []);

  return (
    <>
      <header
        className={`py-3 
          ${(pathname === '/' || pathname === '/about-us')
            ? 'bg-transparent absolute top-0'
            : 'bg-black'} 
          w-full z-20 header-navbar 
          ${isMenuOpen
            ? 'nav-active before:bg-[#00000080] before:h-full before:w-full before:z-30 before:fixed before:top-0'
            : ''}`}
      >
        <div className="container">
          <div className="flex items-center md:justify-between">
            {/* Logo */}
            <Link to="/" className="space-x-2">
              <img src={Logo} alt="Eagle Logo" className="" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden navbar md:flex items-center space-x-[50px] mx-auto">
              <Link to="/" className={`text-white ${pathname === '/' ? 'active' : ''}`}>Home</Link>
              <Link to="/?product" className={`text-white ${pathname === '/?product' ? 'active' : ''}`}>Product</Link>
              <Link to="/about-us" className={`text-white ${pathname === '/about-us' ? 'active' : ''}`}>About Us</Link>
              <Link to="/contact-us" className={`text-white ${pathname === '/contact-us' ? 'active' : ''}`}>Contact Us</Link>
              {/* <Link to="/calculate" className={`text-white ${pathname === '/calculate' ? 'active' : ''}`}>Calculate</Link> */}
            </nav>

            {/* Cart */}
              <div className='md:ml-0 ml-auto' ref={cartRef}>
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="flex lg:w-[54px] relative md:w-[44px] w-[34px] lg:h-[54px] md:h-[44px] h-[34px] white-btn group p-0 justify-center border-white/30 lg:gap-6 md:gap-5 gap-4 bg-white-light-gradient bg-transparent hover:bg-white hover:text-black text-white mr-4 md:ml-0 ml-auto"
                  >
                  <PiShoppingCartLight className="lg:text-[22px] md:text-[20px] text-[18px]" />
                  {fetchedCartItems.length > 0 &&
                  <span className="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full md:text-[11px] text-[9px] font-medium transform -translate-y-1/2 translate-x-1/2 bg-primary text-white">{
                    fetchedCartItems?.length
                  }</span>
                  }
                </button>
              </div>

            {/* Auth */}
            <AuthDropdown />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <HiMenuAlt3 size={30} />
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div ref={menuRef} className="md:hidden border-t border-white/30 mobile-nemu fixed top-0 right-0 max-w-[300px] w-full bg-black h-full z-30">
              <div className='container'>
                <div className='flex items-start pt-4 justify-between mb-4'>
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="space-x-2">
                    <img src={Logo} alt="Eagle Logo" className="xl:h-[74px] lg:h-[64px] h-[54px]" />
                  </Link>
                  <button
                    className="md:hidden text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CgClose size={24} />
                  </button>
                </div>
                <nav className="flex navbar flex-col space-y-4">
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className={`text-white ${pathname === '/' ? 'active' : ''}`}>
                    Home
                  </Link>
                  <Link to="/?product" onClick={() => setIsMenuOpen(false)} className={`text-white ${pathname === '/?product' ? 'active' : ''}`}>
                    Product
                  </Link>
                  <Link to="/about-us" onClick={() => setIsMenuOpen(false)} className={`text-white ${pathname === '/about-us' ? 'active' : ''}`}>
                    About Us
                  </Link>
                  <Link to="/contact-us" onClick={() => setIsMenuOpen(false)} className={`text-white ${pathname === '/contact-us' ? 'active' : ''}`}>
                    Contact Us
                  </Link>
                  {/* <Link to="/calculate" onClick={() => setIsMenuOpen(false)} className={`text-white ${pathname === '/calculate' ? 'active' : ''}`}>
                    Calculate
                  </Link>/calculate */}
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Shopping Cart */}
      <div ref={cartRef}>
        <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </>
  );
}

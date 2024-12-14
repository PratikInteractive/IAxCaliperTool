'use client';
import React , {useState} from 'react';
import logo from '@/app/assets/logo.svg';
import Image from 'next/image';
import styles from './header.module.css';
import { usePathname } from 'next/navigation';
import Swal from 'sweetalert2';

const Header = () => {

    const [showLogout, setShowLogout] = useState(false);

  const currentPath = usePathname(); // Get the current path

  // Only show the header if the current path is not "/login"
  if (currentPath === "/login") {
      return null;
  }

  const toggleLogout = () => {
    setShowLogout((prevState) => !prevState); // Toggle the logout visibility
  };

  const logout = () => {
    
    Swal.fire({
        text: 'Please Click Ok to logout',
        icon: 'warning',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.removeItem("user_id");
          window.location.href = "/login";
          
        }
      });
  }

  return (
    <>
    <header>
        <div className={`container ${styles.header_container}`}>
            <div className='logo'>
                <Image src={logo} width={200} height={80} alt='logo' />
            </div>
            <div className={styles.menu}>
                <p onClick={toggleLogout} className={showLogout ? `${styles.toggled}` : ''}>Profile</p>
                {showLogout && <span className={styles.logoutbtn} onClick={logout}>Logout</span>}
            </div>
        </div>
    </header>
    </>
  )
}

export default Header
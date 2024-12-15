'use client';
import React, { useState, useEffect } from 'react';
import logo from '@/app/assets/logo.svg';
import Image from 'next/image';
import styles from './header.module.css';
import { usePathname } from 'next/navigation';
import Swal from 'sweetalert2';

const Header = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [userName, setUserName] = useState(null); 
  const currentPath = usePathname(); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user_id');
      console.log("Stored USer", storedUser)
      if (storedUser) {
        setUserName(storedUser);
      } else {
        console.log('No user_id found in sessionStorage');
      }
    }
  }, []);

  if (currentPath === "/login") {
    return null;
  }

  const toggleLogout = () => {
    setShowLogout((prevState) => !prevState); 
  };

  const logout = () => {
    Swal.fire({
      text: 'Please Click Ok to logout',
      icon: 'warning',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem("user_id");
        }
        window.location.href = "/login";
      }
    });
  };

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.header_container}`}>
          <div className="logo">
            <Image src={logo} width={200} height={80} alt="logo" />
          </div>
          <div className={styles.menu}>
            <p onClick={toggleLogout} className={showLogout ? `${styles.toggled}` : ''}>
              {/* User: {userName || 'Guest'} */}
              Welcome User
            </p>
            {showLogout && <span className={styles.logoutbtn} onClick={logout}>Logout</span>}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

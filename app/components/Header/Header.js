'use client';
import React, { useState, useEffect } from 'react';
import logo from '@/app/assets/header-logo.png';
import Image from 'next/image';
import styles from './header.module.css';
import { usePathname } from 'next/navigation';
import Swal from 'sweetalert2';

const Header = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [userName, setUserName] = useState(null); 
  const currentPath = usePathname(); 
  const [is404, setIs404] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (typeof window !== 'undefined') {
        const storedUser = sessionStorage.getItem('user_id');
        if (storedUser) {
          setUserName(storedUser);
          setIsLoading(false);
          clearInterval(intervalId);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (document.title === '404') {
      setIs404(true);
    } else {
      setIs404(false);
    }
  }, [currentPath]);


  if (currentPath === "/login" || currentPath === "/unauthorized" || is404) {
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
            <Image src={logo} width={200} height={80} alt="logo" className={styles.logo_img} />
          </div>
          <div className={styles.menu}>
          {isLoading ? (
              <p>Loading...</p> // Show a loading indicator while fetching the username
            ) : (
              <p onClick={toggleLogout} className={showLogout ? `${styles.toggled}` : ''}>
                User: {userName || 'Guest'} 
                {/* Welcome User */}
              </p>
            )}
            {showLogout && <span className={styles.logoutbtn} onClick={logout}>Logout</span>}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

'use client';
import React from 'react';
import stlyes from './unauthorize.module.css';
import logo from '@/app/assets/login-logo.png';
import Image from 'next/image';

const page = () => {


  const logout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className={stlyes.block}>
        <div className={stlyes.inner_block}>
        <Image src={logo} width={250} height={120} alt="logo" />
           <p> You don't have access to this page</p>
           <div className={stlyes.btn_wrap}>

           <button onClick={logout} className='btn'>Please Login Again</button>
           </div>
        </div>
    </div>
  )
}

export default page
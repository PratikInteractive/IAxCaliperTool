'use client';
import React from 'react';
import styles from '@/app/styles/notFound.module.css';
import logo from '@/app/assets/login-logo.png';
import Image from 'next/image';

const page = () => {


    const logout = () => {
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("role");
        window.location.href = "/login";
    };

    return (
        <>
            <head>
                <title>404</title>
            </head>
            <div className={styles.block}>
                <div className={styles.inner_block}>
                    <Image src={logo} width={250} height={120} alt="logo" />
                    <p>404! Page Not Found</p>
                    <div className={styles.btn_wrap}>

                        <button onClick={logout} className='btn'>Please Login</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page
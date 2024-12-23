"use client";

import { useState } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import logo from '@/app/assets/login-logo.png';
import Image from 'next/image';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    const user_id = e.target.email.value;
    const plainPassword = e.target.password.value;
    const toolName = "caliper_self_serve";

    const encryptedPassword = CryptoJS.MD5(plainPassword).toString();

    const loginUrl = `${apiUrl}/planning/plannerLogin.jsp?user_id=${user_id}&password=${encryptedPassword}&toolName=${toolName}`;

    try {
      const response = await fetch(loginUrl, {
        method: "GET",
      });

      if (response.ok) {
        const resultText = await response.text();
        const result = JSON.parse(resultText);

        if (result.success) {
          sessionStorage.setItem("user_id", user_id);
          const user_role = result.value;
          if (user_role.includes("caliper_admin")) {
            sessionStorage.setItem("role", "admin");
            localStorage.setItem("role", "admin");
            document.cookie = "role=admin"
            router.push("/admin/dashboard/");
          } else if (user_role === "caliper_client") {
            sessionStorage.setItem("role", "client");
            localStorage.setItem("role", "client");
            router.push("/client/dashboard/");
          } else if (user_role === "caliper_hub_user") {
            sessionStorage.setItem("role", "coe");
            localStorage.setItem("role", "coe");
            router.push("/coe/dashboard/");
          } else {
            setIsLoading(false);
          }
        } else {
          setErrorMessage(result.value);
          setIsLoading(false);
        }
      } else {
        console.error("Login Failed:", response.status);
        setErrorMessage("Login Failed. Please check your credentials.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.login_form}>
        <div className={styles.login_container}>
          <Image src={logo} width={250} height={120} alt="logo" />
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.form_element}>
              <label>Enter Username</label>
              <input
                type="name"
                name="email"
                placeholder="Email ID"
                className={styles.inputBox}
                required
              />
            </div>
            <div className={styles.form_element}>
              <label>Enter Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className={styles.inputBox}
              />
            </div>
            {errorMessage && (
              <div className={styles.error_message}>
                <p>{errorMessage}</p>
              </div>
            )}
            <div className={styles.form_element}>
              <button type="submit" className="btn primary" disabled={isLoading}>
                {isLoading ? <div className="loader"></div> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default page;

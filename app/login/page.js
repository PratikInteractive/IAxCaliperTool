"use client";

import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import logo from '@/app/assets/logo.svg';
import Image from 'next/image';

const page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
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
        sessionStorage.setItem("user_id", user_id);
        const user_role = result.value;
        if (user_role.includes("caliper_admin")) {
          router.push("/admin/dashboard/");
        } else if (user_role === "caliper_client") {
          router.push("/client/dashboard/");
        } else if (user_role === "caliper_hub_user") {
          router.push("/coe/dashboard/");
        } else {
          return "";
        }
      } else {
        console.error("Login Failed:", response.status);
        alert("Login Failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className={styles.login_form}>
        <div className={styles.login_container}>
            <Image src={logo} width={250} height={120} alt='logo' />
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
            <div className={styles.form_element}>
              <button type="submit" className="btn primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default page;

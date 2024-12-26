
import Header from "./components/Header/Header";
import "@/app/styles/globals.css";

import { Work_Sans } from 'next/font/google';

const workSans = Work_Sans({
  subsets: ['latin'],
  weights: ['400', '600', '700'], 
});

export const metadata = {
  title: "Caliper",
  description: "caliper management tool for campaigns",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={workSans.className}>
        <Header/>
        {children}
      </body>
    </html>
  );
}

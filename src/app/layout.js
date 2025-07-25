import { Cormorant, Unbounded } from "next/font/google";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import "./globals.css";

const cormorantFont = Cormorant({
  display: "swap",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  display: "swap",
  subsets: ["latin"],
});


export const metadata = {
  title: "Next Boiler",
  description: "Change description",
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="pastel">
      <body
        className={cormorantFont.className}
      >
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}

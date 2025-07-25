"use client";

import { IoMenu, IoClose } from "react-icons/io5";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [showMenu, setShowMenu] = React.useState(false);
  const pathname = usePathname();

  function handleClick() {
    setShowMenu((prev) => !prev);
  }

  return (
    <header className="relative">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-base-100">
        <div className="max-w-[1700px] mx-auto flex justify-between items-center p-5 px-5 md:py-5">
          <Link href="/">
            <Image
              src="/home/logo.svg"
              width={148}
              height={30}
              alt="logo"
              className="cursor-pointer w-20"
              onClick={() => setShowMenu(false)}
            />
          </Link>

          {/* Navigation Row (hidden on mobile) */}
          <nav className="hidden md:flex gap-7 text-secondary font-bold text-lg lg:text-xl">
            <Link
              href="/"
              className={`cursor-pointer hover:underline hover:decoration-2 hover:underline-offset-4 ${
                pathname === "/" ? "underline decoration-2 underline-offset-4" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/posts"
              className={`cursor-pointer hover:underline hover:decoration-2 hover:underline-offset-4 ${
                pathname === "/posts"
                  ? "underline decoration-2 underline-offset-4"
                  : ""
              }`}
            >
              Posts
            </Link>
            <Link
              href="/about"
              className={`cursor-pointer hover:underline hover:decoration-2 hover:underline-offset-4 ${
                pathname === "/about" ? "underline decoration-2 underline-offset-4" : ""
              }`}
            >
              About
            </Link>
            <Link
              href="/user"
              className={`cursor-pointer hover:underline hover:decoration-2 hover:underline-offset-4 ${
                pathname.startsWith("/user") ? "underline decoration-2 underline-offset-4" : ""
              }`}
            >
              User
            </Link>
          </nav>

          {/* Right-side buttons */}
          <div className="flex items-center gap-3">
            {/* Menu toggle on mobile only */}
            <button
              onClick={handleClick}
              className="text-secondary text-3xl cursor-pointer focus:outline-none md:hidden"
            >
              {showMenu ? <IoClose /> : <IoMenu />}
            </button>
            <Link href="/contact" onClick={() => setShowMenu(false)}>
              <button className="btn btn-secondary text-xl rounded-full py-1 hover:bg-primary hover:text-secondary md:p-6">
                Contact
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu (only visible on small screens) */}
      <ul
        className={`md:hidden fixed top-[72px] left-0 w-full z-40 bg-base-100 flex flex-col transition-all duration-300 ease-in-out ${
          showMenu
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <Link
          href="/"
          onClick={() => setShowMenu(false)}
          className="block text-secondary text-lg font-bold border-b border-secondary py-3 px-4 cursor-pointer"
        >
          Home
        </Link>
        <Link
          href="/posts"
          onClick={() => setShowMenu(false)}
          className="block text-secondary text-lg font-bold border-b border-secondary py-3 px-4 cursor-pointer"
        >
          Posts
        </Link>
        <Link
          href="/about"
          onClick={() => setShowMenu(false)}
          className="block text-secondary text-lg font-bold border-b border-secondary py-3 px-4 cursor-pointer"
        >
          About
        </Link>
         <Link
          href="/user"
          onClick={() => setShowMenu(false)}
          className="block text-secondary text-lg font-bold border-b border-secondary py-3 px-4 cursor-pointer"
        >
          User
        </Link>
      </ul>
    </header>
  );
}

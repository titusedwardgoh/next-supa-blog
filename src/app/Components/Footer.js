"use client"

import Image from "next/image"
import Link from "next/link";
import React from "react"

export default function Footer() {
    const [email, setEmail] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [status, setStatus] = React.useState("idle"); // "success" | "error" | "idle"

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error("Subscription failed");

            const data = await res.json();
            setMessage(data.message);
            setStatus("success");
            setEmail("");
        } catch (error) {
            setMessage(error.message);
            setStatus("error");
        }
    };

    return (
        <footer className="footer bg-base-100 text-base-content p-5">
            {/* Email Form */}
            <div className="flex flex-col gap-5 items-center bg-base-300 py-10 px-3 w-full">
                <h1 className="text-2xl text-center font-black">
                Subscribe to our newsletter and stay updated.
                </h1>
                <div className="w-full flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-2xl flex">
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Write your email here"
                    required
                    className="w-2/3 bg-base-100 text-lg p-3 rounded-l-xl"
                    />
                    <button
                    type="submit"
                    className="w-1/3 uppercase bg-base-content text-base-100 p-3 text-lg font-black rounded-r-xl"
                    >
                    Subscribe
                    </button>
                </form>
                </div>
            </div>
            {/* Quick Links & Contact Info */}
            <div className="flex flex-row w-full mt-5">
                <nav className="flex flex-col gap-2 w-1/2 items-center">
                    <h6 className=" text-xl font-black mb-5">Quick Links</h6>
                    <Link href="/" className="link link-hover  font-bold text-md">Home</Link>
                    <Link href="/about" className="link link-hover  font-bold text-md">About</Link>
                    <Link href="/contact" className="link link-hover  font-bold text-md">Contact</Link>
                </nav>
                <nav className="flex flex-col gap-2 w-1/2 items-center">
                    <h6 className=" text-xl font-black mb-5">Category</h6>
                    <Link href="/" className="link link-hover  font-bold text-md">Home</Link>
                    <Link href="/services" className="link link-hover  font-bold text-md">Services</Link>
                    <Link href="/work" className="link link-hover  font-bold text-md">Work</Link>
                    <Link href="/about" className="link link-hover  font-bold text-md">About</Link>
                    <Link href="/contact" className="link link-hover  font-bold text-md">Contact Us</Link>
                </nav>
            </div>
            {/* Socials */}
            <div className="w-full mx-auto flex flex-col items-center gap-5">
                <h2 className="text-xl font-black">Follow Us</h2>
                <nav className="w-full flex flex-col items-center gap-2">
                    <div className="grid grid-flow-col gap-4">
                        <a>
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            className="md:w-6 md:h-6"
                            fill="black"
                            >
                            <path
                                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                            </svg>
                        </a>
                        <a>
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            className="md:w-6 md:h-6"
                            fill="black"
                            >
                            <path
                                d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                            </svg>
                        </a>
                        <a>
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            className="md:w-6 md:h-6"
                            fill="black"
                            >
                            <path
                                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                            </svg>
                        </a>
                    </div>
                </nav>
            </div>
            {/* Last bit */}
            <div className="flex flex-col gap-5 mx-auto items-center">
                <div className="w-full flex justify-center lg:justify-start">
                    <Image
                        src="/home/logo.svg"
                        width={148}
                        height={30}
                        alt="logo"
                        className="mx-auto lg:mx-0"
                    />
                </div>
                <div className="text-center text-lg font-semibold mb-3">
                <p className="">
                    23 King Street, 5th Avenue, New York
                </p>
                <p>
                    +1-2345-6789-9
                </p>
                </div>
                <div>
                    <h6 className=" text-center text-lg font-semibold mb-3">
                    Copyright © RedQ, Inc.
                    </h6>
                </div>
            </div>
        </footer>

    );
}

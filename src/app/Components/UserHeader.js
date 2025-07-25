'use client'
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function UserHeader() {
    
    const pathname = usePathname();

    return( 
        <div className="pt-25">
            <nav className="flex justify-center gap-5 gap-7 text-secondary font-bold text-lg ">
            <Link
              href="/user/all-posts"
              className={`cursor-pointer hover:underline hover:decoration-2 hover:underline-offset-4 ${
                pathname === "/user/all-posts"
                  ? "underline decoration-2 underline-offset-4"
                  : ""
              }`}
            >
              All Posts
            </Link>
            <Link
              href="/user/new-post"
              className={`cursor-pointer hover:underline hover:decoration-2 hover:underline-offset-4 ${
                pathname === "/user/new-post" ? "underline decoration-2 underline-offset-4" : ""
              }`}
            >
              New Post
            </Link>
          </nav>
        </div>
    )
}
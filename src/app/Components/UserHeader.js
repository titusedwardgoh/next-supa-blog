'use client'
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { supabase } from '@/lib/supabaseClient'

export default function UserHeader() {
    
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/login');
    };

    return( 
        <div className="pt-25 relative">
            <div className="relative max-w-3xl mx-auto flex items-center justify-center">
                <nav className="flex gap-5 gap-7 text-secondary font-bold text-lg">
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
                    <Link
                      href="/user/profile"
                      className={`cursor-pointer hover:underline hover:decoration-2 hover:underline-offset-4 ${
                        pathname === "/user/profile" ? "underline decoration-2 underline-offset-4" : ""
                      }`}
                    >
                      Profile
                    </Link>
                </nav>
                <button
                  onClick={handleLogout}
                  className="absolute right-0 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Log Out
                </button>
            </div>
        </div>
    )
}
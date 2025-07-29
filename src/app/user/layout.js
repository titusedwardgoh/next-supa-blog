'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import UserHeader from '../Components/UserHeader'

export default function UserLayout({ children }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (!data.user) {
        router.replace('/login') // redirect if not logged in
      } else {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return <div className="p-4">Loading...</div> // optional spinner or skeleton
  }

  return (
    <>
      <UserHeader />
      {children}
    </>
  )
}

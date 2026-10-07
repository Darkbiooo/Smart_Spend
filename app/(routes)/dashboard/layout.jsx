"use client"
import React, { useEffect } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { getUserBudgets } from '@/utils/actions'

function DashboardLayout({children}) {
    const {user}=useUser();
    const router = useRouter();
    useEffect(()=>{
        user && checkUserBudgets();
    },[user])
  const checkUserBudgets=async()=>{
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      console.log("Fetching budgets for user:", email);
      const result = await getUserBudgets(email);
      console.log("Budgets result:", result);

      if(result?.length == 0){
        router.replace('/dashboard/budgets')
      }
    } catch (error) {
      console.error("Database query error:", error);
    }
  }
  return (
    <div>
        <div className='fixed md:w-64 hidden md:block'>
            <SideNav/>
        </div>
        <div className='md:ml-64'>
            <DashboardHeader/>
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout

import React from 'react'
import ClientDashboard from '../../components/ClientDashboard'
import {getServerSession} from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';



async function getSidebarData(){
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res= await fetch(`${baseUrl}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.sidebar?.links || [];
}


const DashboardPage = async () => {
  const sidebarLinks = await getSidebarData();
  const session = await getServerSession(authOptions);

  if(!session || session?.user?.provider?.toLowerCase() !== 'google'){
    redirect('/signin');
  }

  return (
    <div>
      <ClientDashboard sidebarLinks={sidebarLinks} />
    </div>
  )
}

export default DashboardPage
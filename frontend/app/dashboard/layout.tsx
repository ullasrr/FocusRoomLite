// app/dashboard/layout.tsx
import React from 'react';
import './dashboard.css';

export const metadata = {
  title: 'Dashboard',
  description: 'User dashboard section',
};



export default async function DashboardLayout({

  children,
}: {
  children: React.ReactNode;
}) 
{
  return (        
  

  <> 

      {/* You can add a sidebar or topbar here if needed */}
    <div className=" text-black bg-slate-900 flex h-screen overflow-hidden dashboard-container">
      
      <div className="flex-1 bg-transparent">
        {children}
          

        </div>
    </div>
  </>

  );
}

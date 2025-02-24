// app/dashboard/layout.tsx
'use client';

import { ReactNode, useState } from 'react';
import Sidebar from "../components/Sidebar";
import Header from '../components/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Sidebar widths: open = 280px, closed = 80px
  const sidebarWidth = sidebarOpen ? 280 : 80;

  return (
    <div className="flex h-screen bg-[#e7eaf1]">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} sidebarWidth={sidebarWidth} />
      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Header sidebarWidth={sidebarWidth} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

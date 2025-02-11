'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LuLayoutDashboard, LuUser } from "react-icons/lu";
import { VscChecklist } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from 'flowbite-react';
import { MdLogout, MdOutlineEmail } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import MassEmailModal from '../modals/emailMasiveModal/page';

interface NavbarSideComponentProps {
  children: React.ReactNode;
  getOpportunity?: () => void;
  name: string;
  nameButton: string;
  setOpenModal: (open: boolean) => void;
}

export default function NavbarSideComponent({
  children,
  name,
  nameButton,
  setOpenModal
}: NavbarSideComponentProps) {
   const { theme } = useTheme();
   const router =  useRouter();
   const [openModalEmail,setOpenModalEmail] = useState(false);
   const  handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/login')
   }
  return (
    <React.Fragment>
      <MassEmailModal onClose={setOpenModalEmail} isOpen={openModalEmail}/>
    <div className='left-0 bg-light-bg-secondary dark:bg-dark-bg-secondary right-0 absolute top-0 h-screen overflow-auto'>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-20 flex flex-col items-center justify-between border-r border-light-border-light dark:border-dark-border-light bg-light-bg-primary dark:bg-dark-bg-primary">
          {/* Logo Container */}
          <div>
          <div className="p-4 h-20 border-b border-light-border-light dark:border-dark-border-light">
          
              {theme === 'light' ? (
                          <Image
                            src="/images/niux.png"
                            alt="Niux Logo"
                            width={100}
                            height={40}
                          />
                        ) : (
                          <Image
                            src="/images/niuxdark.png"
                            alt="Niux Logo"
                            width={100}
                            height={40}
                          />
                        )}
          </div>


          {/* Navigation */}
          <nav className="mt-5 flex flex-col items-center">
            <NavLink href="/funnels">
              <LuLayoutDashboard/>
            </NavLink>
            <NavLink href="/clients">
              <LuUser/>
            </NavLink>
            <NavLink href="/tasks">
              <VscChecklist/>
            </NavLink>
            <NavLink href="/settings">
              <IoSettingsOutline/>
            </NavLink>
           
          </nav>
          </div>
          <Button  onClick={handleLogout}   className="bg-light-bg-primary dark:bg-dark-bg-primary 
        mb-2 flex justify-center items-center h-14 w-14 
        border border-light-border-light dark:border-red-600 
        rounded-full text-xl transition duration-200
        text-light-text-primary dark:text-red-600
        hover:border-brand-accent hover:text-brand-accent" href="/settings">
              <MdLogout/>
            </Button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-light-border-light dark:border-dark-border-light h-20 p-4 bg-light-bg-primary dark:bg-dark-bg-primary">
            <h1 className='text-xl text-primary-50 font-bold'>{name}</h1>
            
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Buscar..."
                className="w-48 px-4 py-2 rounded-lg 
                  bg-light-bg-input dark:bg-dark-bg-input 
                  border border-light-border-medium dark:border-dark-border-medium 
                  text-light-text-primary dark:text-dark-text-primary
                  focus:outline-none focus:border-brand-accent"
              />
               {/* Action Button */}
               <button
                onClick={() => setOpenModalEmail(true)}
                className="text-white text-sm bg-primary-50 hover:bg-primary-600 active:bg-primary-700 
                  rounded-full p-3 focus:outline-none focus:ring"
              >
               <MdOutlineEmail/>
              </button>
              {/* Action Button */}
              <button
                onClick={() => setOpenModal(true)}
                className="text-white text-sm bg-primary-50 hover:bg-primary-600 active:bg-primary-700 
                  rounded-full py-2 px-8 focus:outline-none focus:ring"
              >
                {nameButton}
              </button>
              
              {/* User Avatar */}
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ot7fjk2Zlzx4r_0smMzzSJs6RTlzvp5NOA&s"
                alt="User"
                width={40}
                height={40}
                className="object-cover rounded-full"
              />
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 bg-light-bg-secondary dark:bg-dark-bg-secondary">
            {children}
          </div>
        </div>
      </div>
    </div>
    </React.Fragment>
  );
}

// Helper component for navigation links
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="bg-light-bg-primary dark:bg-dark-bg-primary 
        mb-2 flex justify-center items-center h-14 w-14 
        border border-light-border-light dark:border-dark-border-light 
        rounded-full text-xl transition duration-200
        text-light-text-primary dark:text-dark-text-primary
        hover:border-brand-accent hover:text-brand-accent"
    >
      {children}
    </Link>
  );
}
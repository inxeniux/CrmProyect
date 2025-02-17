// app/settings/page.tsx
'use client';

import { useState } from "react";
import { FaUser } from "react-icons/fa";
import NavbarSideComponent from "@/components/layouts/NavbarSideComponent";

type TabType = 'Perfil' | 'Negocio' | 'Pagos' | 'Diseño';

export default function SettingsPage() {
 const [activeTab, setActiveTab] = useState<TabType>('Perfil');
 
 const handleTabClick = (tab: TabType) => setActiveTab(tab);

 const tabs: TabType[] = ['Perfil', 'Negocio', 'Pagos', 'Diseño'];

 return (
   <NavbarSideComponent setOpenModal={() => {}} nameButton="guardar" name="Configuraciones">
     <ul className="flex pl-4 mt-5">
       {tabs.map((tab) => (
         <li
           key={tab}
           className={`${
             activeTab === tab ? 'bg-gray-100 text-black' : 'text-gray-600 bg-transparent'
           } text-sm mr-2 px-4 cursor-pointer rounded-md py-1`}
           onClick={() => handleTabClick(tab)}
         >
           {tab}
         </li>
       ))}
     </ul>

     <form className="space-y-12 max-w-4xl pt-10 pl-5 text-left">
       {/* Profile Section */}
       <div className="border-b border-gray-900/10 pb-12">
         <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
         <p className="mt-1 text-sm/6 text-gray-600">
           This information will be displayed publicly so be careful what you share.
         </p>

         <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
           {/* Username Field */}
           <div className="sm:col-span-4">
             <label className="block text-sm/6 font-medium text-gray-900">
               Username
             </label>
             <div className="mt-2">
               <div className="flex rounded-md bg-white pl-3 outline outline-1 outline-gray-300">
                 <span className="text-gray-500 p-2">workcation.com/</span>
                 <input
                   type="text"
                   placeholder="janesmith"
                   className="grow border-none py-1.5 pl-1 text-gray-900 focus:outline-none"
                 />
               </div>
             </div>
           </div>

           {/* About Field */}
           <div className="col-span-full">
             <label className="block text-sm/6 font-medium text-gray-900">
               About
             </label>
             <textarea
               rows={3}
               className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300"
             />
             <p className="mt-3 text-sm/6 text-gray-600">Write a few sentences about yourself.</p>
           </div>

           {/* Photo Upload */}
           <div className="col-span-full">
             <label className="block text-sm/6 font-medium text-gray-900">
               Photo
             </label>
             <div className="mt-2 flex items-center gap-x-3">
               <FaUser className="size-12 text-gray-300" />
               <button
                 type="button"
                 className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
               >
                 Change
               </button>
             </div>
           </div>

           {/* Rest of the form fields... */}
           
         </div>
       </div>

       {/* Add Personal Information and Notifications sections similarly */}
       
     </form>
   </NavbarSideComponent>
 );
}
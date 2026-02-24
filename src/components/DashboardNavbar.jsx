"use client";

import AnimatedGavelIcon from "@/components/ui/AnimatedGavelIcon";

export default function DashboardNavbar({ open, setOpen }) {
  return (
    <header className="
      w-full bg-primary-main shadow 
      flex items-center justify-between px-s16
      md:px-s24 py-s6
      sticky top-0 
      z-50   /* ⭐ Always above sidebar */
    ">
      {/* SHOW ICON ON MOBILE */}
      <button onClick={() => setOpen(!open)} className="md:hidden p-s8">
        <AnimatedGavelIcon isOpen={open} />
      </button>

      <h1 className="heading-h2  text-background ">CMS</h1>
 

      <div className="flex items-center gap-s8">
        <span className="caption text-background">Admin Panel</span>
      </div>
    </header>
  );
}

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Video,
  ListVideo,
  ListChecks,
  Settings,
  Contact,
} from "lucide-react";

export default function DashboardSidebar({ desktop, open, setOpen }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!desktop) {
      document.body.style.overflow = open ? "hidden" : "auto";
    }
  }, [open, desktop]);

  return (
    <>
      {/* DESKTOP FIXED SIDEBAR */}
      {desktop && (
        <aside
          className="
            w-64 h-screen bg-primary-main text-background shadow-xl 
            fixed top-0 left-0   /* ⭐ BELOW NAVBAR */
          "
        >
          <SidebarContent pathname={pathname} />
        </aside>
      )}

      {/* MOBILE SLIDE-IN SIDEBAR */}
{/* MOBILE SLIDE-IN SIDEBAR */}
{!desktop && (
  <>
    {/* OVERLAY */}
    {open && (
      <div
        className="fixed inset-0 z-30 md:hidden"
        onClick={() => setOpen(false)}
      />
    )}

    {/* SIDEBAR */}
    <aside
      className={`
        fixed left-0 inset-y-0 w-64
        bg-primary-main text-background
        shadow-xl
        transition-transform duration-300
        z-40   /* below navbar */
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <SidebarContent
        pathname={pathname}
        onClick={() => setOpen(false)}
      />
    </aside>
  </>
)}


    </>
  );
}

function SidebarContent({ pathname, onClick = () => {} }) {
  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    // { name: "Performance Track", href: "/dashboard/blog/uploads", icon: <FileText size={18} /> },
    { name: "Performance Track", href: "/dashboard/perfromnace", icon: <FileText size={18} /> },
    { name: "Daily Blogs", href: "/dashboard/dailyBlogs", icon: <Video size={18} /> },
    { name: "Journey Logs", href: "/dashboard/journeyLogs", icon: <ListChecks size={18} /> },
  
  ];

  return (
    <div className="flex flex-col h-full">
      <nav className="flex flex-col gap-s8 p-s16 pt-30 flex-1 ">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClick}
              className={`flex items-center gap-s12 px-s32 py-s16 rounded-r32 transition-all ${
                isActive
                  ? "bg-primary-light text-main   "
                  : " bg-primary-main opacity hover:bg-main/40 hover:text-secondary-light"
              }`}
            >

              <span className="body-default px-s8 py-1">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-s16 py-s16 border-t border-primary-light caption ">
        © {new Date().getFullYear()} Divyansh Mishra CMS
      </div>
    </div>
  );
}

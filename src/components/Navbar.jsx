"use client";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks, services } from "@/Data/Navlinks";
import Button from "./ui/Button";
import AnimatedGavelIcon from "./ui/AnimatedGavelIcon";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isMenuOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => (document.body.style.overflow = "");
    }, [isMenuOpen]);

    const pathname = usePathname();
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (

        <nav
            className={` fixed top-8 left-1/2 -translate-x-1/2 w-full max-w-7xl rounded-full
                   z-500
                        flex justify-between items-center
                        px-s16 md:px-s24 lg:px-s32
                        py-s8 lg:py-s16 body-default transition-colors duration-300
                        backdrop-blur-md bg-secondary-dark/50
                     `}
        >

            {/* LOGO */}
            <Link href="/" className="shrink-0">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    height={40}
                    width={40}
                    className=""
                />
            </Link>

            {/* DESKTOP MENU */}
            <ul className="hidden w-full xl:flex gap-s32 items-center justify-center flex-1">
                {navLinks.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <li
                            key={item.href}
                            className="relative"
                        >
                            <Link
                                href={item.href}
                                className={`relative p-s6 text-default transition-colors origin-center duration-300
                                    ${isActive ? "text-primary-main" : "hover:text-primary-main"} `}
                            >
                                {item.label}

                                <span
                                    className={`absolute  left-0 -bottom-1 h-0.5 rounded-full bg-primary-main
                                        transition-all duration-300 ease-in-out
                                      ${isActive ? "w-full  opacity-100" : "w-0  opacity-0"}  `}
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* RIGHT SIDE BUTTON */}
            <div className="flex items-center gap-s16">
                <div className="hidden xl:block">
                    <Button href={"/contact-us"} children={"Connect with me"} as={"link"} />
                </div>

                {/* MOBILE TOGGLE ICON */}
                <div className="block xl:hidden">
                    <AnimatedGavelIcon isOpen={isMenuOpen} onClick={toggleMenu} variant="yt" />
                </div>
            </div>

            {/* OVERLAY FOR MOBILE CLOSE ON OUTSIDE CLICK */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 not-last-of-type: xl:hidden"

                />
            )}

            {/* MOBILE MENU (unchanged) */}
            <div
                className={`
    absolute top-full left-0 w-full
    bg-primary-light text-main text-center
    overflow-hidden
    transition-all duration-300 ease-in-out
    xl:hidden
    rounded-b-r16
    shadow-2xl
    ${isMenuOpen
                        ? "max-h-[85vh] py-s8"
                        : "max-h-0 py-0"
                    }
  `}
            >
                {/* MAIN MOBILE MENU */}
                <div
                    className={`
      transition-transform duration-300
  
    `}
                >
                    {navLinks.map(({ label, href }) => {
                        const isActive = pathname === href;

                        return (
                            <div key={href} className="px-s16 py-s8">

                                <Link
                                    href={href}
                                    onClick={closeMenu}
                                    className={`
                block
                px-s16 py-s8
                rounded-full 
                transition
                ${isActive
                                            ? "bg-background text-primary-main"
                                            : "hover:bg-primary-main/30 hover:text-main"
                                        }
              `}
                                >
                                    {label}
                                </Link>

                            </div>
                        );
                    })}

                    {/* CONTACT BUTTON */}
                    <div className="mx-s16 my-s8">
                        <Button
                            href="/contact-us"
                            variant="secondary"
                            as="link"
                            onClick={closeMenu}
                            className="
                                                 block"
                        >
                            Connect with me
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

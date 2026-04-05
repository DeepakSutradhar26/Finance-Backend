// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { label: "Home",     href: "/dashboard" },
    { label: "Users",    href: "/users" },
    { label: "Records",  href: "/records" },
    { label: "Login",    href: "/login" },
    { label: "Register", href: "/register" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="border-b border-gray-700 bg-gray-900 px-6 py-3 flex gap-6 items-center">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition ${
                        pathname === link.href
                            ? "text-white"
                            : "text-gray-500 hover:text-gray-300"
                    }`}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
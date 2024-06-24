import Link from "next/link";
import { MountainIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import ThemeToggle from "@/components/ui/themetoggle";

const Navbar = () => {
  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6 ">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base w-fit "
      >
        <MountainIcon className="w-6 h-6" />
        <h3 className="text-lg">Crypto Inc</h3>
      </Link>
      <nav className=" hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-10 ml-auto">
        <Link href="/">Home</Link>
        <Link href="#">Products</Link>
        <Link href="#">About</Link>
        <Link href="#">Contact</Link>
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;

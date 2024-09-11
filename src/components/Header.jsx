"use client";

import Image from "next/image";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex justify-between items-center px-4 lg:px-6 py-2 bg-[#0e0c16]/10 w-full h-20 backdrop-blur-md">
        <Link href="/" className="flex items-center md:gap-2">
          <Image
            src="/logo_.png"
            alt="logo"
            width={30}
            height={30}
            className="w-[30px] h-[30px] object-contain"
          />
          <h1 className="text-md md:text-2xl font-bold">Hulenx</h1>
        </Link>
        {status === "loading" ? ( // Tambahkan kondisi loading
          <div className="flex gap-2 items-center justify-center">
            <span className=" text-white">Loading... </span>
            <span className="loader"></span>
          </div>
        ) : status === "authenticated" ? (
          <div className="flex items-center gap-1  md:gap-8">
            <p>Hi, {session.user.name}</p>
            <button
              className="px-5 py-2 rounded-md bg-red-500 hidden md:block"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            className="px-5 py-2 rounded-md bg-[#3e326d] text-xs  md:text-sm "
            href="/sign-in"
          >
            Sign In
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;

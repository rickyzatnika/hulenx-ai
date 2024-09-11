"use client";

import ChatList from "@/components/ChatList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Tambahkan pemeriksaan untuk status loading
    if (status === "loading") return; // Tunggu hingga status siap

    if (status !== "authenticated") {
      router.push("/sign-in");
    }
  }, [router, status]);

  return (
    <>
      <div className="grid grid-cols-12 px-2 pt-20">
        <div className="col-span-1 lg:col-span-3 sticky top-20 h-[100vh] -z-10 md:z-10 ">
          <ChatList />
        </div>
        <div className="col-span-11 lg:col-span-9 bg-[#12101B]  ">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;

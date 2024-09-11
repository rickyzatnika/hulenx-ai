"use client";

import ChatList from "@/components/ChatList";
import { useChatList } from "@/context/chatListContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();
  const { isChatListVisible } = useChatList(); // Ambil state dari context

  useEffect(() => {
    // Tambahkan pemeriksaan untuk status loading
    if (status === "loading") return; // Tunggu hingga status siap

    if (status !== "authenticated") {
      router.push("/sign-in");
    }
  }, [router, status]);

  return (
    <>
      <div className="grid grid-cols-12 px-2">
        <div
          className={`col-span-12 lg:col-span-3 ${
            isChatListVisible ? "fixed left-0 z-20" : "fixed -left-[200%]"
          } lg:sticky top-0 h-screen z-20 bg-[#161322] transition-all duration-300`}
        >
          <ChatList />
        </div>
        <div className="col-span-12 lg:col-span-9 bg-[#12101B]  ">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;

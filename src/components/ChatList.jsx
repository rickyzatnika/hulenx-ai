"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRocketchat } from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ChatList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatTitle, setChatTitle] = useState("");

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () =>
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/userchats`, {
        method: "GET",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json(); // Menggunakan res.json() untuk mengurai respons JSON
      }),
  });

  const deleteChatMutation = useMutation({
    mutationFn: async (chatId) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }
    },
    onSuccess: () => {
      refetch(); // Memperbarui data setelah berhasil menghapus
      toast.success("Chat deleted successfully");
    },
    onError: (error) => {
      console.error(error); // Log kesalahan
    },
  });

  const handleModal = (chatId, chatTitle) => {
    setSelectedChatId(chatId, chatTitle);
    setChatTitle(chatTitle);
    setIsModalOpen(true);
  };

  const handleDelete = (chatId) => {
    deleteChatMutation.mutate(chatId);
    setIsModalOpen(false);
  };

  // Effect untuk memeriksa apakah chat yang ditampilkan masih ada
  useEffect(() => {
    if (data && pathname.startsWith("/dashboard/chats/")) {
      const currentChatId = pathname.split("/").pop();
      const chatExists = data.some((chat) => chat._id === currentChatId);
      if (!chatExists) {
        // Jika chat tidak ada, arahkan kembali ke daftar chat
        router.push("/dashboard"); // Ganti dengan rute yang sesuai
      }
    }
  }, [data, pathname, router]);

  return (
    <>
      {isModalOpen && selectedChatId && (
        <div className="fixed w-full h-full flex justify-center items-center top-0 left-0 z-50 bg-[#080808b9] ">
          <div className="flex flex-col gap-5 w-[500px] bg-[#12101b] shadow-lg rounded-3xl">
            <h1 className=" text-lg font-bold  font-mono text-[#ddd] border-b-[1px] border-[#242231] p-5">
              Delete Chat ?
            </h1>
            <div className="p-5 ">
              <h2 className="text-sm text-[#ddd] font-mono pb-2 font-thin">
                This will delete{" "}
                <span className="font-bold font-sans text-md  capitalize">
                  {chatTitle}
                </span>
              </h2>
              <p className="text-sm text-[#ddd] pb-2">Are you Sure ?</p>
              <div className="flex justify-end items-center gap-2 rounded-md p-3 mt-5">
                <button
                  className="rounded-xl py-3 px-5 cursor-pointer text-sm text-[#ddd] bg-[#393644] hover:bg-[#4b4858] hover:text-white"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl py-3 px-5 cursor-pointer text-sm text-[#ddd] bg-[#ef4444] hover:bg-[#ca2a2a] hover:text-white"
                  onClick={() => handleDelete(selectedChatId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 w-full h-full p-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-[#afaeae]">Dashboard</p>
          <div className="flex gap-2 items-center px-4 py-3 rounded-md text-gray-400 hover:text-[#ddd] hover:bg-[#191724]">
            <FaRocketchat size={20} />
            <Link className="text-sm font-bold" href="/dashboard">
              Create a new Chat
            </Link>
          </div>
          <div className="flex gap-2 items-center px-4 py-3 rounded-md text-gray-400 hover:text-[#ddd] hover:bg-[#191724]">
            <MdTravelExplore size={20} />
            <Link className="text-sm font-bold" href="/dashboard">
              Explore Hulenx AI
            </Link>
          </div>
          <div className="flex gap-2 items-center px-4 py-3 rounded-md text-gray-400 hover:text-[#ddd] hover:bg-[#191724]">
            <FaRocketchat size={20} />
            <Link className="text-sm font-bold" href="/dashboard">
              Contact Us
            </Link>
          </div>
          <hr className="border-[#242231]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#afaeae]">Recent Chats</p>
        </div>
        <div className="flex flex-col gap-2 w-full h-full overflow-y-scroll">
          {isPending ? (
            <div className="flex gap-2 items-center text-sm">
              <span className=" text-white">Loading... </span>
              <span className="loader"></span>
            </div>
          ) : !data ? (
            "No Conversation"
          ) : error ? (
            "Something went wrong!"
          ) : (
            data?.map((chat) => (
              <div
                key={chat?._id}
                className="chat-item flex gap-4 justify-between items-center "
              >
                <Link
                  href={`/dashboard/chats/${chat?._id}`}
                  className={`py-3 px-5 w-full rounded-md font-mono ${
                    pathname === `/dashboard/chats/${chat?._id}`
                      ? "bg-[#2c2937] text-[#ddd] rounded-md "
                      : "hover:bg-[#2c2937] hover:text-[#ddd]  text-gray-400"
                  }`}
                >
                  <span className="text-sm capitalize font-bold">
                    {chat?.title}
                  </span>
                </Link>
                <button
                  className="text-[#a5a5a5] hover:text-red-500"
                  onClick={() => handleModal(chat?._id, chat?.title)}
                >
                  <RiDeleteBin5Fill size={18} />
                </button>{" "}
                {/* Tombol hapus */}
              </div>
            ))
          )}
        </div>
        <hr className="border-[#242231]" />
        <div className="flex flex-col gap-2 mt-auto px-4">
          <Image
            src="/logo_.png"
            alt="logo-image"
            width={30}
            height={30}
            className="w-[30px] h-[30px] object-contain"
            priority={true}
          />
          <div className="flex flex-col gap-1 text-sm text-gray-400">
            <span className="text-sm">Upgrade ke Hulenx AI PRO</span>
            <span className="text-sm">Akses Unlimited Ke semua fitur</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatList;

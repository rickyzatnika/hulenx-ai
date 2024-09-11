"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (text) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      return await res.json(); // Mengembalikan respons JSON
    },
    onSuccess: async (data) => {
      // Ubah parameter menjadi data
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["userChats"] });
      const chatId = data.chatId; // Ambil chatId dari respons
      router.push(`/dashboard/chats/${chatId}`); // Navigasi ke halaman chat
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };
  return (
    <div className="h-full flex flex-col justify-between items-center py-6">
      <div className="flex-1 flex flex-col items-center justify-center w-[50%] gap-12 ">
        <div className="flex items-center gap-5 opacity-20 ">
          <Image
            src="/logo_.png"
            alt=""
            width={70}
            height={70}
            className="w-[50px] h-[60px]"
          />
          <h1 className="text-2xl md:text-7xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
            HULENX AI
          </h1>
        </div>
        <div className="w-full flex items-center justify-center gap-10">
          <div className="flex-1 flex flex-col items-center gap-3 text-sm p-5 border border-gray-700 rounded-xl text-gray-400">
            <Image
              src="/chat.png"
              alt="chat-image"
              width={30}
              height={30}
              className="w-[30px] h-[30px]"
            />
            <span>Create a New Chat</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3 text-sm p-5 border border-gray-700 rounded-xl text-gray-400">
            <Image
              src="/image.png"
              alt="image"
              width={30}
              height={30}
              className="w-[30px] h-[30px]"
            />
            <span>Analyze Images</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3 text-sm p-5 border border-gray-700 rounded-xl text-gray-400">
            <Image
              src="/code.png"
              alt="code-image"
              width={30}
              height={30}
              className="w-[30px] h-[30px]"
            />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 mx-auto w-[68%] h-auto  bg-[#12101B] rounded-xl mb-3">
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-between py-2  w-full h-full"
        >
          <input
            type="text"
            name="text"
            required
            placeholder="Ask me anything..."
            className="bg-transparent border-none outline-none text-[#ddd] py-2 px-4 flex-1"
          />
          <button className="bg-[#605e68] p-2  rounded-full cursor-pointer flex items-center justify-center mx-3 my-auto ">
            <Image
              src="/arrow.png"
              alt=""
              width={16}
              height={16}
              className="w-[16px] h-[16px] object-contain"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;

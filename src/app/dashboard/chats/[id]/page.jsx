"use client";

import { useQuery } from "@tanstack/react-query";
import Markdown from "react-markdown";

import { useParams } from "next/navigation";
import NewPrompt from "@/components/NewPrompt";
import Image from "next/image";
import { IKImage } from "imagekitio-next";
import { useState } from "react";

const ChatPage = () => {
  const { id: chatId } = useParams();
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () =>
      await fetch(`/api/chats/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  });

  const handLeShowImage = (img) => {
    setShowImage(true);
    setSelectedImage(img);
  };

  return (
    <>
      {showImage && selectedImage && (
        <div
          onClick={() => setShowImage(false)}
          className="fixed top-0 left-0 w-full h-full bg-black/40 backdrop-blur flex justify-center items-center z-[9999]"
        >
          <IKImage
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGE_KIT_ENDPOINT}
            path={selectedImage}
            transformation={[{ quality: 80 }]}
            width="800"
            height="600"
            loading="lazy"
            alt="image"
            className="object-contain"
            priority={true}
          />
        </div>
      )}
      <div className="h-full flex flex-col justify-center items-center py-5 ">
        <div className="flex-1 overflow-y-scroll w-full flex justify-center wrapper">
          <div className="w-full lg:w-[70%] flex flex-col gap-5 chat relative">
            {isPending
              ? "Loading..."
              : error
              ? "Something went wrong!"
              : data?.history?.map((message, i) => (
                  <div key={i} className="flex flex-col gap-5 relative">
                    {message.img && (
                      <IKImage
                        urlEndpoint={process.env.NEXT_PUBLIC_IMAGE_KIT_ENDPOINT}
                        path={message.img}
                        transformation={[{ quality: 10 }]}
                        width="200"
                        height="200"
                        loading="lazy"
                        alt="image"
                        priority={true}
                        className="flex self-end object-contain cursor-zoom-in"
                        onClick={() => {
                          handLeShowImage(message.img);
                        }}
                      />
                    )}
                    <div
                      className={
                        message.role === "user"
                          ? "message user bg-[#2c2937c2] rounded-md w-[70%] self-end p-4"
                          : "message p-5 "
                      }
                    >
                      {message.role === "model" ? (
                        <div className="message-content relative text-sm leading-relaxed">
                          <Markdown>{message.parts[0].text}</Markdown>
                          <div className="model-content absolute h-full top-0 -left-16 opacity-50 pr-4 z-10">
                            <Image
                              src="/logo_.png"
                              alt="hulenx-ai"
                              width={40}
                              height={40}
                              className="w-[40px] h-[40px]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="message-content relative text-sm leading-relaxed">
                          <Markdown>{message.parts[0].text}</Markdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

            {data && <NewPrompt data={data} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;

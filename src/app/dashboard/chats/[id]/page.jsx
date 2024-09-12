"use client";

import { useQuery } from "@tanstack/react-query";
import Markdown from "react-markdown";

import { useParams } from "next/navigation";
import NewPrompt from "@/components/NewPrompt";
import Image from "next/image";
import { IKImage } from "imagekitio-next";
import { useState } from "react";
import rehypeRaw from "rehype-raw";

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

  console.log(data);

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
            transformation={[
              {
                height: 600,
                width: 600,
              },
              {
                quality: 90,
              },
            ]}
            loading="lazy"
            alt="image"
            className="object-contain"
            priority={true}
          />
        </div>
      )}
      <div className="h-full flex flex-col justify-center items-center py-5 pt-24 px-2">
        <div className="flex-1 overflow-y-scroll w-full flex justify-center wrapper">
          <div className="w-full lg:w-[70%] flex flex-col gap-5 chat relative">
            {isPending
              ? "Loading..."
              : error
              ? "Something went wrong!"
              : data?.history?.map((message, i) => (
                  <div
                    key={i}
                    className="flex text-[#cccccc] flex-col gap-5 relative"
                  >
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
                          ? "message user bg-[#3c394b9f] rounded-md self-end py-2 px-4"
                          : "message p-1  "
                      }
                    >
                      {message.role === "model" ? (
                        <div className="message-content relative text-md px-2 leading-relaxed">
                          <Markdown rehypePlugins={[rehypeRaw]}>
                            {message.parts[0].text}
                          </Markdown>
                          <div className="model-content absolute rounded-full bg-[#2c2937c2] p-2 top-0 -left-16 opacity-50 pr-4 z-10">
                            <Image
                              src="/logo_.png"
                              alt="hulenx-ai"
                              width={20}
                              height={25}
                              className="w-[20px] h-[25px] object-contain mx-auto"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="leading-relaxed text-md">
                          <Markdown>{message.parts[0].text}</Markdown>
                          <span className="text-sm text-gray-400"></span>
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

"use client";

import { useRef, useState, useEffect } from "react";
import { IKImage } from "imagekitio-next";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Upload from "./Upload";
import model from "@/lib/gemini";
import Image from "next/image";

const NewPrompt = ({ data }) => {
  const queryClient = useQueryClient();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const endRef = useRef(null);
  const formRef = useRef(null);

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history:
      data?.history?.map(({ role, parts }) => ({
        role,
        parts: [{ text: parts[0]?.text || "" }],
      })) || [],
  });

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/chats/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      });

      const result = await res.json(); // Ambil respons JSON
      console.log("PUT Response:", result); // Tambahkan log untuk respons
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chat", data._id] });
      formRef.current.reset();
      setQuestion("");
      setAnswer("");
      setImg({ isLoading: false, error: "", dbData: {}, aiData: {} });
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      // Panggil mutate dengan data yang benar
      mutation.mutate(text); // Pastikan ini memanggil mutation tanpa argumen
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false);
  };

  const hashRun = useRef(false);
  useEffect(() => {
    if (!hashRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hashRun.current = true;
  }, []);

  return (
    <>
      {img?.isLoading && <div>Loading...</div>}
      {img.dbData?.filePath && (
        <div className="relative w-48 h-48 flex self-end">
          {/* Tambahkan kelas untuk tinggi */}
          <IKImage
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGE_KIT_ENDPOINT}
            path={img.dbData?.filePath}
            transformation={[
              {
                height: 200,
                width: 200,
              },
            ]}
            loading="lazy"
            priority={true}
            className="flex self-end"
            alt="image"
          />
        </div>
      )}

      {question && (
        <div className="message user text-xs md:text-sm leading-relaxed bg-[#2c2937c2] rounded-md w-[70%] self-end p-4">
          {question}
        </div>
      )}
      {answer && (
        <div className="message text-xs md:text-sm leading-relaxed p-5">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="pb-20" ref={endRef}></div>
      {/* ADD NEW CHAT */}
      <form
        className="newForm w-full lg:w-[50%] flex items-center gap-2 fixed bottom-0.5 z-20  backdrop-blur-sm py-3 rounded-lg px-5 bg-[#161422dc] shadow-lg shadow-black/20"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <textarea
          type="text"
          rows={1} // Ubah menjadi 1 untuk memulai dengan satu baris
          name="text"
          placeholder="Write your question here..."
          className="outline-none bg-transparent border-none resize-none p-3 text-xs md:text-sm text-[#e2e2e2] placeholder:text-[#949393] focus:placeholder-transparent  w-full"
          onInput={(e) => {
            e.target.style.height = "auto"; // Reset tinggi
            e.target.style.height = `${e.target.scrollHeight}px`; // Sesuaikan tinggi
          }}
        />
        <button className="bg-[#b4b4b4] rounded-full p-2 flex items-center justify-center cursor-pointer">
          <Image src="/arrow.png" alt="" width={16} height={16} />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;

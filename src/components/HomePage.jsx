"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");
  const { data: session, status } = useSession();
  const router = useRouter();

  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Pergeseran untuk layer 1 (kecepatan paling lambat)
      const layer1X = (mouseX - window.innerWidth / 2) / -20;
      const layer1Y = (mouseY - window.innerHeight / 2) / -20;

      // Pergeseran untuk layer 2 (kecepatan sedang)
      const layer2X = (mouseX - window.innerWidth / 2) / -15;
      const layer2Y = (mouseY - window.innerHeight / 2) / -15;

      // Pergeseran untuk layer 3 (kecepatan paling cepat)
      const layer3X = (mouseX - window.innerWidth / 2) / -10;
      const layer3Y = (mouseY - window.innerHeight / 2) / -10;

      layer1Ref.current.style.transform = `translate(${layer1X}px, ${layer1Y}px)`;
      layer2Ref.current.style.transform = `translate(${layer2X}px, ${layer2Y}px)`;

      layer3Ref.current.style.transform = `translate(${layer3X}px, ${layer3Y}px)`;
    };

    // Kode untuk kursor bulat
    const customCursor = document.createElement("div");
    customCursor.classList.add("custom-cursor");
    document.body.appendChild(customCursor);

    document.addEventListener("mousemove", (event) => {
      customCursor.style.left = event.clientX + "px";
      customCursor.style.top = event.clientY + "px";
    });

    // Tambahkan event listener pada `document`
    document.addEventListener("mousemove", handleMouseMove);

    const changeCursorStyle = (isHover) => {
      if (isHover) {
        customCursor.classList.add("custom");
      } else {
        customCursor.classList.remove("custom");
      }
    };

    // Tambahkan event listener untuk mengubah gaya kursor saat bertemu dengan elemen tertentu
    const h1Element = layer1Ref.current;
    const h2Element = layer2Ref.current;

    const handleMouseEnter = (event) => {
      changeCursorStyle(true);
      event.target.classList.add("custom_enter"); // Zoom in saat kursor berada di atas
    };
    const handleMouseLeave = (event) => {
      changeCursorStyle(false);
      event.target.classList.remove("custom_enter"); // Kembali ke ukuran normal
    };

    const letterElements = document.querySelectorAll(".letter");
    letterElements.forEach((letter) => {
      letter.addEventListener("mouseenter", handleMouseEnter);
      letter.addEventListener("mouseleave", handleMouseLeave);
    });

    h1Element.addEventListener("mouseenter", handleMouseEnter);
    h1Element.addEventListener("mouseleave", handleMouseLeave);
    h2Element.addEventListener("mouseenter", handleMouseEnter);
    h2Element.addEventListener("mouseleave", handleMouseLeave);

    // Hapus event listener saat komponen dibongkar
    return () => {
      h1Element.removeEventListener("mouseenter", handleMouseEnter);
      h1Element.removeEventListener("mouseleave", handleMouseLeave);
      h2Element.removeEventListener("mouseenter", handleMouseEnter);
      h2Element.removeEventListener("mouseleave", handleMouseLeave);

      document.removeEventListener("mousemove", handleMouseMove);

      // Hapus kursor custom
      document.body.removeChild(customCursor);
    };
  }, []); // Jalankan useEffect hanya sekali saat komponen dirender

  const handleSignIn = () => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="w-full min-h-screen h-full flex flex-col lg:flex-row items-center gap-10 px-2 sm:px-6  md:px-24 cursor-none pt-24">
        <div className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden">
          <Image
            src="/orbital.png"
            alt="image"
            className="orbital object-cover"
            width={800}
            height={800}
            priority={true}
          />
        </div>
        <div className="flex-0 md:flex-1 flex flex-col items-center justify-center gap-4 md:gap-8 pt-10 md:pt-8 ">
          <h1
            ref={layer1Ref}
            className="text-5xl md:text-8xl text-[#413572] font-extrabold font-mono"
          >
            HULENX AI
          </h1>
          <h2
            ref={layer2Ref}
            className="text-lg md:text-xl w-full text-[#bdbdbd]  md:w-[80%] text-center leading-relaxed capitalize"
          >
            {`Tingkatkan kreativitas dan Inovasi dengan Artificial intelligence`
              .split("")
              .map((char, index) => (
                <span key={index} className="letter">
                  {char}
                </span>
              ))}
          </h2>
          <button
            onClick={() => handleSignIn()}
            className="bg-[#413572] text-sm md:text-base px-4 py-3 rounded-xl text-gray-200 hover:bg-[#392c69] hover:text-gray-100"
          >
            Ayo Mulai
          </button>
        </div>
        <div
          ref={layer3Ref}
          className="flex-0 lg:flex-1 flex items-center justify-center w-full h-full md:h-[100vh] "
        >
          <div className="flex items-center justify-center bg-[#140e2d] w-full md:w-[80%] h-[200px] md:h-[300px] relative rounded-3xl">
            <div className="w-full h-full overflow-hidden absolute top-0 left-0 rounded ">
              <div className="bg bg-[url('/bg.png')] opacity-40 bg-cover bg-center w-[200%] h-full" />
            </div>
            <Image
              src="/bot.png"
              alt="bot"
              className="bot object-contain w-[90%] h-[90%] md:w-[60%] md:h-[60%] relative z-10"
              width={100}
              height={100}
              priority={true}
            />
            <div className=" absolute text-xs  flex items-center gap-3 p-2 md:text-sm rounded-xl bg-[#2c2937] -bottom-8 right-0 md:-right-12 ">
              <Image
                width={30}
                height={30}
                className="rounded-full w-[30px] h-[30px] object-cover"
                src={
                  typingStatus === "human1"
                    ? "/human1.jpeg"
                    : typingStatus === "human2"
                    ? "/human2.jpeg"
                    : "/bot.png"
                }
                alt="human"
              />
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  "Hello bot",
                  2000,
                  () => {
                    setTypingStatus("bot");
                  },
                  "Hello, what can I help you with?",
                  2000,
                  () => {
                    setTypingStatus("human2");
                  },
                  "I produce food for Guinea Pigs",
                  2000,
                  () => {
                    setTypingStatus("bot");
                  },
                  "oh thats sounds great!",
                  2000,
                  () => {
                    setTypingStatus("human1");
                  },
                ]}
                wrapper="span"
                repeat={Infinity}
                cursor={true}
                omitDeletionAnimation={true}
              />
            </div>
          </div>
        </div>
        <div className="relative mb-6 lg:absolute bottom-0 flex items-center flex-col gap-3 lg:translate-x-[-50%] lg:left-[50%] mt-14">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo_.png"
              alt="logo"
              className="object-contain w-[26px] h-[30px]"
              width={26}
              height={30}
              priority={true}
            />
            <p className="text-md">Hulenx AI</p>
          </Link>
          <div className="links flex gap-2 text-gray-400 text-xs">
            <Link className="a" href="/terms-of-service">
              Terms of Service
            </Link>
            <Link className="a" href="/privacy-of-policy">
              Privacy Policy
            </Link>
            <Link className="a" href="/contact">
              Contact
            </Link>
          </div>
          <div>
            <p className="text-gray-400 text-xs">
              © 2024 Hulenx AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

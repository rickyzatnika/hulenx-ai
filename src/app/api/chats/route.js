import Chat from "@/models/Chat";
import UserChats from "@/models/UserChats";
import dbConnect from "@/utils/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import { HfInference } from "@huggingface/inference";

// Pastikan access token disimpan di environment variable
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

/*INI GEMINI AI */
export async function POST(req = NextRequest) {
  await dbConnect();

  // Mendapatkan token dari next-auth
  const token = await getToken({ req });
  const userId = token?._id; // Mendapatkan user ID dari token
  const { text } = await req.json();

  if (!userId) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  if (!text) {
    // Periksa apakah text ada
    return new NextResponse(JSON.stringify({ message: "Text is required" }), {
      status: 400,
    });
  }

  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.find({ userId: userId });

    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }
    return new NextResponse(JSON.stringify({ chatId: newChat._id }), {
      status: 201,
    }); // Perbaiki respons
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify({ error: "Error creating chat!" }), {
      status: 500,
    });
  }
}

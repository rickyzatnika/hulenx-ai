import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Chat from "@/models/Chat";
import dbConnect from "@/utils/db";
import UserChats from "@/models/UserChats";

export async function GET(req = NextRequest, { params }) {
  const token = await getToken({ req });
  const userId = token?._id; // Mendapatkan user ID dari token

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    await dbConnect();

    const chat = await Chat.findOne({ _id: params.id, userId });

    if (!chat) {
      return new NextResponse(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify({ error: "Error fetching chat!" }), {
      status: 500,
    });
  }
}

export async function PUT(req = NextRequest, { params }) {
  // Pastikan params.id ada
  if (!params.id) {
    return new NextResponse(JSON.stringify({ error: "Chat ID is required" }), {
      status: 400,
    });
  }

  await dbConnect();
  const token = await getToken({ req });
  const userId = token?._id; // Mendapatkan user ID dari token
  const { question, answer, img } = await req.json();

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );

    // Periksa apakah ada dokumen yang diperbarui
    if (updatedChat.modifiedCount === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Chat not found or not updated" }),
        {
          status: 404,
        }
      );
    }

    return new NextResponse(JSON.stringify(updatedChat), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ error: "Error adding conversation!" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req = NextRequest, { params }) {
  await dbConnect();
  const token = await getToken({ req });
  const userId = token?._id; // Mendapatkan user ID dari token

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    console.log("Request to delete chat with ID:", params.id); // Log ID yang diterima

    // Hapus chat dari UserChats
    const userChatsUpdateResult = await UserChats.updateOne(
      { userId: userId },
      { $pull: { chats: { _id: params.id } } }
    );

    console.log("UserChats update result:", userChatsUpdateResult); // Log hasil update

    // Hapus chat dari koleksi Chat
    const chatDeleteResult = await Chat.deleteOne({ _id: params.id });

    console.log("Chat delete result:", chatDeleteResult); // Log hasil delete

    if (
      userChatsUpdateResult.modifiedCount === 0 &&
      chatDeleteResult.deletedCount === 0
    ) {
      return new NextResponse(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Chat deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting chat:", error); // Log kesalahan
    return new NextResponse(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
}

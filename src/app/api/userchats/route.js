import UserChats from "@/models/UserChats";
import dbConnect from "@/utils/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req = NextRequest) {
  await dbConnect();
  const token = await getToken({ req });
  const userId = token?._id; // Mendapatkan user ID dari token

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const userChats = await UserChats.find({ userId: userId });

    return new NextResponse(JSON.stringify(userChats[0]?.chats), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ error: "Error fetching userchats!" }),
      {
        status: 500,
      }
    );
  }
}

import Users from "@/models/Users";
import db from "@/utils/db";

import { hash, genSalt } from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req = NextRequest) => {
  await db();

  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return new NextResponse(JSON.stringify({ message: "Field Required!" }), {
      status: 400,
    });
  }

  const userExist = await Users.findOne({ name });
  if (userExist) {
    return new NextResponse(
      JSON.stringify({ message: "Username sudah terdaftar." }),
      { status: 409 }
    );
  }

  try {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "Registered Successfully" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "internal server error" }),
      {
        status: 500,
      }
    );
  }
};

// import { HfInference } from "@huggingface/inference";
// import { NextRequest, NextResponse } from "next/server";

// const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

// export async function POST(req = NextRequest) {
//   const { text } = await req.json();

//   if (!text) {
//     return new NextResponse(JSON.stringify({ message: "Text is required" }), {
//       status: 400,
//     });
//   }

//   try {
//     // Menggunakan Hugging Face Text Generation API
//     const response = await hf.textGeneration({
//       model: "gpt2", // Ganti dengan model Hugging Face yang sesuai
//       inputs: text,
//       parameters: {
//         max_new_tokens: 50,
//       },
//     });

//     return NextResponse.json({ generated_text: response.generated_text });
//   } catch (err) {
//     console.error("Hugging Face Error:", err);
//     return new NextResponse(
//       JSON.stringify({ error: "Error generating response" }),
//       {
//         status: 500,
//       }
//     );
//   }
// }

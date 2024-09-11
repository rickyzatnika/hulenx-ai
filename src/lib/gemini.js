import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
  } from "@google/generative-ai";
  
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];
  
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_PUBLIC_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // generationConfig: {
    //   maxOutputTokens: 1000,
    //   temperature: 1.0,
    // },
    safetySettings,
  });
  
  export default model;
  
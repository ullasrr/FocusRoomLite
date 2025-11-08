import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const handleStudyGPT = async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  try {
    // Combine all messages into structured format
    const chatMessages = messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    
    
    // Send to Gemini
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatMessages, // <-- structured conversation
    });

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: "Gemini returned no usable text." });
    }

    return res.json({ response: text });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Gemini API failed." });
  }
};
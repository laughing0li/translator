import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
export const runtime = 'edge';
const apiKey = process.env.GOOGLE_API_KEY ?? "";
export async function POST(request: NextRequest) {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const { language, originalJson } = await request.json();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Update the prompt to be more specific about formatting
        const prompt = `Translate the following JSON to ${language}. Only translate the values, not the keys. Return a valid JSON without any additional formatting or markdown: ${originalJson}`;
        
        const response = await model.generateContent(prompt);
        const rawText = response.response.text();
        
        // Clean and parse the response
        const cleanedText = rawText
            .replace(/```json/g, '')  // Remove markdown json indicators
            .replace(/```/g, '')      // Remove remaining markdown backticks
            .trim();                  // Remove extra whitespace
            
        // Validate that it's proper JSON
        const parsedJson = JSON.parse(cleanedText);
        
        // Return the cleaned and formatted JSON
        return NextResponse.json({ 
            message: JSON.stringify(parsedJson, null, 2) 
        });
    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json(
            { message: "Error translating JSON" },
            { status: 500 }
        );
    }
}

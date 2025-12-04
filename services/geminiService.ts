import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractDataFromImage = async (base64Image: string, mimeType: string): Promise<ExtractedData> => {
  try {
    // Validate inputs
    if (!base64Image) {
      throw new Error("No image data provided");
    }
    
    // Sanitize MIME type. Gemini supports specific image types.
    // Default to 'image/jpeg' if the type is missing or not a standard image type.
    const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    const validMimeType = (mimeType && supportedMimeTypes.includes(mimeType)) 
      ? mimeType 
      : 'image/jpeg';

    console.log(`Processing image with MIME type: ${validMimeType}`);

    const prompt = `
      Analyze this image. It is likely a Driver's License, Vehicle Registration, or Insurance Policy Declaration.
      Extract the following personal and vehicle details if visible.
      Return the data in JSON format.
      If a field is not found or unclear, return null for that field.
      Format dates as YYYY-MM-DD.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: validMimeType,
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            firstName: { type: Type.STRING },
            lastName: { type: Type.STRING },
            address: { type: Type.STRING },
            city: { type: Type.STRING },
            state: { type: Type.STRING },
            zipCode: { type: Type.STRING },
            dateOfBirth: { type: Type.STRING, description: "YYYY-MM-DD" },
            vehicleYear: { type: Type.STRING },
            vehicleMake: { type: Type.STRING },
            vehicleModel: { type: Type.STRING },
          }
        }
      }
    });

    if (response.text) {
      try {
        const parsedData = JSON.parse(response.text) as ExtractedData;
        console.log("Gemini extraction success:", parsedData);
        return parsedData;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Failed to parse AI response");
      }
    }
    throw new Error("No data returned from AI");

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    // Return empty object or partial data instead of crashing if possible, 
    // but here we throw to let the UI handle the error state.
    throw error;
  }
};
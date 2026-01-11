
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const refineMessage = async (
  category: string, 
  userText: string, 
  ngoName: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Refine this donor inquiry message to be warm, professional, and concise. 
      NGO Name: ${ngoName}
      Category: ${category}
      Donor's raw notes: ${userText}
      
      Return ONLY the refined message body. Keep it friendly and human.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text?.trim() || userText;
  } catch (error) {
    console.error("Gemini refinement failed:", error);
    return userText;
  }
};

export const suggestCategory = async (userDescription: string, categories: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this donor's description: "${userDescription}", which of these categories fits best?
      Categories: ${categories.join(', ')}
      
      Return ONLY the category name.`,
      config: {
        temperature: 0.1,
      }
    });
    return response.text?.trim() || '';
  } catch (error) {
    return '';
  }
};

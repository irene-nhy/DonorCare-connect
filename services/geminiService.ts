
import { GoogleGenAI } from "@google/genai";

// Safe access to environment variables to prevent white-screen crashes on platforms like Netlify
const getApiKey = (): string => {
  try {
    return typeof process !== 'undefined' && process.env ? process.env.API_KEY || '' : '';
  } catch (e) {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const refineMessage = async (
  category: string, 
  userText: string, 
  ngoName: string
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Skipping refinement.");
    return userText;
  }

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
  const apiKey = getApiKey();
  if (!apiKey) return '';

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


import { GoogleGenAI } from "@google/genai";

// Fix: Initialize the GoogleGenAI client directly with the environment variable as per the guidelines.
// This assumes `process.env.API_KEY` is always available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates VBA code for Excel based on a user prompt.
 * @param userPrompt The user's request for VBA code.
 * @returns The generated VBA code as a string.
 */
export async function generateVbaCode(userPrompt: string): Promise<string> {
  const systemInstruction = `
You are an expert Excel VBA developer. Your task is to generate complete, production-ready VBA code based on the user's request.
Follow these rules strictly:
1.  **Always include robust error handling.** Use the 'On Error GoTo ErrorHandler' pattern in every Sub or Function.
2.  **The code must be fully self-contained.** It should be a single Sub or Function that can be directly pasted into a new module in the Excel VBE.
3.  **Provide ONLY the raw VBA code.** Do not include any extra explanations, introductory text, or markdown formatting like \`\`\`vba or \`\`\`. The output must be ready to be copied and pasted directly into Excel.
4.  Add comments within the code to explain key parts.
5.  Use explicit variable declarations with \`Dim\` and include \`Option Explicit\` at the top of the module if appropriate.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating VBA code:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}

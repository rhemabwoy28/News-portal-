import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client
// Note: process.env.GEMINI_API_KEY is provided by the environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GeneratedArticle {
  title: string;
  category: string;
  content: string[];
  caption: string;
}

/**
 * Generates an article based on a provided topic or prompt using Gemini 3.
 */
export async function generateArticle(prompt: string): Promise<GeneratedArticle> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a professional news article for GNN (Ghana Network News) based on this topic: ${prompt}. 
      The article should be journalistic, unbiased, and include a few paragraphs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A catchy, journalistic headline.",
            },
            category: {
              type: Type.STRING,
              description: "One of: POLITICS, ECONOMY, TECHNOLOGY, SPORTS, BUSINESS, NATIONAL, EDUCATION, ENTERTAINMENT, LIFESTYLE.",
            },
            content: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of paragraphs for the article body.",
            },
            caption: {
              type: Type.STRING,
              description: "A journalistic caption for an image describing the story.",
            },
          },
          required: ["title", "category", "content", "caption"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from AI agent.");
    }

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate article with AI agent.");
  }
}


import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, MealPlan } from "../types";
import { calculateTDEE } from "../utils/calculations";

export const generateMealPlan = async (user: UserProfile): Promise<MealPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const tdee = calculateTDEE(user);
  
  let targetCalories = tdee;
  if (user.goal === 'Emagrecer') targetCalories -= 500;
  if (user.goal === 'Ganhar Massa') targetCalories += 400;

  const prompt = `Gere um cardápio diário personalizado (formato JSON) para este perfil brasileiro:
    - Idade: ${user.age} anos
    - Gênero: ${user.gender}
    - Objetivo: ${user.goal}
    - Nível de Atividade: ${user.activityLevel}
    - Meta calórica: ${targetCalories} kcal.

    IMPORTANTE: Você DEVE usar exatamente estes títulos para as seções de refeição:
    1. Para o café da manhã use o título: "Desjejum"
    2. Para o almoço use o título: "Almoço"
    3. Para o lanche use o título: "Lanche"
    4. Para o jantar use o título: "Jantar Proteico"

    Instruções:
    - Use alimentos saudáveis da culinária brasileira.
    - Cada refeição deve ter 3 a 5 itens.
    - Retorne descrições nutricionais focadas em nitidez e clareza.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          breakfast: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              items: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "items"]
          },
          lunch: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              items: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "items"]
          },
          snack: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              items: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "items"]
          },
          dinner: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              items: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "items"]
          },
          calories: { type: Type.NUMBER }
        },
        required: ["breakfast", "lunch", "snack", "dinner", "calories"]
      }
    }
  });

  if (!response.text) throw new Error("IA não retornou resposta");
  return JSON.parse(response.text);
};

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,

  

  model: "google/gemma-3-27b-it",
  temperature: 0,

  configuration:{
    baseURL: "https://openrouter.ai/api/v1",
     defaultHeaders:{
     "HTTP-Referer": "http://localhost:3000",
     "X-Title": "Language Translator App",
  }

  }

 
});

const translatePrompt = new PromptTemplate({
  template: `

You are a professional language translator.

Translate the following English text into the {target_language} language.

Rules:
- Output ONLY the translated text.
- Do NOT add explanations, labels, or extra words.

English text:
{input}

`,
  inputVariables: ["input","target_language"], // because in template we are using two variables
});

export async function translateText(input: string,
                                    target_language:string
) {
  const prompt = await translatePrompt.format({
     input,
     target_language ,});
  const response = await model.invoke(prompt);

  return response.content;
}

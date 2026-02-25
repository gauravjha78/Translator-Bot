import { NextResponse } from "next/server";
import { translateText } from "@/lib/translate";

export async function POST(req: Request) {
  const body = await req.json();
  const { text ,target_language} = body;

  const result = await translateText(text,target_language);

  return NextResponse.json({ result });
}

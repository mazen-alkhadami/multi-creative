import { NextResponse } from "next/server";
import { AiAssistantService } from "@/services/aiAssistantService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, lang = "ar" } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // In future phases or when MC_AI_API_KEY is configured,
    // this endpoint bridges to OpenAI, Gemini, or Claude.
    // For Phase 2 static-first readiness, it serves grounded domain knowledge.
    const response = AiAssistantService.getLocalKnowledgeReply(query, lang === "en" ? "en" : "ar");

    return NextResponse.json(response);
  } catch (error) {
    console.error("[Assistant API Error]:", error);
    return NextResponse.json(
      { error: "Internal assistant error" },
      { status: 500 }
    );
  }
}

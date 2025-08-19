import cloudinary from "@/app/lib/cloudinary";
import { db } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.imageUrl) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
    }

    let imageUrlFinal = "";
    if (body.imageUrl.base64) {
      const uploaded = await cloudinary.uploader.upload(body.imageUrl.base64, {
        folder: "produtos-ai",
      });
      imageUrlFinal = uploaded.secure_url;
    }

    const prompt = `
    Você é um especialista em SEO para e-commerce.
    Crie um **título e uma descrição** para o produto da imagem.
    - O título deve ter até 100 caracteres, ser chamativo e incluir palavras-chave relevantes com clareza e firmeza, passando confiança e credibilidade.
    - A descrição deve ter até 250 caracteres, detalhando benefícios ou características do produto e incentivando o clique.
    - Retorne **apenas JSON válido** neste formato:
    {
      "title": "texto",
      "description": "texto"
    }
    Não mencione outros produtos ou informações irrelevantes.
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um especialista em SEO para e-commerce." },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrlFinal } }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content || ""

    const decrementAmount = async () => {
      const coins = await db.coins.update({
        where: { userId: body.userId },
        data: {
          amount: { decrement: 5 },
          updatedAt: new Date(),
        },
      })

      return NextResponse.json({ success: true, coins }, { status: 200 });
    }

    decrementAmount()

    const match = resultText.match(/\{.*"title".*"description".*\}/s);
    let parsedResult = { title: "", description: "" };
    if (match) {
      try { parsedResult = JSON.parse(match[0]); } catch { }
    }

    return NextResponse.json({ result: parsedResult });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao gerar conteúdo" }, { status: 500 });
  }
}

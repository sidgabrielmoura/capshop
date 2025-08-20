import cloudinary from "@/app/lib/cloudinary";
import { db } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.imageUrl || !body.userId || body.userAmount === undefined) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
    }

    if (body.userAmount < 5) {
      return NextResponse.json({ error: "Você não possui saldo suficiente para gerar SEO." }, { status: 403 });
    }

    let imageUrlFinal = "";
    if (body.imageUrl.base64) {
      const uploaded = await cloudinary.uploader.upload(body.imageUrl.base64, {
        folder: "produtos-ai",
      });
      imageUrlFinal = uploaded.secure_url;
    } else {
      imageUrlFinal = body.imageUrl;
    }

    const prompt = `
    Você é um especialista em SEO para e-commerce.
    Crie um **título e uma descrição** para o produto da imagem.
    - O título deve ter até 100 caracteres, ser chamativo e incluir palavras-chave relevantes.
    - A descrição deve ter até 250 caracteres, detalhando benefícios e incentivando o clique.
    - Retorne **apenas JSON válido** neste formato:
    {
      "title": "texto",
      "description": "texto"
    }
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

    if (!response.ok) {
      return NextResponse.json({ error: "Erro ao chamar modelo de IA" }, { status: 500 });
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content || "";

    const match = resultText.match(/\{.*"title".*"description".*\}/s);
    let parsedResult = { title: "", description: "" };
    if (match) {
      try {
        parsedResult = JSON.parse(match[0]);
      } catch (err) {
        console.error("Erro ao parsear JSON da IA:", err);
      }
    }

    const coins = await db.coins.update({
      where: { userId: body.userId },
      data: {
        amount: { decrement: 5 },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, result: parsedResult, coins });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno ao gerar conteúdo" }, { status: 500 });
  }
}

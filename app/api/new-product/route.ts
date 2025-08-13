import { NextResponse } from "next/server";
import { db } from "@/app/lib/prisma";
import cloudinary from "@/app/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.price || !body.images?.length) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const finalImages: { url: string }[] = [];

    for (const img of body.images) {
      if (img.base64) {
        const uploaded = await cloudinary.uploader.upload(img.base64, {
          folder: "produtos",
        });
        finalImages.push({ url: uploaded.secure_url });
      } else if (img.url) {
        finalImages.push({ url: img.url });
      }
    }

    const product = await db.product.create({
      data: {
        status: body.status || "active",
        name: body.name,
        category: body.category,
        specifications: body.specifications as string[],
        description: body.description,
        price: body.price,
        originPrice: body.originPrice,
        user: {
          connect: { id: body.userId }
        },
        images: {
          create: finalImages
        }
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("💥 Erro no POST /api/new-product:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
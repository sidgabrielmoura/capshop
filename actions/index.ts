import { db } from "@/app/lib/prisma"
import { ProductInput, UserSession } from "@/interfaces"
import { getSession } from "next-auth/react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUserId = async (req: any, res: any) => {
    const UseSession = await getSession({ req })
    const session = UseSession?.user as UserSession

    if (!session?.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    return session.id
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createProduct = async (product: ProductInput, req?: any, res?: any) => {

    const userId = await getUserId(req, res)

    await db.product.create({
        data: {
            name: product.name as string,
            description: product.description as string,
            price: Number(product.price) as number,
            originPrice: Number(product.origin_price) as number,
            images: {
                create: product.images.map(image => ({
                    url: image.url
                }))
            },
            user: {
                connect: {
                    id: userId
                }
            }
        }
    })
}
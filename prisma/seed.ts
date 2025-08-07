// prisma/seed.ts
import { PrismaClient } from '@/app/lib/generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding...')

    // Criar planos
    const freePlan = await prisma.plan.create({
        data: {
            name: 'Free',
            priceCents: 0,
            features: ['Cadastrar produtos manualmente']
        }
    })

    const proPlan = await prisma.plan.create({
        data: {
            name: 'Pro',
            priceCents: 2990, // R$29,90
            features: ['IA para nome', 'IA para descrição', 'Prioridade no suporte']
        }
    })

    // Criar usuários
    const userFree = await prisma.user.create({
        data: {
            name: 'João Grátis',
            email: 'joao@gmail.com',
            subscription: {
                create: {
                    planId: freePlan.id,
                    isActive: true,
                    startedAt: new Date()
                }
            }
        }
    })

    const userPro = await prisma.user.create({
        data: {
            name: 'Maria Pro',
            email: 'maria@gmail.com',
            subscription: {
                create: {
                    planId: proPlan.id,
                    isActive: true,
                    startedAt: new Date()
                }
            }
        }
    })

    // Produto do usuário grátis
    await prisma.product.create({
        data: {
            name: 'Caneca Estampada',
            description: 'Caneca de cerâmica personalizada com sua arte.',
            userId: userFree.id,
            images: {
                create: [
                    {
                        url: 'https://i.pinimg.com/1200x/bd/df/d4/bddfd4fd3ccd7a9218777543cd1a41a9.jpg'
                    }
                ]
            }
        }
    })

    // Produto do usuário PRO
    const produtoPro = await prisma.product.create({
        data: {
            name: 'Tênis Esportivo Turbo X',
            description: 'Tênis ideal para corrida e caminhadas longas.',
            userId: userPro.id,
            images: {
                create: [
                    {
                        url: 'https://i.pinimg.com/736x/31/f8/eb/31f8eb638e049ed108a0f3870201785d.jpg'
                    }
                ]
            }
        }
    })

    // Conteúdo gerado por IA para o produto PRO
    await prisma.generatedContent.createMany({
        data: [
            {
                type: 'title',
                content: 'Tênis Turbo X com Amortecimento Profissional',
                productId: produtoPro.id
            },
            {
                type: 'description',
                content:
                    'Descubra o conforto e a performance do Tênis Turbo X. Ideal para atletas e iniciantes. Otimizado para buscas!',
                productId: produtoPro.id
            }
        ]
    })

    console.log('✅ Seed concluído com sucesso!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

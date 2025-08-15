import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  const body = await req.json();
  const { priceID, quantity } = body;

  console.log(priceID, quantity)

  try {
    if (priceID === "price_1Rw8nEQCuTgWpGfknSwWOh33") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price: priceID,
            quantity: quantity,
          },
        ],
        success_url: `${req.headers.get("origin")}/success?id=coin`,
        cancel_url: `${req.headers.get("origin")}/cancel?id=coin`,
      })

      return new Response(JSON.stringify({ url: session.url }), { status: 200 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceID,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
}

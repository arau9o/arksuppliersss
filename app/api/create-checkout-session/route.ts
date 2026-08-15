import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getPackageById } from "@/lib/packages";

export async function POST(req: NextRequest) {
  try {
    const { packageId } = await req.json();

    const pkg = getPackageById(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get("host")}`;

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${pkg.robux.toLocaleString()} Robux — ${pkg.label}`,
              description: `You will receive ${pkg.robux.toLocaleString()} Robux. We will contact you via email with delivery instructions.`,
              images: [],
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: undefined, // Stripe will collect it
      billing_address_collection: "auto",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        packageId: pkg.id,
        robuxAmount: pkg.robux.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

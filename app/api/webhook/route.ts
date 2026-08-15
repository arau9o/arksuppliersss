import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { Resend } from "resend";

// No module-level instantiation — both Stripe and Resend are initialized
// inside the handler so Vercel's build analysis never triggers their constructors.

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Awaited<ReturnType<typeof getStripe>>;

  try {
    // @ts-expect-error — event typed below via narrowing
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // @ts-expect-error — narrowed manually
  if (event.type === "checkout.session.completed") {
    // @ts-expect-error — narrowed manually
    const session = event.data.object;

    const buyerEmail: string | null | undefined = session.customer_details?.email;
    const robuxAmount: string | undefined = session.metadata?.robuxAmount;
    const robloxUsername = process.env.ROBLOX_USERNAME || "ArkSuppliers";
    const sellerEmail = process.env.SELLER_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || "orders@arksuppliers.com";

    // Resend initialized here — never at module level
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Email to buyer
    if (buyerEmail) {
      await resend.emails.send({
        from: `ArkSuppliers <${fromEmail}>`,
        to: buyerEmail,
        subject: `Your ${Number(robuxAmount).toLocaleString()} Robux Order — ArkSuppliers`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0D0F14;color:#fff;padding:40px;border-radius:12px;">
            <h1 style="color:#0042B7;font-size:28px;margin-bottom:8px;">Order Confirmed ✅</h1>
            <p style="color:#8B8FA8;font-size:14px;margin-bottom:32px;">Thank you for purchasing from ArkSuppliers.</p>

            <div style="background:#151820;border:1px solid #1E2330;border-radius:10px;padding:24px;margin-bottom:24px;">
              <p style="color:#8B8FA8;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 4px;">Your Order</p>
              <p style="font-size:28px;font-weight:700;color:#FFC840;margin:0;">${Number(robuxAmount).toLocaleString()} <span style="font-size:16px;color:#8B8FA8;">Robux</span></p>
            </div>

            <h2 style="font-size:18px;margin-bottom:12px;">Next Steps</h2>
            <ol style="color:#8B8FA8;line-height:1.8;padding-left:20px;">
              <li>Open Roblox and go to your Friends tab.</li>
              <li>Search for <strong style="color:#fff;">${robloxUsername}</strong> and send a friend request.</li>
              <li>Once accepted, we will send your Robux and a screenshot receipt to this email within <strong style="color:#fff;">24 hours</strong>.</li>
            </ol>

            <p style="color:#8B8FA8;font-size:13px;margin-top:32px;">
              Questions? Reply to this email and we&apos;ll get back to you.
            </p>

            <hr style="border:none;border-top:1px solid #1E2330;margin:32px 0;" />
            <p style="color:#3a3d4a;font-size:12px;text-align:center;">ArkSuppliers — Your trusted Robux source</p>
          </div>
        `,
      });
    }

    // Email to seller
    if (sellerEmail) {
      await resend.emails.send({
        from: `ArkSuppliers Orders <${fromEmail}>`,
        to: sellerEmail,
        subject: `🛒 New Order — ${Number(robuxAmount).toLocaleString()} Robux`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;padding:24px;">
            <h2>New Robux Order</h2>
            <p><strong>Buyer email:</strong> ${buyerEmail}</p>
            <p><strong>Robux amount:</strong> ${Number(robuxAmount).toLocaleString()}</p>
            <p><strong>Session ID:</strong> ${session.id}</p>
            <p>Send the Robux and a screenshot receipt to the buyer&apos;s email.</p>
          </div>
        `,
      });
    }
  }

  return NextResponse.json({ received: true });
}

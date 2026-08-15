import { getStripe } from "@/lib/stripe";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  let robuxAmount = "";
  let email = "";

  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      robuxAmount = session.metadata?.robuxAmount || "";
      email = session.customer_details?.email || "";
    } catch {
      // silently fall through — success page still renders
    }
  }

  return (
    <main className="min-h-screen bg-[#0D0F14] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated checkmark */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full bg-[#0042B7]/20 animate-ping" />
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#0042B7]/10 border border-[#0042B7]/30">
            <svg className="w-12 h-12 text-[#0042B7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Order Confirmed!
        </h1>

        {robuxAmount && (
          <div className="inline-flex items-center gap-2 bg-[#151820] border border-[#1E2330] rounded-full px-5 py-2 mb-6">
            <span className="text-[#FFC840] font-bold text-lg">
              {Number(robuxAmount).toLocaleString()}
            </span>
            <span className="text-[#8B8FA8] text-sm">Robux ordered</span>
          </div>
        )}

        <div className="bg-[#151820] border border-[#1E2330] rounded-2xl p-6 mb-6 text-left">
          <p className="text-[#8B8FA8] text-xs uppercase tracking-widest mb-4 font-medium">
            What happens next
          </p>
          <div className="space-y-4">
            {[
              {
                icon: "📧",
                title: "Check your email",
                desc: email
                  ? `We've sent delivery instructions to ${email}.`
                  : "We've sent delivery instructions to your email.",
              },
              {
                icon: "👤",
                title: "Add our Roblox account",
                desc: "Follow the instructions in the email to add our account on Roblox.",
              },
              {
                icon: "💸",
                title: "Receive your Robux",
                desc: "We'll send your Robux and a screenshot receipt within 24 hours.",
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-2xl leading-none mt-0.5">{step.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{step.title}</p>
                  <p className="text-[#8B8FA8] text-sm mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#8B8FA8] text-sm mb-8">
          Questions? Reply to the confirmation email and we'll sort you out.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#0042B7] hover:text-[#4D80D4] transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to ArkSuppliers
        </Link>
      </div>
    </main>
  );
}

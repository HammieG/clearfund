"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PledgeForm({ caseId, signedIn }: { caseId: string; signedIn: boolean }) {
  const router = useRouter(); const [message, setMessage] = useState(""); const [pending, setPending] = useState(false);
  async function submit(formData: FormData) { if (!signedIn) { router.push(`/signin?callbackUrl=/cases/${caseId}`); return; } setPending(true); setMessage(""); const response = await fetch("/api/pledges", { method: "POST", body: formData }); const body = await response.json(); setPending(false); setMessage(response.ok ? "Pledge recorded. Transfer funds directly to the NGO and await verification." : body.error || "Unable to record pledge."); if (response.ok) (document.getElementById("pledge-form") as HTMLFormElement).reset(); }
  return <form id="pledge-form" action={submit} className="mt-6 space-y-3"><input type="hidden" name="caseId" value={caseId}/><label className="block text-sm font-medium">Pledge amount (₹)<input className="input mt-1" required min="1" name="amount" type="number" placeholder="500"/></label><label className="block text-sm font-medium">How will you give?<select className="input mt-1" name="paymentMethod"><option value="UPI">UPI</option><option value="BANK_TRANSFER">Bank transfer</option><option value="CASH">Cash</option></select></label><button disabled={pending} className="button w-full">{pending ? "Recording…" : "Pledge to help"}</button>{message && <p className="text-sm text-slate-600">{message}</p>}</form>;
}

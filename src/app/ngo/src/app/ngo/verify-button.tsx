"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function VerifyButton({ id }: { id: string }) { const [pending, setPending] = useState(false); const router = useRouter(); async function verify() { setPending(true); const response = await fetch(`/api/pledges/${id}/verify`, { method: "POST" }); setPending(false); if (response.ok) router.refresh(); else alert((await response.json()).error || "Could not verify pledge."); } return <button className="button" disabled={pending} onClick={verify}>{pending ? "Verifying…" : "Verify receipt"}</button>; }

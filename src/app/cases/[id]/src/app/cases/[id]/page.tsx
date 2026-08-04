import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/format";
import { PledgeForm } from "./pledge-form";

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let item;
  try { item = await prisma.case.findUnique({ where: { id }, include: { foundation: true } }); } catch (error) { console.error("Unable to load case", error); notFound(); }
  if (!item) notFound();
  const session = await auth(); const percent = Math.min(100, item.raisedAmount.toNumber() / item.goalAmount.toNumber() * 100);
  return <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 lg:grid-cols-[1.2fr_.8fr]"><article><p className="font-semibold text-emerald-700">{item.foundation.name}{item.foundation.verified ? " · Verified NGO" : ""}</p><h1 className="mt-3 text-4xl font-bold tracking-tight">{item.title}</h1><p className="mt-7 whitespace-pre-wrap text-lg leading-8 text-slate-700">{item.description}</p></article><aside className="card h-fit p-6"><p className="text-sm font-semibold text-slate-500">VERIFIED PROGRESS</p><p className="mt-2 text-3xl font-bold">{formatInr(item.raisedAmount)}</p><p className="text-sm text-slate-500">of {formatInr(item.goalAmount)} goal</p><div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-emerald-500" style={{ width: `${percent}%` }}/></div><PledgeForm caseId={item.id} signedIn={Boolean(session?.user)} /></aside></div>;
}

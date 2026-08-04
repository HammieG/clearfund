import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, CircleDollarSign, Heart, Landmark, ShieldCheck, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatInr } from "@/lib/format";

export const dynamic = "force-dynamic";

type DisplayCase = { id: string; foundation: string; title: string; description: string; raised: number; goal: number; label: string; accent: string };
type DisplayEntry = { id: string; donor: string; amount: number; caseTitle: string; date: Date };

const previewCases: DisplayCase[] = [
  { id: "preview-school", foundation: "RAAHAT Foundation", title: "Keep 40 children learning", description: "Books, uniforms, and the small essentials that keep a school year within reach.", raised: 465000, goal: 650000, label: "Education", accent: "bg-amber-100 text-amber-800" },
  { id: "preview-health", foundation: "RAAHAT Foundation", title: "Urgent care for mothers", description: "Support diagnostics, transport, and essential treatment for families navigating a health emergency.", raised: 310000, goal: 500000, label: "Health", accent: "bg-rose-100 text-rose-800" },
  { id: "preview-home", foundation: "RAAHAT Foundation", title: "Safe shelter before monsoon", description: "Repair roofs and restore dry, secure rooms for households in the most vulnerable neighbourhoods.", raised: 185000, goal: 400000, label: "Shelter", accent: "bg-sky-100 text-sky-800" },
];

const previewEntries: DisplayEntry[] = [
  { id: "preview-1", donor: "Ananya K.", amount: 250000, caseTitle: "Urgent care for mothers", date: new Date("2026-07-29") },
  { id: "preview-2", donor: "Anonymous donor", amount: 180000, caseTitle: "Keep 40 children learning", date: new Date("2026-07-25") },
  { id: "preview-3", donor: "Arjun & Meera", amount: 125000, caseTitle: "Safe shelter before monsoon", date: new Date("2026-07-19") },
  { id: "preview-4", donor: "Community circle", amount: 95000, caseTitle: "Keep 40 children learning", date: new Date("2026-07-12") },
];

export default async function HomePage() {
  let cases = previewCases;
  let entries = previewEntries;
  let previewMode = true;

  try {
    const [dbCases, dbEntries] = await Promise.all([
      prisma.case.findMany({ where: { status: "ACTIVE", foundation: { verified: true } }, include: { foundation: true }, orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.ledgerEntry.findMany({ where: { status: "VERIFIED" }, include: { donor: true, case: true }, orderBy: { timestamp: "desc" }, take: 12 }),
    ]);
    if (dbCases.length > 0) {
      cases = dbCases.map((item, index) => ({ id: item.id, foundation: item.foundation.name, title: item.title, description: item.description, raised: item.raisedAmount.toNumber(), goal: item.goalAmount.toNumber(), label: ["Education", "Health", "Shelter"][index % 3], accent: ["bg-amber-100 text-amber-800", "bg-rose-100 text-rose-800", "bg-sky-100 text-sky-800"][index % 3] }));
      entries = dbEntries.map((entry) => ({ id: entry.id, donor: entry.donor.name || "Anonymous donor", amount: entry.amount.toNumber(), caseTitle: entry.case.title, date: entry.timestamp }));
      previewMode = false;
    }
  } catch (error) { console.error("Unable to load public ledger", error); }

  return <div className="overflow-hidden">
    <section className="hero-grid relative isolate overflow-hidden bg-[#071d3c] text-white">
      <div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/>
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-12 md:pb-28 md:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
          <div className="relative z-10">
            <div className="eyebrow border-white/15 bg-white/10 text-emerald-200"><Sparkles className="h-3.5 w-3.5"/> TRANSPARENT GIVING, MADE HUMAN</div>
            <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.03] tracking-[-0.045em] md:text-7xl">Give with clarity.<br/><span className="text-emerald-300">Follow every impact.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-blue-100 md:text-xl">ClearFund connects people who care with verified grassroots work—through a public ledger that lets every contribution speak for itself.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="#cases" className="button button-light">Explore active cases <ArrowRight className="h-4 w-4"/></Link><Link href="#ledger" className="button button-ghost">See the live ledger</Link></div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-blue-100"><span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300"/> No platform custody</span><span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300"/> NGO-verified receipts</span></div>
          </div>
          <div className="relative z-10 mx-auto w-full max-w-md lg:max-w-none">
            <div className="impact-card"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-slate-500">RAAHAT FOUNDATION</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Impact you can inspect.</h2></div><BadgeCheck className="h-8 w-8 text-emerald-600"/></div><div className="mt-7 rounded-2xl bg-slate-50 p-5"><p className="text-sm font-medium text-slate-500">VERIFIED IMPACT TO DATE</p><p className="mt-1 text-4xl font-bold tracking-tight text-slate-950">₹12,40,000+</p><p className="mt-2 text-sm text-slate-600">Across completed, receipt-verified contributions.</p></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl border border-slate-100 p-4"><p className="text-2xl font-bold text-slate-950">124</p><p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Verified gifts</p></div><div className="rounded-xl border border-slate-100 p-4"><p className="text-2xl font-bold text-slate-950">3</p><p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Open causes</p></div></div><div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5"><div className="flex -space-x-2"><span className="avatar bg-emerald-100">A</span><span className="avatar bg-blue-100">R</span><span className="avatar bg-amber-100">K</span></div><p className="text-sm font-medium text-slate-600">Built for donors who expect proof.</p></div></div>
          </div>
        </div>
      </div>
    </section>
    {previewMode && <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-center text-sm text-amber-900"><strong>Preview data:</strong> Connect PostgreSQL and run the seed to make the live ledger available.</div>}
    <section className="mx-auto max-w-6xl px-5 py-20" id="cases"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="section-kicker">VERIFIED ORGANISATIONS</p><h2 className="section-title">Meaningful needs.<br/>Clear next steps.</h2></div><p className="max-w-sm text-base leading-7 text-slate-600">Choose a case, pledge directly, and return any time to see when it has been officially verified.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{cases.map((item) => <Link className="case-card group" href={item.id.startsWith("preview-") ? "/register" : `/cases/${item.id}`} key={item.id}><div className="case-art"><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${item.accent}`}>{item.label}</span><CircleDollarSign className="h-8 w-8 text-blue-950/35 transition group-hover:scale-110"/></div><div className="p-6"><p className="text-sm font-semibold text-emerald-700">{item.foundation}</p><h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p><div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, item.raised / item.goal * 100)}%` }}/></div><div className="mt-3 flex items-center justify-between"><span className="font-bold text-slate-900">{formatInr(item.raised)}</span><span className="text-sm text-slate-500">of {formatInr(item.goal)}</span></div><div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-900">View case <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></div></div></Link>)}</div></section>
    <section className="border-y border-slate-200 bg-white"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3"><div><Landmark className="h-7 w-7 text-blue-900"/><h3 className="mt-5 text-lg font-bold">Give directly</h3><p className="mt-2 leading-6 text-slate-600">You choose the direct transfer method. ClearFund never receives or routes your funds.</p></div><div><ShieldCheck className="h-7 w-7 text-blue-900"/><h3 className="mt-5 text-lg font-bold">Receipt verified</h3><p className="mt-2 leading-6 text-slate-600">The receiving NGO records confirmation, so pledges and verified impact stay distinct.</p></div><div><Heart className="h-7 w-7 text-blue-900"/><h3 className="mt-5 text-lg font-bold">Visible by design</h3><p className="mt-2 leading-6 text-slate-600">Verified contributions appear in the public ledger, building trust through consistent proof.</p></div></div></section>
    <section id="ledger" className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[.82fr_1.18fr]"><div><p className="section-kicker">PUBLIC LEDGER</p><h2 className="section-title">Trust is a trail<br/>you can follow.</h2><p className="mt-5 max-w-md leading-7 text-slate-600">Every item below was logged only after verification. Private receipt details stay protected; the result stays visible.</p><Link href="/register" className="button mt-7">Start tracking your impact <ArrowRight className="h-4 w-4"/></Link></div><div className="ledger-panel">{entries.map((entry) => <div className="ledger-row" key={entry.id}><div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50"><Check className="h-5 w-5 text-emerald-600"/></div><div className="min-w-0 flex-1"><p className="font-bold text-slate-900">{entry.donor} <span className="font-medium text-slate-500">verified a contribution</span></p><p className="mt-1 truncate text-sm text-slate-500">{entry.caseTitle} · {formatDate(entry.date)}</p></div><p className="font-bold text-slate-900">{formatInr(entry.amount)}</p></div>)}</div></section>
    <section className="mx-auto max-w-6xl px-5 pb-20"><div className="rounded-3xl bg-emerald-500 px-8 py-12 text-emerald-950 md:flex md:items-center md:justify-between md:px-12"><div><p className="font-bold uppercase tracking-[.16em] text-emerald-950/70">Start with confidence</p><h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">A clearer way to stand behind a cause.</h2></div><Link href="/register" className="button mt-7 bg-blue-950 px-6 hover:bg-blue-900 md:mt-0">Create your account <ArrowRight className="h-4 w-4"/></Link></div></section>
  </div>;
}

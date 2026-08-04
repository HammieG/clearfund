import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ caseId: z.string().cuid(), amount: z.coerce.number().positive().max(10_000_000), paymentMethod: z.enum(["CASH", "UPI", "BANK_TRANSFER"]) });
export async function POST(request: Request) {
  const session = await auth(); if (!session?.user.id) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  try { const input = schema.safeParse(Object.fromEntries(await request.formData())); if (!input.success) return NextResponse.json({ error: "Check the pledge details." }, { status: 400 }); const item = await prisma.case.findFirst({ where: { id: input.data.caseId, status: "ACTIVE", foundation: { verified: true } }, select: { id: true } }); if (!item) return NextResponse.json({ error: "This case is not currently accepting pledges." }, { status: 404 }); const pledge = await prisma.ledgerEntry.create({ data: { donorId: session.user.id, caseId: item.id, amount: input.data.amount, paymentMethod: input.data.paymentMethod } }); return NextResponse.json({ id: pledge.id }, { status: 201 }); } catch (error) { console.error("Pledge creation failed", error); return NextResponse.json({ error: "Unable to record pledge." }, { status: 500 }); }
}

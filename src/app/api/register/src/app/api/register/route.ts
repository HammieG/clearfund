import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createDemoUser, findDemoUser, isDemoAuthEnabled } from "@/lib/demo-auth";

const schema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().email(), password: z.string().min(8).max(128) });
export async function POST(request: Request) {
  try { const input = schema.safeParse(await request.json()); if (!input.success) return NextResponse.json({ error: "Enter a valid name, email, and password of at least 8 characters." }, { status: 400 }); const email = input.data.email.toLowerCase(); const passwordHash = await hash(input.data.password, 12); if (isDemoAuthEnabled()) { if (findDemoUser(email)) return NextResponse.json({ error: "An account already exists for that email." }, { status: 409 }); createDemoUser({ id: `demo-${crypto.randomUUID()}`, name: input.data.name, email, image: null, passwordHash, role: "DONOR" }); return NextResponse.json({ ok: true, demo: true }, { status: 201 }); } const existing = await prisma.user.findUnique({ where: { email } }); if (existing) return NextResponse.json({ error: "An account already exists for that email." }, { status: 409 }); await prisma.user.create({ data: { name: input.data.name, email, passwordHash } }); return NextResponse.json({ ok: true }, { status: 201 }); } catch (error) { console.error("Registration failed", error); return NextResponse.json({ error: "Unable to create account." }, { status: 500 }); }
}

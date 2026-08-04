import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const ngo = await prisma.user.upsert({ where: { email: "raahat@example.org" }, update: { role: UserRole.NGO }, create: { name: "RAAHAT Foundation", email: "raahat@example.org", role: UserRole.NGO, passwordHash: await hash("ChangeMe123!", 12) } });
  const donors = await Promise.all([
    ["Aarav Sharma", "donor@example.org"], ["Ananya Kapoor", "ananya@example.org"], ["Meera & Arjun", "meera-arjun@example.org"], ["Community Circle", "circle@example.org"],
  ].map(async ([name, email]) => prisma.user.upsert({ where: { email }, update: {}, create: { name, email, passwordHash: await hash("ChangeMe123!", 12) } })));
  const foundation = await prisma.foundation.upsert({ where: { ownerId: ngo.id }, update: { name: "RAAHAT Foundation", verified: true, description: "Community-led support for families facing urgent hardship." }, create: { ownerId: ngo.id, name: "RAAHAT Foundation", description: "Community-led support for families facing urgent hardship.", verified: true } });
  const cases = await Promise.all([
    ["cmclearfundcase000000000001", "Keep 40 children learning", "Books, uniforms, and the small essentials that keep a school year within reach.", 650000, 465000],
    ["cmclearfundcase000000000002", "Urgent care for mothers", "Support diagnostics, transport, and essential treatment for families navigating a health emergency.", 500000, 310000],
    ["cmclearfundcase000000000003", "Safe shelter before monsoon", "Repair roofs and restore dry, secure rooms for households in vulnerable neighbourhoods.", 400000, 185000],
    ["cmclearfundcase000000000004", "Winter essentials for 60 families", "A completed seasonal essentials drive for families facing unstable housing.", 280000, 280000, "FUNDED"],
  ].map(async ([id, title, description, goalAmount, raisedAmount, status = "ACTIVE"]) => prisma.case.upsert({ where: { id: String(id) }, update: { title: String(title), description: String(description), goalAmount: Number(goalAmount), raisedAmount: Number(raisedAmount), status: status as "ACTIVE" | "FUNDED" }, create: { id: String(id), foundationId: foundation.id, title: String(title), description: String(description), goalAmount: Number(goalAmount), raisedAmount: Number(raisedAmount), status: status as "ACTIVE" | "FUNDED" } })));
  const entries = [
    ["cmclearfundledger00000000001", 1, 1, 250000, "UPI", "RAAHAT-2026-001"], ["cmclearfundledger00000000002", 2, 0, 180000, "BANK_TRANSFER", "RAAHAT-2026-002"], ["cmclearfundledger00000000003", 3, 2, 125000, "UPI", "RAAHAT-2026-003"], ["cmclearfundledger00000000004", 0, 0, 95000, "CASH", "RAAHAT-2026-004"], ["cmclearfundledger00000000005", 0, 1, 60000, "UPI", "RAAHAT-2026-005"], ["cmclearfundledger00000000006", 1, 2, 60000, "BANK_TRANSFER", "RAAHAT-2026-006"], ["cmclearfundledger00000000007", 2, 0, 190000, "UPI", "RAAHAT-2026-007"], ["cmclearfundledger00000000008", 3, 3, 280000, "BANK_TRANSFER", "RAAHAT-2026-008"],
  ] as const;
  for (const [id, donorIndex, caseIndex, amount, paymentMethod, proofReference] of entries) await prisma.ledgerEntry.upsert({ where: { id }, update: { amount, paymentMethod, status: "VERIFIED", proofReference }, create: { id, donorId: donors[donorIndex].id, caseId: cases[caseIndex].id, amount, paymentMethod, status: "VERIFIED", proofReference } });
  await prisma.foundation.update({ where: { id: foundation.id }, data: { totalLoggedFunds: 1240000 } });
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());

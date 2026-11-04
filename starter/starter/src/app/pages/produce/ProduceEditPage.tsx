import type { RequestInfo } from "rwsdk/worker";
import { ProduceForm } from "@/components/ProduceForm";
import { DeleteProduceButton } from "@/components/DeleteProduceButton";
import { produceRepository } from "@/features/produce/produce-repository";
import { toProduceDTO } from "@/features/produce/produce-mapper";

// Route: /profile/:id
export default async function ProduceEditPage({ ctx, params }: RequestInfo) {
  if (!ctx.user) {
    return new Response(null, { status: 302, headers: { Location: "/login" } });
  }

  const row = await produceRepository.findById(params.id);

  if (!row) {
    return (
      <main className="min-h-screen bg-[#FCF8E8] p-8">
        <p className="text-[#C0392B]">Innlegget finnes ikke.</p>
        <a href="/profile" className="mt-4 inline-block text-sm text-[#6B8E23] hover:underline">
          ← Tilbake til profilen
        </a>
      </main>
    );
  }

  if (row.userId !== ctx.user.id) {
    return (
      <main className="min-h-screen bg-[#FCF8E8] p-8">
        <p className="text-[#C0392B]">Du kan bare redigere dine egne innlegg.</p>
        <a href="/profile" className="mt-4 inline-block text-sm text-[#6B8E23] hover:underline">
          ← Tilbake til profilen
        </a>
      </main>
    );
  }

  const dto = toProduceDTO(row);

  return (
    <main className="min-h-screen bg-[#FCF8E8]">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <a
          href="/profile"
          className="mb-4 inline-block text-sm font-medium text-[#6B8E23] hover:underline"
        >
          ← Tilbake til profilen
        </a>
        <h1 className="mb-6 text-2xl font-bold text-[#405516]">Rediger innlegg</h1>

        <ProduceForm
          mode="edit"
          initial={{
            id: dto.id,
            title: dto.title,
            description: dto.description ?? null,
            category: dto.category,
            pickupLocation: dto.pickupLocation,
            amount: dto.amount,
            unit: dto.unit,
            pickupDeadline: dto.pickupDeadline,
            pickedUp: dto.pickedUp,
            contactInfo: dto.contactInfo,
          }}
        />

        <div className="mt-6 border-t border-slate-200 pt-4">
          <DeleteProduceButton id={dto.id} />
        </div>
      </div>
    </main>
  );
}
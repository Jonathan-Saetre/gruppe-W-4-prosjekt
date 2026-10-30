import type { RequestInfo } from "rwsdk/worker";
import { ProduceForm } from "@/components/ProduceForm";
import { DeleteProduceButton } from "@/components/DeleteProduceButton";
import { produceRepository } from "@/features/produce/produce-repository";
import { toProduceDTO } from "@/features/produce/produce-mapper";

// Route: /profile/:id (som i worker.tsx)
export default async function ProduceEditPage({ ctx, params }: RequestInfo) {
  if (!ctx.user) {
    return new Response(null, { status: 302, headers: { Location: "/login" } });
  }

  const row = await produceRepository.findById(params.id);

  if (!row) {
    return <main className="p-8 text-slate-700">Innlegget finnes ikke.</main>;
  }
  // Samme regel som i servicen: bare eieren får redigere.
  if (row.userId !== ctx.user.id) {
    return <main className="p-8 text-slate-700">Du kan bare redigere dine egne innlegg.</main>;
  }

  const dto = toProduceDTO(row);

  return (
    <main className="px-4 py-8">
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
        }}
      />
      <DeleteProduceButton id={dto.id} />
    </main>
  );
}
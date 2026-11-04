import type { RequestInfo } from "rwsdk/worker";
import { ProduceForm } from "@/components/ProduceForm";

export default function ProduceNewPage({ ctx }: RequestInfo) {
  if (!ctx.user) {
    return new Response(null, { status: 302, headers: { Location: "/login" } });
  }

  return (
    <main className="px-4 py-8">
      <ProduceForm mode="create" />
    </main>
  );
}
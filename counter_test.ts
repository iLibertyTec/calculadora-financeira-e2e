import { assertEquals } from "@std/assert";
import { formatLegacyCounterMessage, LegacyVisitCounter } from "./counter.ts";

Deno.test("LegacyVisitCounter increments", () => {
  const c: LegacyVisitCounter = new LegacyVisitCounter();
  assertEquals(c.state.visits, 0);
  c.recordVisit("a");
  assertEquals(c.state.visits, 1);
  assertEquals(c.state.lastVisitor, "a");
});

Deno.test("formatLegacyCounterMessage pt-BR", () => {
  assertEquals(
    formatLegacyCounterMessage({
      visits: 2,
      updatedAt: new Date().toISOString(),
    }),
    "2 visitas registradas.",
  );
});

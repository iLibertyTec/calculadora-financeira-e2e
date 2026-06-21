import {
  assertAlmostEquals,
  assertEquals,
  assertRejects,
} from "@std/assert";
import { calculateSac } from "./sac.ts";

deno.test("calculateSac returns decreasing installments for positive rate", () => {
  const result = calculateSac({
    principal: 1000,
    monthlyRate: 0.01,
    termMonths: 4,
  });

  assertEquals(result.amortization, 250);
  assertEquals(result.firstInstallment, 260);
  assertEquals(result.lastInstallment, 252.5);
  assertEquals(result.totalPaid, 1025);
  assertEquals(result.totalInterest, 25);
  assertEquals(result.firstInstallment >= result.lastInstallment, true);
});

deno.test("calculateSac handles zero rate with equal installments", () => {
  const result = calculateSac({
    principal: 1200,
    monthlyRate: 0,
    termMonths: 12,
  });

  assertEquals(result.amortization, 100);
  assertEquals(result.firstInstallment, 100);
  assertEquals(result.lastInstallment, 100);
  assertEquals(result.totalPaid, 1200);
  assertEquals(result.totalInterest, 0);
});

deno.test("calculateSac keeps monetary precision with rounding", () => {
  const result = calculateSac({
    principal: 1000,
    monthlyRate: 0.015,
    termMonths: 3,
  });

  assertAlmostEquals(result.amortization, 333.33, 0.001);
  assertEquals(result.firstInstallment, 348.33);
  assertEquals(result.lastInstallment, 338.33);
  assertEquals(result.totalPaid, 1029.99);
  assertEquals(result.totalInterest, 29.99);
});

deno.test("calculateSac rejects invalid parameters", async () => {
  await assertRejects(() =>
    Promise.resolve(
      calculateSac({
        principal: 0,
        monthlyRate: 0.01,
        termMonths: 12,
      }),
    ));

  await assertRejects(() =>
    Promise.resolve(
      calculateSac({
        principal: 1000,
        monthlyRate: -0.01,
        termMonths: 12,
      }),
    ));

  await assertRejects(() =>
    Promise.resolve(
      calculateSac({
        principal: 1000,
        monthlyRate: 0.01,
        termMonths: 0,
      }),
    ));
});

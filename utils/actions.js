'use server';

import { serverDb } from '@/utils/serverDbConfig';
import { Budgets } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function getUserBudgets(userEmail) {
  if (!userEmail) return [];
  try {
    const result = await serverDb
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, userEmail));
    return result;
  } catch (error) {
    console.error("Server Action Error fetching budgets:", error);
    return [];
  }
}

export async function createBudget({ name, amount, icon, createdBy }) {
  try {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return { success: false, error: "Invalid amount value" };
    }

    const result = await serverDb
      .insert(Budgets)
      .values({
        name,
        amount: parsedAmount.toString(),
        createdBy,
        icon,
      })
      .returning({ insertedId: Budgets.id });
    return { success: true, data: result };
  } catch (error) {
    // Log the full error object to see the real Postgres error
    console.error("Server Action Error creating budget:");
    console.error("  message:", error.message);
    console.error("  cause:", error.cause);
    console.error("  detail:", error.detail);
    console.error("  code:", error.code);
    console.error("  full error:", JSON.stringify(error, null, 2));

    // Return the most specific error message available
    const errMsg = error.detail || error.cause?.message || error.message;
    return { success: false, error: errMsg };
  }
}

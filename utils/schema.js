import { pgTable, serial, text, varchar, numeric } from "drizzle-orm/pg-core";

// 1. Budgets Table
export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: numeric("amount").notNull(),
  icon: varchar("icon", { length: 50 }),
  createdBy: varchar("createdBy", { length: 255 }).notNull()
});

import { pgTable, serial, text, varchar, numeric, integer } from "drizzle-orm/pg-core";

// 1. Budgets Table
export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: numeric("amount").notNull(),
  icon: varchar("icon", { length: 50 }),
  createdBy: varchar("createdBy", { length: 255 }).notNull()
});

// 2. Expense Table
export const Expenses = pgTable("expenses",{
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  budgetId: integer("budgetId").references(()=>Budgets.id),
  createdAt: varchar("createdAt", { length: 255 }).notNull()
})
"use client"
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function ExpensesScreen({ params }) {
    const resolvedParams = use(params);
    const { user } = useUser();
    const router = useRouter();
    const [budgetInfo, setBudgetInfo] = useState();
    const [expensesList, setExpensesList] = useState([])
    useEffect(() => {
        user && getBudgetInfo();

    }, [user])

    const getBudgetInfo = async () => {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (!userEmail || !resolvedParams?.id) return;

        const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number)
        }).from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(and(
                eq(Budgets.createdBy, userEmail),
                eq(Budgets.id, Number(resolvedParams.id))
            ))
            .groupBy(Budgets.id)

        setBudgetInfo(result[0])
        getExpensesList();
    }

    const getExpensesList = async () => {
        if (!resolvedParams?.id) return;
        const result = await db.select().from(Expenses)
            .where(eq(Expenses.budgetId, Number(resolvedParams.id)))
            .orderBy(desc(Expenses.id));
        setExpensesList(result);
    }

    const deleteBudget = async () => {
        // First delete all linked expenses (required due to foreign key constraint)
        const deleteExpenseResult = await db.delete(Expenses)
            .where(eq(Expenses.budgetId, Number(resolvedParams.id)))
            .returning();

        if (deleteExpenseResult) {
            // Then delete the budget itself
            const result = await db.delete(Budgets)
                .where(eq(Budgets.id, Number(resolvedParams.id)))
                .returning();

            if (result) {
                toast.success('Budget deleted successfully!');
                router.replace('/dashboard/budgets');
            }
        }
    }

    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold flex justify-between'>My Expenses
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="flex gap-2 items-center bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors"> <Trash className="w-4 h-4" /> Delete</button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your budget along with your expenses and remove it from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-6'>
                {budgetInfo ? (
                    <BudgetItem budget={budgetInfo} />
                ) : (
                    <div className='h-[210px] w-full bg-slate-200 rounded-2xl animate-pulse'></div>
                )}
                <AddExpense budgetId={resolvedParams.id} refreshData={() => getBudgetInfo()} />
            </div>
            <div className='mt-4'>
                <h2 className='text-lg font-bold'>Latest Expenses</h2>
                <ExpenseListTable
                    expensesList={expensesList}
                    refreshData={() => getBudgetInfo()}
                />
            </div>
        </div>
    )
}

export default ExpensesScreen

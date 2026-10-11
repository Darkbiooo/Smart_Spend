"use client"
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { and, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { use, useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';

function ExpensesScreen({ params }) {
    const resolvedParams = use(params);
    const { user } = useUser();
    const [budgetInfo, setBudgetInfo] = useState();
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
    }
    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold'>My Expenses</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-6'>
                {budgetInfo ? (
                    <BudgetItem budget={budgetInfo}/>
                ) : (
                    <div className='h-[210px] w-full bg-slate-200 rounded-2xl animate-pulse'></div>
                )}
                <AddExpense budgetId={resolvedParams.id} refreshData={() => getBudgetInfo()}/>
            </div>
        </div>
    )
}

export default ExpensesScreen
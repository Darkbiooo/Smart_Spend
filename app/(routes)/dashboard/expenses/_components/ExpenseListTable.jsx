"use client"
import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from '@/components/ui/toast';

function ExpenseListTable({ expensesList, refreshData }) {

    const deleteExpense = async (expense) => {
        try {
            const result = await db.delete(Expenses)
                .where(eq(Expenses.id, expense.id))
                .returning();
            if (result) {
                showToast("Expense Deleted Successfully", "success");
                refreshData && refreshData();
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
            showToast("Failed to delete expense", "error");
        }
    }
    
    const showToast = (title, type = "info") => {
        if (typeof toast === "function") {
            toast(title);
        } else if (toast?.add) {
            toast.add({ title, type });
        } else {
            console.log(title);
        }
    };
    return (
        <div className='mt-3'>
            <div className='grid grid-cols-4 bg-slate-200 p-2 font-semibold'>
                <h2 className='font-bold'>Name</h2>
                <h2 className='font-bold'>Amount</h2>
                <h2 className='font-bold'>Date</h2>
                <h2 className='font-bold'>Action</h2>
            </div>
            {expensesList?.map((expense, index) => (
                <div key={index} className='grid grid-cols-4 bg-slate-50 p-2 border-b items-center'>
                    <h2>{expense.name}</h2>
                    <h2>{expense.amount}</h2>
                    <h2>{expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : '-'}</h2>
                    <h2>
                        <Trash className='text-red-600 cursor-pointer w-5 h-5'
                        onClick={()=>deleteExpense(expense)}
                        />
                    </h2>
                </div>
            ))}
        </div>
    )
}

export default ExpenseListTable
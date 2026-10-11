"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { toast } from '@/components/ui/toast';
import { Loader2 } from 'lucide-react';

function AddExpense({ budgetId, refreshData }) {
    const { user } = useUser();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const showToast = (title, type = "info") => {
        if (typeof toast === "function") {
            toast(title);
        } else if (toast?.add) {
            toast.add({ title, type });
        } else {
            console.log(title);
        }
    };

    const addNewExpenses = async () => {
        setLoading(true);
        try {
            const result = await db.insert(Expenses).values({
                name: name,
                amount: amount,
                budgetId: Number(budgetId),
                createdAt: new Date().toISOString(),
            }).returning({ insertedId: Expenses.id });

            console.log(result);
            if (result) {
                showToast("Expense Added Successfully", "success");
                setName('');
                setAmount('');
                refreshData && refreshData();
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            showToast("Failed to add expense", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='text-lg font-bold mb-3'>Add Expense</h2>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <Input
                    placeholder="e.g. Groceries"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <Input
                    placeholder="e.g. 100"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <Button 
                onClick={() => addNewExpenses()}
                disabled={!(name && amount) || loading}
                className='mt-3 bg-blue-700 w-full hover:bg-blue-800'
            >
                {loading ? <Loader2 className='animate-spin' /> : "Add New Expense"}
            </Button>
        </div>
    )
}

export default AddExpense
import React from 'react'

function BudgetItem({ budget }) {
    const calculateProgressPerc = () => {
        if (!budget?.amount || Number(budget.amount) === 0) return 0;
        const perc = ((budget.totalSpend || 0) / Number(budget.amount)) * 100;
        return Math.min(Math.max(perc, 0), 100);
    };

    return (
        <div className='p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px] flex flex-col justify-between'>
            <div className='flex gap-2 items-center justify-between'>
                <div className='flex gap-2 items-center'>
                    <h2 className='text-2xl p-3 px-4 bg-slate-100 rounded-full'>{budget?.icon}</h2>
                    <div>
                        <h2 className='font-bold'>{budget.name}</h2>
                        <h2 className='text-sm text-slate-400'>{budget.totalItem} Item</h2>
                    </div>

                </div>
                <h2 className='font-bold text-blue-700 text-lg'>₹{budget.amount}</h2>
            </div>
            <div className='mt-5'>
                <div className='flex justify-between mb-3'>
                    <h2 className='text-xs text-slate-400'>₹{budget.totalSpend ? budget.totalSpend : 0} Spend</h2>
                    <h2 className='text-xs text-slate-400'>₹{budget.amount - (budget.totalSpend || 0)} Remaining</h2>
                </div>
                <div className='w-full bg-slate-300 h-2 rounded-full overflow-hidden'>
                    <div 
                        className='bg-blue-700 h-2 rounded-full'
                        style={{ width: `${calculateProgressPerc()}%` }}
                    >
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BudgetItem
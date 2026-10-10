"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'
import { toast } from '@/components/ui/toast'
import { createBudget } from '@/utils/actions'


function CreateBudget({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("😊");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const showToast = (title, type = "info") => {
    if (typeof toast === "function") {
      toast(title);
    } else if (toast?.add) {
      toast.add({ title, type });
    } else {
      console.log(title);
    }
  };

  const onCreateBudget = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      showToast("User email not found. Please log in.", "error");
      return;
    }

    try {
      setLoading(true);
      const result = await createBudget({
        name,
        amount,
        createdBy: userEmail,
        icon: emojiIcon,
      });

      if (result?.success) {
        showToast("New Budget Created!!", "success");
        setName("");
        setAmount("");
        if (refreshData) {
          refreshData();
        }
      } else {
        showToast(result?.error || "Failed to create budget", "error");
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      showToast("Failed to create budget", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='bg-slate-100 p-10 rounded-2xl items-center flex flex-col justify-center border-2 border-dashed border-slate-300 cursor-pointer hover:shadow-md h-[170px] w-full'>
          <h2 className='text-3xl'>+</h2>
          <h2>Create New Budget</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>
            <div className='mt-5'>
                <Button variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >{emojiIcon}</Button>
                <div className='absolute z-20'>
                  {<EmojiPicker open={openEmojiPicker} onEmojiClick={(e) => { setEmojiIcon(e.emoji); setOpenEmojiPicker(false) }} />}
                </div>
                <div className='mt-2'>
                  <h2 className='text-black font-medium my-1'>Budget Name</h2>
                  <Input 
                    placeholder="e.g. Home Decor"
                    value={name}
                    onChange={(e)=>setName(e.target.value)} 
                  />
                </div>
                <div className='mt-2'>
                  <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                  <Input 
                    type="number"
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e)=>setAmount(e.target.value)} 
                  />
                </div>
                
              </div>
            </DialogDescription>
          </DialogHeader>
           <DialogFooter className="sm:justify-start">
          <DialogClose render={<Button 
                  disabled={!(name && amount) || loading}
                  onClick={()=>onCreateBudget()}
                  className='mt-5 w-full bg-blue-700 hover:bg-blue-800'
                >
                  {loading ? 'Creating...' : 'Create Budget'}
                </Button>} />
        </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}

export default CreateBudget

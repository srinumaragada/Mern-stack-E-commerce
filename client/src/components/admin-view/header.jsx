import React from 'react'
import { Button } from '../ui/button'
import { AlignJustify, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logOut } from '@/store/AuthSlice'

function AdminViewheader({setOpen}) {
const dispatch=useDispatch()
  function handleLogOut(){
    dispatch(logOut())
  }
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-background border-b"> {/* Remove flex-end */}

      <Button onClick={()=>setOpen(true)} className="lg:hidden sm:block border border-red-500">
        <AlignJustify />
        <span className='sr-only'>ToggleButton</span>
      </Button>
    <div className='flex flex-1 justify-end'>
    <Button onClick={()=>handleLogOut()} className="inline-flex gap-2 items-center rounded-md px-4 py-3 shadow">
        <LogOut />
        <span className='ml-2'>Logout</span>
      </Button>
    </div>
    </header>
  )
}

export default AdminViewheader
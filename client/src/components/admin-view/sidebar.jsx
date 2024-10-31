import { ChartNoAxesCombined, LayoutDashboard, ShoppingBasket, ShoppingCart } from 'lucide-react'
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'


const adminSidebarMenuItems=[{
   id:"dashboard",
   label:"DashBoard",
   path:"/admin/dashboard",
   icon:<LayoutDashboard />
},
{
  id:"products",
   label:"Products",
   path:"/admin/products",
   icon:<ShoppingBasket />
},
{
  id:"orders",
  label:"Orders",
  path:"/admin/orders",
  icon:<ShoppingCart />
}]

function MenuItem({setOpen}){
  const navigate=useNavigate()
      return <nav className='mt-8 flex-col flex gap-2'>
        {
          adminSidebarMenuItems.map((menuitem)=><div key={menuitem.id} className='flex  items-center gap-3 rounded-full px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground  cursor-pointer'
           onClick={()=>{navigate(menuitem.path)
                if(setOpen){
                  setOpen(false)
                }}
           }>
            {menuitem.icon}
            <span className='font-bold'>{menuitem.label}</span>
            </div>)
        }
      </nav>
}
function AdminViewsidebar({open,setOpen}) {
  const navigate =useNavigate()
  
  return (
    <Fragment>
      <Sheet  open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="flex w-64">
        <div className='flex flex-col h-full'>
        <SheetTitle className="flex gap-2 mt-10 mb-3">
        <ChartNoAxesCombined />
        <h1  className='text-2xl font-extrabold'>Admin Panel</h1>
        </SheetTitle>
        <SheetHeader className="border-b">
        <MenuItem setOpen={setOpen} />
        </SheetHeader>
        </div>
      </SheetContent>
      </Sheet>
      <aside className='hidden w-64 flex-col border-r bg-background p-6 lg:flex'>
        <div onClick={()=>navigate('/admin/dashboard')}className='flex items-center cursor-pointer gap-2'>
        <ChartNoAxesCombined />
        <h1  className='text-2xl font-extrabold'>Admin Panel</h1>
        </div>
          <MenuItem />
       
      </aside>
    </Fragment>
  )
}

export default AdminViewsidebar
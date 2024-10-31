import React, { useState } from 'react'
import AdminViewsidebar from './sidebar'
import AdminViewheader from './header'
import { Outlet } from 'react-router-dom'

function AdminViewlayout() {
    const [openSidebar,setOpenSideBar]=useState(false)
    return (
        <div className="flex min-h-screen w-full">
            {/* admin sidebar */}
            <AdminViewsidebar open={openSidebar} setOpen={setOpenSideBar} />
            <div className="flex flex-1 flex-col">
                {/* admin header */}
                <AdminViewheader setOpen={setOpenSideBar} />
                <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminViewlayout
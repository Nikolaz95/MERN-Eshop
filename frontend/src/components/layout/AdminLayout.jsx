import React from 'react'
import SideMenu from './SideMenu'

const AdminLayout = ({ children }) => {
    const menuItem = [
        {
            name: "Dashboard",
            url: "/admin/dashboard",
            icon: "fas fa-techometer-alt",
        },

        {
            name: "New Product",
            url: "/admin/product/new",
            icon: "fas fa-user",
        },

        {
            name: "Products",
            url: "/admin/products",
            icon: "fas fa-user",
        },

        {
            name: "Orders",
            url: "/admin/orders",
            icon: "fas fa-user",
        },

        {
            name: "Users",
            url: "/admin/users",
            icon: "fas fa-user",
        },

        {
            name: "Reviews",
            url: "/admin/rewiews",
            icon: "fas fa-user",
        },
    ];
    return (
        <div>
            <div className="mt-2 mb-4 py-4">
                <h2 className="text-center fw-bolder">Admin Dashboard</h2>
            </div>

            <div className="row justify-content-around">
                <div className="col-12 col-lg-3">
                    <SideMenu menuItem={menuItem} />
                </div>
                <div className="col-12 col-lg-8 user-dashboard">{children}</div>
            </div>
        </div>
    )
}

export default AdminLayout
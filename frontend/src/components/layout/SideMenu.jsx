import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';



const SideMenu = () => {

    const menuItem = [
        {
            name: "Profile",
            url: "/me/profile",
            icon: "fas fa-user",
        },

        {
            name: "Update Profile",
            url: "/me/update_profile",
            icon: "fas fa-user",
        },

        {
            name: "Upload Avatar",
            url: "/me/upload_avatar",
            icon: "fas fa-user",
        },

        {
            name: "Update Password",
            url: "/me/update_password",
            icon: "fas fa-user",
        },
    ];

    const location = useLocation();

    const [activeMenuItem, setActiveMenuItem] = useState(location.pathname)

    const handleMenuItemClick = (menuItemUrl) => {
        setActiveMenuItem(menuItemUrl);
    };


    return (
        <div class="list-group mt-5 pl-4">

            {menuItem?.map((menuItem, index) => (
                <Link
                    key={index}
                    to={menuItem.url}
                    class={`fw-bold list-group-item list-group-item-action ${activeMenuItem.includes(menuItem.url) ? "active" : ""}`}
                    onClick={() => handleMenuItemClick(menuItem.url)}
                    aria-current={activeMenuItem.includes(menuItem.url) ? "true" : "false"}
                >
                    <i class={`${menuItem.icon} fa-fw pe-2`}></i>{menuItem.name}</Link>

            ))}

        </div>
    )
}

export default SideMenu

import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {

    const defaultDashboard = getDefaultDashboardRoute(role)

    return [
        {
            items: [
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard",
                    roles: ['ADMIN', 'CUSTOMER']
                },
                {
                    title: "My Profile",
                    href: `/my-profile`,
                    icon: "User",
                    roles: ['ADMIN', 'CUSTOMER']
                },
            ]
        },
        {
            title: 'Settings',
            items: [
                {
                    title: 'Change Password',
                    href: '/change-password',
                    icon: 'Settings',
                    roles: ['CUSTOMER']
                }
            ]
        },
    ]
}



export const customerNavItems: NavSection[] = [
    {
        title: 'Orders',
        items: [
            {
                title: 'My Orders',
                href: '/dashboard/my-orders',
                icon: 'Calender',
                roles: ['CUSTOMER']
            },
            {
                title: 'My Wishlist',
                href: '/dashboard/my-wishlist',
                icon: 'ClipboardList',
                roles: ['CUSTOMER']
            },
        ]
    }
]

export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [
            {
                title: "Admins",
                href: "/admin/dashboard/admins-management",
                icon: "Shield", 
                roles: ['ADMIN'],
            },            
            {
                title: "Users",
                href: "/admin/dashboard/users-management",
                icon: "Users", 
                roles: ['ADMIN'],
            },
        ],
    },
    {
        title: "Product Management",
        items: [
            {
                title: "Add Product",
                href: "/admin/dashboard/add-product",
                icon: "Box", 
                roles: ['ADMIN'],
            },
            {
                title: "Products",
                href: "/admin/dashboard/products-management",
                icon: "Box", 
                roles: ['ADMIN'],
            },
            {
                title: "Orders",
                href: "/admin/dashboard/orders-management",
                icon: "Clock", 
                roles: ['ADMIN'],
            }
        ],
    }
]


export const getNavItemsByRole = (role: UserRole): NavSection[] =>{
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];
        case "CUSTOMER":
            return [...commonNavItems, ...customerNavItems];
        
        default:
            return [];
    }
}


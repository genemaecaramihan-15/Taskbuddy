import { useState } from 'react';
import { Folders, House, UserRound } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: House,
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: Folders,
    },
    {
        title: 'Profile Settings',
        href: '/settings/profile',
        icon: UserRound,
    },
];

export function AppSidebar() {
    const [accountSelected, setAccountSelected] = useState(false);

    return (
        <Sidebar
            collapsible="none"
            variant="sidebar"
            className="min-h-svh border-r border-sidebar-border bg-[#1b174b] bg-[linear-gradient(180deg,#171342_0%,#241b5c_50%,#171342_100%)] text-[#f4f1ff] [--sidebar-foreground:#f4f1ff] [--sidebar-accent:#392786] [--sidebar-accent-foreground:#ffffff] [--sidebar-border:#332967]"
        >
            <SidebarHeader className="bg-transparent">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex h-14 items-center px-2">
                            <AppLogo />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-transparent">
                <NavMain
                    items={mainNavItems}
                    suppressActive={accountSelected}
                    onNavigate={() => setAccountSelected(false)}
                />

                <div className="mt-auto px-5 pb-6 pt-8 text-center" aria-hidden="true">
                    <svg viewBox="0 0 220 190" className="mx-auto h-44 w-full max-w-52" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="108" cy="102" r="76" fill="#4C2BB3" fillOpacity=".24" />
                        <circle cx="169" cy="68" r="37" fill="#7045E8" fillOpacity=".2" />
                        <g transform="rotate(-8 98 98)">
                            <rect x="48" y="37" width="112" height="131" rx="15" fill="#512BC4" />
                            <rect x="57" y="46" width="94" height="113" rx="11" fill="url(#clipboard)" />
                            <rect x="79" y="28" width="50" height="24" rx="9" fill="#7548EF" />
                            <circle cx="104" cy="39" r="5" fill="#24165F" />
                            <path d="m72 83 7 7 12-14M72 111l7 7 12-14M72 139l7 7 12-14" stroke="#DCD3FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M101 84h34M101 112h30M101 140h17" stroke="#24165F" strokeWidth="7" strokeLinecap="round" />
                        </g>
                        <circle cx="157" cy="132" r="38" fill="#27175F" />
                        <circle cx="154" cy="127" r="34" fill="url(#clock)" />
                        <path d="M154 108v21l13 10" stroke="#30206E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="clipboard" x1="65" y1="45" x2="145" y2="162" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#986FFF" />
                                <stop offset="1" stopColor="#6840D8" />
                            </linearGradient>
                            <linearGradient id="clock" x1="132" y1="99" x2="177" y2="160" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#C8B8FF" />
                                <stop offset="1" stopColor="#8058EC" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <p className="mt-3 text-sm font-semibold leading-snug text-[#f4f1ff]">Plan. Organize.<br />Get Things Done.</p>
                </div>
            </SidebarContent>

            <SidebarFooter className="mt-auto border-t border-sidebar-border bg-transparent px-3 py-4">
                <NavUser onOpenChange={(open) => open && setAccountSelected(true)} />
            </SidebarFooter>
        </Sidebar>
    );
}

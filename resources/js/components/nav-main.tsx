import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({
    items,
    suppressActive = false,
    onNavigate,
}: {
    items: NavItem[];
    suppressActive?: boolean;
    onNavigate?: () => void;
}) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-3 py-5">
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={!suppressActive && isCurrentUrl(item.href)}
                            className="h-12 rounded-xl px-3 text-[15px] text-[#f4f1ff] hover:bg-[#392786] hover:text-white data-[active=true]:bg-white data-[active=true]:text-[#241b5c]"
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch onClick={onNavigate}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';

export function NavUser({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const displayName = auth.user?.name ?? 'Gene Mae Caramihan';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu onOpenChange={onOpenChange}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-[#f4f1ff] hover:bg-[#392786] hover:text-white data-[state=open]:bg-white data-[state=open]:text-[#241b5c]"
                            data-test="sidebar-menu-button"
                        >
                            {auth.user ? (
                                <UserInfo user={auth.user} />
                            ) : (
                                <>
                                    <Avatar className="size-8">
                                        <AvatarFallback>GC</AvatarFallback>
                                    </Avatar>
                                    <span className="flex-1 truncate text-left text-sm font-medium">
                                        {displayName}
                                    </span>
                                </>
                            )}
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        <UserMenuContent user={auth.user ?? undefined} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

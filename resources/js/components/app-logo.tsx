import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg shadow-xs">
                <AppLogoIcon className="size-4.5 stroke-primary-foreground" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate leading-none font-bold text-sm text-[#f4f1ff]">
                    TaskBuddy
                </span>
                <span className="truncate text-[10px] text-[#c7c2e8] font-medium mt-0.5">
                    To Do List System
                </span>
            </div>
        </>
    );
}

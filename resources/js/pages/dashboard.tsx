import { useEffect, useRef, useState, type FormEvent, type SVGAttributes } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronRight,
    FolderPlus,
    Moon,
    Search,
    Sun,
} from 'lucide-react';
import { CategoryModal } from '@/components/taskbuddy';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAppearance } from '@/hooks/use-appearance';
import type { Category, DashboardStats } from '@/types';

interface DashboardProps {
    stats: DashboardStats;
    categories: Category[];
    deadline_reminders: {
        id: number;
        title: string;
        due_date: string;
        type: 'due_today' | 'due_tomorrow' | 'overdue';
    }[];
}

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
    Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(undefined, options).format(date);

const parseTaskDate = (value: string) =>
    new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);

function ProgressStatusIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="24" cy="24" r="22" fill="white" stroke="#0878B9" strokeWidth="3" />
            <circle cx="24" cy="24" r="18.5" stroke="#49C5D8" strokeWidth="2" />
            <path d="M12 17h24M12 24h24M12 31h24" stroke="#49C5D8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="18" cy="17" r="3" fill="white" stroke="#49C5D8" strokeWidth="2" />
            <circle cx="25" cy="24" r="3" fill="white" stroke="#49C5D8" strokeWidth="2" />
            <circle cx="31" cy="31" r="3" fill="white" stroke="#49C5D8" strokeWidth="2" />
        </svg>
    );
}

function CompletedStatusIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="24" cy="24" r="21" fill="#10B981" />
            <circle cx="24" cy="24" r="15.5" stroke="white" strokeWidth="2" />
            <path d="m15.5 24.5 5.5 5.5 11.5-12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m10 12 2 1.5m24 0 2-1.5M10 36l2-1.5m24 0 2 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function DueDateStatusIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="5" y="9" width="33" height="32" rx="5" fill="#F8FAFC" stroke="#111827" strokeWidth="3" />
            <path d="M5 18h33" stroke="#111827" strokeWidth="3" />
            <path d="M14 5v8M29 5v8" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
            <path d="M11 23h5v5h-5zM20 23h5v5h-5zM11 32h5v5h-5z" fill="#7DD3FC" stroke="#111827" strokeWidth="1.5" />
            <circle cx="35" cy="34" r="10" fill="#FDE68A" stroke="#111827" strokeWidth="2.5" />
            <path d="M35 28v6l4 2" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function OverdueStatusIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="22" cy="21" r="18" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            <circle cx="22" cy="21" r="13" stroke="#93C5FD" strokeWidth="2" />
            <path d="M22 12v9l6 4" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m34 27 12 19H22l12-19Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M34 33v6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="34" cy="42" r="1.4" fill="white" />
        </svg>
    );
}

function TotalTasksStatusIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="7" y="7" width="34" height="38" rx="4" stroke="#0284C7" strokeWidth="3" />
            <path d="M18 7V5.5A2.5 2.5 0 0 1 20.5 3h7A2.5 2.5 0 0 1 30 5.5V7" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
            <circle cx="15" cy="18" r="4" fill="#0284C7" />
            <path d="m13.5 18 1 1 2-2.5" stroke="#020617" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M23 17h12M23 20h9" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="15" cy="29" r="4" fill="#0284C7" />
            <path d="m13.5 29 1 1 2-2.5" stroke="#020617" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M23 28h12M23 31h9" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="15" cy="40" r="3" fill="#0284C7" />
            <path d="M23 39h12" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

function CompletionRateIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19 4h10l1.5 5.3a16 16 0 0 1 3.4 1.4l5-2.2 6 8.5-3.7 4.1a16 16 0 0 1 0 4.1l3.7 4.1-6 8.5-5-2.2a16 16 0 0 1-3.4 1.4L29 44H19l-1.5-5.3a16 16 0 0 1-3.4-1.4l-5 2.2-6-8.5 3.7-4.1a16 16 0 0 1 0-4.1l-3.7-4.1 6-8.5 5 2.2a16 16 0 0 1 3.4-1.4L19 4Z" fill="#7DD3FC" stroke="#075985" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="24" cy="24" r="11" fill="#F8FAFC" stroke="#075985" strokeWidth="2.5" />
            <path d="m17.5 23.5 5 5 9-10" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CategoryGridIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="4" y="4" width="18" height="18" rx="5" stroke="#22C7D0" strokeWidth="4" />
            <rect x="26" y="4" width="18" height="18" rx="5" stroke="#45A9DF" strokeWidth="4" />
            <rect x="4" y="26" width="18" height="18" rx="5" stroke="#22C7D0" strokeWidth="4" />
            <circle cx="35" cy="35" r="8" stroke="#45A9DF" strokeWidth="4" />
        </svg>
    );
}

function WorkCategoryIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="12" cy="9" r="5" fill="#FED7AA" stroke="#1F2937" strokeWidth="2" />
            <path d="m8 17 9 2 5-2a4 4 0 0 1 2 7l-7 4 2 8a3 3 0 0 1-6 1l-3-7-4 7a3 3 0 0 1-5-3l6-10 1-10Z" fill="#22B6D1" stroke="#1F2937" strokeWidth="2" strokeLinejoin="round" />
            <path d="M30 8h5l1 3 3 1 3-2 3 4-2 3v3l2 2-2 5-4-.5-2 2-1 4h-5l-1-4-3-1-3 2-3-4 2-3v-3l-2-2 2-5 4 .5 2-2 1-3Z" fill="#FDE68A" stroke="#1F2937" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="33" cy="19" r="4" fill="white" stroke="#1F2937" strokeWidth="1.8" />
            <path d="M5 43h39" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 39h7v4H7zM16 36h7v7h-7zM25 33h7v10h-7zM34 30h7v13h-7z" fill="#FB7185" stroke="#1F2937" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

function SchoolCategoryIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4 18 24 3l20 15" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 17h30v26H9z" fill="#FDBA74" stroke="#C2410C" strokeWidth="2" />
            <path d="M5 20h38" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
            <path d="M14 24h5v6h-5zM22 24h5v6h-5zM30 24h5v6h-5zM14 33h5v6h-5zM30 33h5v6h-5z" fill="#FEF3C7" />
            <path d="M21 34h7v9h-7z" fill="#7DD3FC" stroke="#C2410C" strokeWidth="1.5" />
            <circle cx="33" cy="10" r="7" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
            <path d="M33 6v4l3 1" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 44h40" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function PersonalCategoryIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="25" cy="21" r="16" fill="#67D5D5" stroke="#123A78" strokeWidth="3" />
            <circle cx="25" cy="21" r="11" fill="#A5E5E6" stroke="#123A78" strokeWidth="2" />
            <path d="m12 34-7 7a3 3 0 0 1-4-4l7-7" fill="#FDBA74" stroke="#123A78" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 18a6 6 0 0 1 12 0v3a6 6 0 0 1-12 0v-3Z" fill="#FED7AA" stroke="#123A78" strokeWidth="2" />
            <path d="M17 18c0-6 13-8 15 0-2-2-4-3-7-3-2 2-5 3-8 3Z" fill="#F28B62" stroke="#123A78" strokeWidth="2" strokeLinejoin="round" />
            <path d="M17 34c1-5 4-7 8-7s7 2 8 7M22 28l3 3 3-3" stroke="#123A78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function NotificationBellIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M24 5c-2.2 0-4 1.8-4 4v1.2c-6.2 1.8-10 7-10 14v8.2L6 38h36l-4-5.6v-8.2c0-7-3.8-12.2-10-14V9c0-2.2-1.8-4-4-4Z" fill="#08B8E8" />
            <path d="M18 40a6 6 0 0 0 12 0" fill="#08B8E8" />
        </svg>
    );
}

export default function Dashboard({ stats, categories, deadline_reminders }: DashboardProps) {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [search, setSearch] = useState('');
    const searchInput = useRef<HTMLInputElement>(null);
    const { auth } = usePage().props;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const completion = Math.min(stats.completion_rate, 100);
    const darkMode = resolvedAppearance === 'dark';

    useEffect(() => {
        setIsHydrated(true);
        const onShortcut = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                searchInput.current?.focus();
            }
        };

        window.addEventListener('keydown', onShortcut);
        return () => window.removeEventListener('keydown', onShortcut);
    }, []);

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get('/tasks', { search }, { preserveState: true });
    };

    const metricCards = [
        { title: 'Total Tasks', value: stats.total_tasks, icon: TotalTasksStatusIcon, iconSize: 'size-7', href: '/tasks', card: 'border-sky-500/30 from-sky-500/10 to-sky-950/30', iconStyle: 'bg-transparent text-sky-300', glow: 'bg-sky-500/10', detail: 'across all categories' },
        { title: 'To Do', value: stats.pending_tasks, icon: AppLogoIcon, iconSize: 'size-7', href: '/tasks?status=to_do', card: 'border-amber-500/30 from-amber-500/10 to-amber-950/30', iconStyle: 'bg-transparent text-amber-300', glow: 'bg-amber-500/10', detail: 'ready to get started' },
        { title: 'Completed', value: stats.completed_tasks, icon: CompletedStatusIcon, iconSize: 'size-7', href: '/tasks?status=completed', card: 'border-emerald-500/30 from-emerald-500/10 to-emerald-950/30', iconStyle: 'bg-transparent text-emerald-300', glow: 'bg-emerald-500/10', detail: 'finished tasks' },
        { title: 'Due Today', value: stats.due_today_tasks, icon: DueDateStatusIcon, iconSize: 'size-7', href: '/tasks?due_date=today', card: 'border-violet-500/30 from-violet-500/10 to-violet-950/30', iconStyle: 'bg-transparent text-violet-300', glow: 'bg-violet-500/10', detail: 'deadlines for today' },
        { title: 'Overdue', value: stats.overdue_tasks, icon: OverdueStatusIcon, iconSize: 'size-7', href: '/tasks?due_date=overdue', card: 'border-rose-500/30 from-rose-500/10 to-rose-950/30', iconStyle: 'bg-transparent text-rose-300', glow: 'bg-rose-500/10', detail: 'past their deadline' },
    ];
    const categoryIcons = [WorkCategoryIcon, SchoolCategoryIcon, PersonalCategoryIcon];
    const categoryTones = [
        'bg-sky-500/20 text-sky-300',
        'bg-violet-500/20 text-violet-300',
        'bg-emerald-500/20 text-emerald-300',
    ];

    return <>
        <Head title="Dashboard" />
        <div className="min-h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-950/25 via-background to-background">
            <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-xl md:px-8">
                <div className="flex items-center justify-between gap-3">
                    <form onSubmit={submitSearch} className="relative w-full max-w-xl">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input ref={searchInput} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." className="h-11 border-border/80 bg-card/80 pl-10 pr-20 text-sm shadow-sm" aria-label="Search tasks" />
                    </form>
                    <div className="flex shrink-0 items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="relative size-10" aria-label={`Notifications${deadline_reminders.length ? `, ${deadline_reminders.length} deadline reminders` : ', no deadline reminders'}`}>
                                    <NotificationBellIcon className="size-5" />
                                    {deadline_reminders.length > 0 && <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold leading-none text-white">{deadline_reminders.length > 9 ? '9+' : deadline_reminders.length}</span>}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96">
                                <div className="border-b border-border px-4 py-3">
                                    <h2 className="font-semibold">Notifications</h2>
                                    <p className="mt-0.5 text-xs text-muted-foreground">{deadline_reminders.length === 0 ? 'You have no deadline reminders.' : `${deadline_reminders.length} deadline ${deadline_reminders.length === 1 ? 'reminder' : 'reminders'}`}</p>
                                </div>
                                {deadline_reminders.length > 0 ? <ul className="max-h-80 divide-y divide-border overflow-y-auto">{deadline_reminders.map((reminder) => <li key={reminder.id} className="flex items-start justify-between gap-3 px-4 py-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{reminder.title}</p><p className="mt-1 text-xs text-muted-foreground">{reminder.type === 'overdue' ? 'This task is overdue' : reminder.type === 'due_today' ? 'This task is due today' : 'This task is due tomorrow'}</p></div><time className={`shrink-0 text-xs font-semibold ${reminder.type === 'overdue' ? 'text-rose-400' : reminder.type === 'due_today' ? 'text-orange-400' : 'text-amber-400'}`}>{parseTaskDate(reminder.due_date).toLocaleDateString()}</time></li>)}</ul> : <p className="px-4 py-5 text-center text-sm text-muted-foreground">You’re all caught up.</p>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button onClick={() => setIsCategoryModalOpen(true)} className="h-10 gap-2 bg-blue-600 px-4 text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500">
                            <FolderPlus className="size-4" /><span className="hidden sm:inline">New Category</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="hidden size-10 sm:inline-flex" aria-label="Toggle theme" onClick={() => updateAppearance(darkMode ? 'light' : 'dark')}>
                            {isHydrated && darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-[1700px] flex-col gap-5 p-4 md:gap-6 md:p-8">
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{isHydrated ? greeting : 'Hello'}, {auth.user?.name ?? 'Gene Mae Caramihan'}! <span aria-hidden="true">👋</span></h1>
                        <p className="mt-1 text-sm text-muted-foreground md:text-base">Here’s an overview of your productivity and upcoming tasks.</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <CalendarDays className="size-5 text-blue-400" />
                        <div><p className="font-medium">{isHydrated ? formatDate(now, { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</p><p className="text-muted-foreground">{isHydrated ? formatDate(now, { weekday: 'long' }) : ''}</p></div>
                    </div>
                </section>

                <section aria-label="Task overview" className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
                    {metricCards.map(({ title, value, icon: Icon, iconSize = 'size-5', href, card, iconStyle, glow, detail }) => (
                        <Link key={title} href={href} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <Card className={`relative min-h-44 overflow-hidden border bg-gradient-to-br ${card} via-card p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg sm:p-5`}>
                            <div className={`mb-3 flex size-11 items-center justify-center rounded-xl ${iconStyle}`}><Icon className={iconSize} /></div>
                            <p className="text-sm text-muted-foreground">{title}</p>
                            <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
                            <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
                            <div className={`pointer-events-none absolute -bottom-12 -right-5 size-28 rounded-full ${glow} blur-2xl`} />
                        </Card>
                        </Link>
                    ))}
                </section>

                <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <Card className="min-h-56 border-border/80 bg-card/70 p-5 sm:p-6">
                        <div className="mb-5 flex items-center justify-between"><Link href="/tasks?status=completed" className="flex items-center gap-2 text-base font-semibold hover:text-sky-300"><CompletionRateIcon className="size-5" />Task Completion Rate</Link><span className="text-xs text-muted-foreground">All time</span></div>
                        <div className="flex items-center justify-center gap-6 sm:justify-start sm:gap-8">
                            <div className="grid size-32 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(#3b82f6 ${completion * 3.6}deg, rgb(51 65 85 / 0.7) 0deg)` }}>
                                <div className="grid size-28 place-content-center rounded-full bg-card text-center"><span className="text-2xl font-bold">{completion}%</span><span className="mt-1 text-[10px] text-muted-foreground">{stats.completed_tasks} of {stats.total_tasks} tasks done</span></div>
                            </div>
                            <p className="max-w-52 text-sm leading-relaxed text-muted-foreground">{stats.completion_rate >= 80 ? 'Outstanding productivity! You are staying right on track.' : 'Keep going! Complete a task to build momentum.'}</p>
                        </div>
                    </Card>

                    <Card className="min-h-56 border-border/80 bg-card/70 p-5 sm:p-6">
                        <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-base font-semibold"><CategoryGridIcon className="size-5" />Categories</h2><Link href="/categories" className="text-sm font-medium text-sky-400 hover:text-sky-300">View All</Link></div>
                        {categories.length === 0 ? <p className="py-6 text-sm text-muted-foreground">No categories yet. Create one to organize your tasks.</p> : <div className="space-y-1">{categories.slice(0, 3).map((category, index) => { const CategoryIcon = categoryIcons[index % categoryIcons.length]; const tone = categoryTones[index % categoryTones.length]; return <Link key={category.id} href={`/tasks?category_id=${category.id}`} className="flex items-center gap-3 border-b border-border/60 py-2 last:border-0 hover:text-sky-300"><span className={`grid size-9 place-items-center rounded-xl ${tone}`}><CategoryIcon className="size-4" /></span><span className="flex-1 truncate text-sm">{category.name}</span><span className="text-xs text-muted-foreground">{category.tasks_count ?? 0}</span><ChevronRight className="size-4 text-muted-foreground" /></Link>; })}</div>}
                    </Card>
                </section>

            </main>
        </div>
        <CategoryModal open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen} />
    </>;
}

Dashboard.layout = { breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }] };

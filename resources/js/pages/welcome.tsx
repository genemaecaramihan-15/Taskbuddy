import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types';

export default function Welcome() {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const user = auth?.user;

    return (
        <>
            <Head title="TaskBuddy - Modern Unified Task Management" />

            <div className="min-h-screen bg-linear-to-b from-background via-background/95 to-muted/30 text-foreground">
                {/* Navigation Header */}
                <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                <AppLogoIcon className="size-5 stroke-primary-foreground" />
                            </div>
                            <div>
                                <span className="font-bold text-lg tracking-tight">TaskBuddy</span>
                            </div>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <Button asChild size="sm" className="gap-2">
                                    <Link href="/dashboard">
                                        Open Dashboard
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href="/login">Log In</Link>
                                    </Button>
                                    <Button asChild size="sm" className="shadow-xs">
                                        <Link href="/register">Get Started</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute left-1/2 top-1/3 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
                    </div>
                    <section className="relative mx-auto w-full max-w-5xl -translate-y-10 text-center">
                        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Master your tasks,{' '}
                            <span className="bg-linear-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                                amplify your focus.
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                            Stay organized, manage your tasks, and keep every deadline in view with TaskBuddy, your partner for getting things done.
                        </p>
                    </section>
                </main>

            </div>
        </>
    );
}

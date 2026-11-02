import { Form, Head, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Camera, Mail, Save, UserRound } from 'lucide-react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile() {
    const { auth } = usePage<PageProps>().props;
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const photoInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name, Gmail address, and profile picture"
                />

                <Form
                    action="/settings/profile"
                    method="put"
                    onSuccess={() => router.reload({ only: ['auth'] })}
                    options={{
                        preserveScroll: true,
                    }}
                    className="mx-auto w-full max-w-5xl rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
                            <div className="mb-0 flex flex-col items-center text-center">
                                <div className="relative">
                                    <Avatar className="h-36 w-36 border-4 border-violet-100 bg-violet-600 shadow-md dark:border-violet-300/20">
                                        <AvatarImage src={photoPreview ?? auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="bg-violet-600 text-white">
                                            <UserRound className="h-20 w-20" strokeWidth={1.5} />
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        type="button"
                                        onClick={() => photoInput.current?.click()}
                                        className="absolute bottom-1 right-1 grid h-11 w-11 place-items-center rounded-full border-4 border-card bg-white text-violet-700 shadow-md transition hover:bg-violet-50"
                                        aria-label="Choose profile picture"
                                    >
                                        <Camera className="h-5 w-5" />
                                    </button>
                                </div>
                                <h2 className="mt-4 text-lg font-semibold">Profile Picture</h2>
                                <p className="mt-1 text-sm text-muted-foreground">JPG, PNG, or WebP. Maximum size: 2 MB.</p>
                                <input
                                    ref={photoInput}
                                    id="profile_photo"
                                    name="profile_photo"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="sr-only"
                                    onChange={(event) => {
                                        const file = event.currentTarget.files?.[0];
                                        setPhotoPreview(file ? URL.createObjectURL(file) : null);
                                    }}
                                />
                                <InputError message={errors.profile_photo} />
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-4">
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300"><UserRound className="h-6 w-6" /></div>
                                    <div className="grid gap-2"><Label htmlFor="first_name">First Name</Label><Input id="first_name" className="h-12" defaultValue={auth.user.first_name ?? ''} name="first_name" required autoComplete="given-name" placeholder="Enter your first name" /><InputError message={errors.first_name} /></div>
                                </div>
                                <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-4">
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300"><UserRound className="h-6 w-6" /></div>
                                    <div className="grid gap-2"><Label htmlFor="middle_name">Middle Name</Label><Input id="middle_name" className="h-12" defaultValue={auth.user.middle_name ?? ''} name="middle_name" required autoComplete="additional-name" placeholder="Enter your middle name" /><InputError message={errors.middle_name} /></div>
                                </div>
                                <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-4">
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300"><UserRound className="h-6 w-6" /></div>
                                    <div className="grid gap-2"><Label htmlFor="last_name">Last Name</Label><Input id="last_name" className="h-12" defaultValue={auth.user.last_name ?? ''} name="last_name" required autoComplete="family-name" placeholder="Enter your last name" /><InputError message={errors.last_name} /></div>
                                </div>
                                <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-4">
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300"><Mail className="h-6 w-6" /></div>
                                    <div className="grid gap-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" className="h-12" defaultValue={auth.user.email} name="email" required autoComplete="username" placeholder="Email address" /><InputError message={errors.email} /></div>
                                </div>
                            <Button disabled={processing} data-test="update-profile-button" className="mt-8 h-12 w-full bg-violet-600 text-base text-white shadow-md hover:bg-violet-700">
                                <Save className="mr-2 h-5 w-5" />
                                Save Changes
                            </Button>
                            </div>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: '/settings/profile',
        },
    ],
};

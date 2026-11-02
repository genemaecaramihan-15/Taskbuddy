import { Form, Head } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    status?: string;
    verified?: boolean;
};

export default function VerifyEmail({ status, verified = false }: Props) {
    return (
        <>
            <Head title="Verify your Gmail" />
            <div className="flex flex-col items-center gap-5 text-center">
                <div className="grid size-14 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <MailCheck className="size-7" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Verify your Gmail address</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                        We sent a verification link to the Gmail address you registered. Open that email and verify your address before continuing to TaskBuddy.
                    </p>
                </div>

                {verified && <p className="text-sm font-medium text-emerald-600">Your Gmail address is verified. You can continue using TaskBuddy.</p>}
                {status === 'verification-link-sent' && <p className="text-sm font-medium text-emerald-600">A fresh verification link has been sent to your registered Gmail.</p>}

                <Form action="/email/verification-notification" method="post" className="w-full">
                    {({ processing }) => (
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <Spinner />}
                            Resend verification email
                        </Button>
                    )}
                </Form>

                <p className="text-xs text-muted-foreground">Check your spam folder if you don&apos;t see the email.</p>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'One last step',
    description: 'Confirm your Gmail to protect your account and receive task reminders.',
    backHref: '/login',
};

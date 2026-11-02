import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    title = '',
    description = '',
    backHref = '/',
    children,
}: {
    title?: string;
    description?: string;
    backHref?: string;
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description} backHref={backHref}>
            {children}
        </AuthLayoutTemplate>
    );
}

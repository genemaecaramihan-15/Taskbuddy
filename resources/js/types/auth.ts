export type User = {
    id: number;
    name: string;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    email: string;
    phone_number: string | null;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

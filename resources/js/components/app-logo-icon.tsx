import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="taskbuddy-logo-bg" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38BDF8" />
                    <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
            </defs>
            <rect x="1" y="1" width="46" height="46" rx="14" fill="url(#taskbuddy-logo-bg)" />
            <path d="M12 13.5a3.5 3.5 0 0 1 3.5-3.5h18a3.5 3.5 0 0 1 3.5 3.5v25a3.5 3.5 0 0 1-3.5 3.5h-18a3.5 3.5 0 0 1-3.5-3.5v-25Z" fill="white" stroke="#102A61" strokeWidth="2.5" />
            <path d="M19 11V9.5A3.5 3.5 0 0 1 22.5 6h5A3.5 3.5 0 0 1 31 9.5V11" fill="#DBEAFE" stroke="#102A61" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M17 21.5 19 23.5l3.5-4M25.5 22h7M17 29 19 31l3.5-4M25.5 29.5h7M17 36.5l2 2 3.5-4M25.5 37h5" stroke="#1674E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m34 17 4.5-4.5 4 4L38 21l-5.5 2 1.5-6Z" fill="#FBBF24" stroke="#102A61" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="m34 17 4 4" stroke="#102A61" strokeWidth="1.5" />
        </svg>
    );
}

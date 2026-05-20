 // Shared TypeScript interfaces used across components

export interface Spot {
    id: number;
    name: string;
    location: string;
    description: string;
    badge: string;
}

export interface Feature {
    id: number;
    title: string;
    description: string;
}
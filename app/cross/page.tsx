import type { Metadata } from "next";
import MiniCrosswordApp from "@/components/MiniCrosswordApp";

export const metadata: Metadata = {
    title: "Crossword",
    robots: { index: false, follow: false },
};

export default function CrossPage() {
    return (
        <main className="min-h-[calc(100vh-4rem)] py-6">
            <MiniCrosswordApp />
        </main>
    );
}

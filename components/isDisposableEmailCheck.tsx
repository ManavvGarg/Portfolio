/**
 * Interface for email validation response
 */
// In isDisposableEmailCheck.tsx
export interface EmailValidationResult {
    isDisposable: boolean;
    didYouMean: string | null;
    result: string;
    reason: string | null;
    success: boolean;
}

/**
 * Checks if an email is from a disposable email provider using our own API route
 * which then calls Kickbox API server-side
 */
export default async function isDisposableEmail(
    email: string,
): Promise<EmailValidationResult> {
    try {
        // Call our own API route instead of Kickbox directly
        const response = await fetch("/api/check-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            console.error(
                `API error: ${response.status} ${response.statusText}`,
            );
            return {
                isDisposable: false,
                didYouMean: null,
                result: "unknown",
                reason: null,
                success: false,
            };
        }

        const data = await response.json();

        return {
            isDisposable: data.disposable === true,
            didYouMean: data.did_you_mean || null,
            result: data.result || "unknown",
            reason: data.reason || null,
            success: data.success === true,
        };
    } catch (error) {
        console.error("Error checking disposable email:", error);
        return {
            isDisposable: false,
            didYouMean: null,
            result: "error",
            reason: null,
            success: false,
        };
    }
}

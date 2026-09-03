// src/utils/get-error-message.ts

/**
 * Parses any error object or string into a clean, user-friendly error message.
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage = "An unexpected error occurred. Please try again.",
): string {
  if (!error) return fallbackMessage;

  let rawMessage = "";

  if (typeof error === "string") {
    rawMessage = error;
  } else if (error instanceof Error) {
    rawMessage = error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    rawMessage = (error as { message: string }).message;
  } else {
    return fallbackMessage;
  }

  // Map database & common technical errors to user-friendly messages
  if (
    rawMessage.includes("P2002") ||
    rawMessage.includes("Unique constraint")
  ) {
    return "This item already exists in the system.";
  }
  if (
    rawMessage.includes("P2025") ||
    rawMessage.includes("Record to update not found")
  ) {
    return "The requested record could not be found.";
  }
  if (
    rawMessage.includes("Failed to fetch") ||
    rawMessage.includes("NetworkError")
  ) {
    return "Unable to reach the server. Please check your internet connection.";
  }
  if (rawMessage.includes("Unauthorized") || rawMessage.includes("Forbidden")) {
    return "You do not have permission to perform this action.";
  }

  return rawMessage || fallbackMessage;
}

// Common error messages
export const errorMessages = {
  AUTHENTICATION_REQUIRED: "You must be signed in to perform this action",
  VALIDATION_FAILED: "Please check your input and try again",
  RATE_LIMIT_EXCEEDED: "Too many requests. Please try again later",
  FILE_TOO_LARGE: "File size is too large",
  INVALID_FILE_TYPE: "File type is not supported",
  BUSINESS_NOT_FOUND: "Business not found",
  DUPLICATE_REVIEW: "You have already reviewed this business",
  DUPLICATE_BUSINESS: "A business is already registered for this account",
  SERVER_ERROR: "An unexpected error occurred. Please try again",
};

// Create a standardized error response
export function createErrorResponse<T = unknown>(
  error: string,
  details?: T
): { success: false; error: string; details?: T } {
  return {
    success: false as const,
    error,
    details: process.env.NODE_ENV === "development" ? details : undefined,
  };
}

// Create a standardized success response
export function createSuccessResponse<T = unknown>(
  message: string,
  data?: T
): { success: true; message: string; data?: T } {
  return {
    success: true as const,
    message,
    data,
  };
}

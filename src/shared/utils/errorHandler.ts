import { AppError } from '../errors/AppError';

export function handleError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Si è verificato un errore sconosciuto. Riprova.';
}

export function logError(error: unknown, context?: string): void {
  const message = handleError(error);
  const logMessage = context ? `[${context}] ${message}` : message;
  console.error(logMessage, error);
}


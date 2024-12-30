export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export function handleSupabaseError(error: any): never {
  if (error.code === 'auth/invalid-email') {
    throw new SupabaseError('Invalid email address', error.code);
  }
  if (error.code === 'auth/wrong-password') {
    throw new SupabaseError('Incorrect password', error.code);
  }
  throw new SupabaseError(
    error.message || 'An unexpected error occurred',
    error.code,
    error.details
  );
}
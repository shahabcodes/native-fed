export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export type ErrorCategory = 'network' | 'validation' | 'auth' | 'business' | 'system' | 'remote_module';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: Date;
  correlationId: string;
  originalError?: unknown;
  context?: Record<string, unknown>;
}

export class AppException extends Error {
  readonly code: string;
  readonly userMessage: string;
  readonly severity: ErrorSeverity;
  readonly category: ErrorCategory;
  readonly timestamp: Date;
  readonly correlationId: string;
  readonly originalError?: unknown;
  readonly context?: Record<string, unknown>;

  constructor(params: {
    code: string;
    message: string;
    userMessage?: string;
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    correlationId?: string;
    originalError?: unknown;
    context?: Record<string, unknown>;
  }) {
    super(params.message);
    this.name = 'AppException';
    this.code = params.code;
    this.userMessage = params.userMessage || params.message;
    this.severity = params.severity || 'error';
    this.category = params.category || 'system';
    this.timestamp = new Date();
    this.correlationId = params.correlationId || this.generateCorrelationId();
    this.originalError = params.originalError;
    this.context = params.context;

    // Ensure proper stack trace
    Object.setPrototypeOf(this, AppException.prototype);
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  toAppError(): AppError {
    return {
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      severity: this.severity,
      category: this.category,
      timestamp: this.timestamp,
      correlationId: this.correlationId,
      originalError: this.originalError,
      context: this.context
    };
  }
}

export function createAppError(params: {
  code: string;
  message: string;
  userMessage?: string;
  severity?: ErrorSeverity;
  category?: ErrorCategory;
  correlationId?: string;
  originalError?: unknown;
  context?: Record<string, unknown>;
}): AppError {
  return {
    code: params.code,
    message: params.message,
    userMessage: params.userMessage || params.message,
    severity: params.severity || 'error',
    category: params.category || 'system',
    timestamp: new Date(),
    correlationId: params.correlationId || `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    originalError: params.originalError,
    context: params.context
  };
}

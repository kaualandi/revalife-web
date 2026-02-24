interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorMessage({
  title = 'Erro',
  message,
  onRetry,
  retryLabel = 'Tentar novamente',
}: ErrorMessageProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="text-center">
        <p className="text-destructive mb-2 text-lg font-medium">{title}</p>
        <p className="text-muted-foreground mb-4 text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-primary font-medium hover:underline"
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}

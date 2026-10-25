import { Component, type ErrorInfo, type ReactNode } from 'react';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import Container from '@/components/ui/container';
import Logo from '@/components/ui/logo';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground antialiased">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_30%,#000_55%,transparent_100%)] bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:56px_56px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]" />
            <div className="absolute -top-24 left-[8%] h-72 w-72 rounded-full bg-destructive/[0.06] blur-[120px] dark:bg-destructive/[0.10]" />
          </div>

          <header className="relative z-10 px-5 py-6 sm:py-8">
            <Container>
              <Logo size="md" />
            </Container>
          </header>

          <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5">
            <Container>
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-destructive">
                  <IconAlertTriangle className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Something went wrong
                </h1>
                <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
                  We're sorry for the inconvenience. The application encountered
                  an unexpected error.
                </p>
                {this.state.error && (
                  <pre className="mt-6 max-h-40 overflow-auto rounded-lg border border-border bg-muted/50 px-4 py-3 text-left text-xs text-muted-foreground">
                    {this.state.error.message}
                  </pre>
                )}
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={this.handleReset}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-6 py-3.5 text-[15px] font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    <IconRefresh className="h-4 w-4" strokeWidth={1.75} />
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm shadow-teal-600/20 transition-all hover:bg-teal-500 dark:bg-teal-300 dark:text-zinc-950 dark:shadow-teal-300/20 dark:hover:bg-teal-200"
                  >
                    Reload page
                  </button>
                </div>
              </div>
            </Container>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 ${className}`}
    >
      {children}
    </main>
  );
}

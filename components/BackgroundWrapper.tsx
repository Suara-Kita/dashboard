export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 z-0">{children}</div>;
}

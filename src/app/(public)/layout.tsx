export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto max-w-lg px-8">{children}</div>;
}

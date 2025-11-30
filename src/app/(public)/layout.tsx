export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="mx-auto max-w-lg">{children}</main>;
}

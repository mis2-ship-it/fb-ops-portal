import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frozen Bottle Operations Hub',
  description: 'Store Performance, Customer Feedback & Operational Intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#070b14', color: '#f1f5f9' }}>
        {children}
      </body>
    </html>
  );
}

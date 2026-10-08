import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frozen Bottle Operations Hub',
  description: 'Multi-Channel Store Operations & Ratings Intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0b0f17', color: '#f3f4f6' }}>
        {children}
      </body>
    </html>
  );
}

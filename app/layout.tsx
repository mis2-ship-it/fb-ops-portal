import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frozen Bottle Operations Hub',
  description: 'Store Operations & Ratings Intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a', color: '#ededed' }}>
        {children}
      </body>
    </html>
  );
}

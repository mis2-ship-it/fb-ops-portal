import type { Metadata } from 'next';

export const metadata = {
  title: 'Frozen Bottle Operations Hub',
  description: 'Operations & Ratings Intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#090d16', color: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}

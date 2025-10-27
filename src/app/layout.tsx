import type { Metadata } from 'next';
import './globals.css';
import Content from './content';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';

export const metadata: Metadata = {
  title: 'Litera.id',
  description: 'Perpustakaan daring untuk mempermudah pustakawan.',
  icons: {
    icon: '/app-icon.ico',
  },
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body style={{ fontFamily: 'Inter, sans-serif' }}>
        <Content children={children} />
      </body>
    </html>
  );
}

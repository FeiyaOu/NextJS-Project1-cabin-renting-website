import Header from './_components/Header';
import ClientLayout from './_components/ReservationClientWrapper';
import { ReservationProvider } from './_components/ReservationContext';
import './_styles/globals.css';

import { Josefin_Sans } from 'next/font/google';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: {
    template: '%s | The Wild Oasis',
    default: 'Welcome/The Wild Oasis',
  },
  description: 'Luxury cabins in the heart of nature',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`bg-primary-950 flex flex-col text-primary-100 min-h-screen ${josefin.className}`}
      >
        <Header />

        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl max-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}

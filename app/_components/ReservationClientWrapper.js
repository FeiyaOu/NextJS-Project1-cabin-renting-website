'use client';
import { ReservationProvider } from './ReservationContext';

export default function ClientLayout({ children }) {
  return <ReservationProvider>{children}</ReservationProvider>;
}

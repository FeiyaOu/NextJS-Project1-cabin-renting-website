'use client';

import { differenceInDays, isPast, isSameDay, isWithinInterval } from 'date-fns';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useReservation } from './ReservationContext';

function isAlreadyBooked(range, datesArr) {
  return (
    range.from &&
    range.to &&
    datesArr.some((date) => isWithinInterval(date, { start: range.from, end: range.to }))
  );
}

function DateSelector({ settings, cabin, bookedDates }) {
  const { range, setRange, resetRange } = useReservation();
  const displayRange=isAlreadyBooked(range,bookedDates)?{}:range;
  

  // const [range,setRange]=useState({ from: undefined, to: undefined });
  // CHANGE
  // const regularPrice = 23;
  // const discount = 23;
  const { regularPrice, discount } = cabin;

  // compute nights only when we have both dates to avoid NaN
  const hasDisplayRange = displayRange && displayRange.from && displayRange.to;
  const numNights = hasDisplayRange ? Math.max(0, differenceInDays(displayRange.to, displayRange.from)) : 0;

  // if you want to count inclusive nights (same-day => 1), use: numNights = hasRange ? Math.max(0, differenceInDays(range.to, range.from) || 0) + 1 : 0

  const cabinPrice = numNights * (regularPrice - discount || 0);

  
  // SETTINGS
  // const minBookingLength = 1;
  // const maxBookingLength = 23;
  const {minBookingLength,maxBookingLength}=settings;



  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={(range) => setRange(range)}
        selected={displayRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
         disabled={(curDate)=>isPast(curDate)||bookedDates.some((date)=>isSameDay(date,curDate))}
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">${regularPrice}</span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{' '}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range.from || range.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={() => resetRange()}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;

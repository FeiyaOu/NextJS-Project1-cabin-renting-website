"use client"

import { useOptimistic, useTransition } from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'
import SpinnerMini from './SpinnerMini'
import { deleteBooking } from '../_lib/actions'

export default function DeleteReservationButton({ bookingId }) {
  const [isDeleted, addOptimistic] = useOptimistic(false, (_, next) => next)
  const [isPending, startTransition] = useTransition()

  async function handleDelete(e) {
    if (!confirm('Are you sure to delete the booking?')) return

    // Optimistically mark deleted and hide the closest reservation card element
    addOptimistic(true)
    const el = e.currentTarget.closest('[data-reservation-card]')
    const prevDisplay = el?.style?.display
    if (el) el.style.display = 'none'

    startTransition(async () => {
      try {
        await deleteBooking(bookingId)
      } catch (err) {
        console.error('delete failed', err)
        // revert optimistic change
        addOptimistic(false)
        if (el) el.style.display = prevDisplay || ''
      }
    })
  }

  // When isDeleted is true we already hid the element; render a no-op button to keep UI stable
  return (
    <button
      onClick={handleDelete}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
      disabled={isPending}
    >
      {!isPending ? (
        <>
          <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
          <span className="mt-1">Delete</span>
        </>
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </button>
  )
}

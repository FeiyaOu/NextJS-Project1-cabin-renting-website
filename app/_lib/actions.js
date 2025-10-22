'use server';

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { getBookings, updateGuest } from './data-service';
import { supabase } from './supabase';
import { redirect } from 'next/navigation';


export async function createBooking(bookingData,formData){
 const session = await auth();
  if (!session) throw new Error('You must log in to update reservation.');

 const newBooking={
  ...bookingData,
  guestId:session.user.guestId,
  numGuests:formData.get("numGuests"),
  observations:formData.get("observations"),
  extraPrice:0,
  totalPrice:bookingData.cabinPrice,
  isPaid:false,
  hasBreakfast:false,
  status:"unconfirmed"
 }
  console.log('createBooking payload', newBooking);

   const {  error } = await supabase
     .from('bookings')
     .insert([newBooking])
    

  if (error) {
    console.error('supabase insert error', error);
    throw new Error(error.message || 'Booking could not be created');
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`)
  redirect("/cabins/thankyou")



}


export async function updateBooking(formData){
  const session = await auth();
  if (!session) throw new Error('You must log in to update reservation.');
  


  const id=formData.get("id")
  const numGuests=Number(formData.get("numGuests"))
  const observations=formData.get("observations").slice(0,1000)
  console.log(id,numGuests,observations)

  // const guestBookings = await getBookings(session.user.guestId);
  // const guestBookingIds = guestBookings.map((booking) => booking.id);

  // if (!guestBookingIds.includes(id))
  //   throw new Error('You are not allowed to update this booking.');

  const updateData={numGuests,observations}

  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id)
   

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }

   revalidatePath(`/account/reservation`);
   redirect(`/account/reservation`)
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error('You must log in to update profile.');

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error('You are not allowed to delete this booking.');

  const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }

  revalidatePath('/account/reservation');
}

export async function updateProfile(formData) {
  const session = await auth();
  if (!session) throw new Error('You must log in to update profile.');
  // read the nationalId robustly: form field names are case-sensitive, and
  // some builds or templates may accidentally use "nationalID" (capital D).
  // Try both and normalize to a trimmed string before validating.
  let nationalIdRaw = formData.get('nationalId');
  if (nationalIdRaw == null) nationalIdRaw = formData.get('nationalID');
  const nationalId = String(nationalIdRaw ?? '').trim();

  const x = formData.get('nationality') ?? '';
  const [nationality = '', countryFlag = ''] = String(x).split('%');

  const nationalIdRegex = /^[A-Za-z0-9]{6,12}$/;

  function validateNationalId(id) {
    return nationalIdRegex.test(id);
  }

  if (!validateNationalId(nationalId)) throw new Error('Please provide a valid nationalId');

  const updateData = { nationality, nationalId, countryFlag };
  if (!session?.user?.guestId) {
    console.error('updateProfile: missing session.user.guestId', { session });
    throw new Error('Unable to identify guest.');
  }

  let updatedResult;
  try {
    updatedResult = await updateGuest(session.user.guestId, updateData);
  } catch (err) {
    // Re-throw with additional context so logs show the real cause
    console.error('updateProfile.updateGuest failed', {
      guestId: session.user.guestId,
      updateData,
      err,
    });
    throw err;
  }
  revalidatePath('/account/profile');
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

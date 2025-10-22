import { auth } from '../_lib/auth';

export const metadata = {
  title: 'Guest area',
};

const session = await auth();
export default function Page() {
  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">welcome,{session?.user?.name}</h2>
  );
}

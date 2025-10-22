import CabinCard from './CabinCard';
import { getCabins } from '@/app/_lib/data-service';
import { unstable_noStore as noStore } from 'next/cache';

async function CabinList({ filter }) {
  noStore();

  const cabins = await getCabins();
  let displayedCabins;
  if (filter === 'all') {
    displayedCabins = cabins;
  }

  if (filter === 'small') {
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 2);
  }
  if (filter === 'medium') {
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity > 2 && cabin.maxCapacity <= 4);
  }
  if (filter === 'large') {
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity > 4);
  }

  if (!cabins.length) return null;
  if (!displayedCabins.length)
    return <p className="text-lg">No cabins found for the selected filter</p>;
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
export default CabinList;

'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Button from './Button';

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams?.get('capacity') ?? 'all';

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set('capacity', filter);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="border border-primary-300 flex justify-end mb-20">
      <Button handleFilter={handleFilter} filter="all" active={activeFilter}>
        All
      </Button>
      <Button handleFilter={handleFilter} filter="small" active={activeFilter}>
        1-2 people
      </Button>
      <Button handleFilter={handleFilter} filter="medium" active={activeFilter}>
        3-4 people
      </Button>
      <Button handleFilter={handleFilter} filter="large" active={activeFilter}>
        5 more people
      </Button>
    </div>
  );
}

export default Filter;

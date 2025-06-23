'use client'
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Shoes from "../../../components/shoes/Shoes";

export default function ShoesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (!params.has('page') && !hasAnyFilters(params)) {
      params.set('page', '1');
      router.replace(`/shoes?${params.toString()}`, { scroll: false });
    }
  }, []);

  const hasAnyFilters = (params) => {
    const filterParams = [
      'search', 'typeOfShoes', 'gender', 'color',
      'size', 'minPrice', 'maxPrice', 'availability'
    ];
    return filterParams.some(param => params.has(param));
  };

  return (
    <>
      <Shoes />
    </>
  );
}

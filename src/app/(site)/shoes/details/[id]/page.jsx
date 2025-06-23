'use client'
import React from 'react';
import ShoesDetails from "../../../../components/shoes/ShoesDetails";
import { useParams } from 'next/navigation';

export default function ShoeDetails() {
    const params = useParams();
    return <ShoesDetails productId={params.id} productName={params.name} />;
}

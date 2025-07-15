'use client'
import React from 'react';

import { useParams } from 'next/navigation';
import ShoesDetails from '../../../../../components/shoes/ShoesDetails';

export default function ShoeDetails() {
    const params = useParams();
    return <ShoesDetails productId={params.id} productName={params.name} />;
}

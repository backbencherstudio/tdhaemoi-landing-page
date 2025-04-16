import React from 'react';
import ShoesDetails from "@/components/shoes/ShoesDetails";

export default function ShoeDetails({ params, searchParams }) {
    const unwrappedParams = React.use(params);
    const { id } = unwrappedParams;
    const name = searchParams?.name;

    if (!id) {
        return <div>Loading...</div>;
    }

    return <ShoesDetails params={{ id, name }} />;
}
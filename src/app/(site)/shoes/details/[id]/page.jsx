
import React from 'react';
import ShoesDetails from "@/components/shoes/ShoesDetails";

export default function ShoeDetails({ params }) {
    const unwrappedParams = React.use(params);
    const { id } = unwrappedParams;

    if (!id) {
        return <div>Loading...</div>;
    }

    return <ShoesDetails params={{ id }} />;
}
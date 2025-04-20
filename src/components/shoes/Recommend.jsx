import ProductCard from '../shared/ProductCard';

export default function RecommendShoes({ recommendedProducts }) {
    if (!recommendedProducts || recommendedProducts.length === 0) {
        return null;
    }

    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Diese Modelle empfehlen wir dir auch:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((shoe) => (
                    <ProductCard key={shoe.id} shoe={shoe} />
                ))}
            </div>
        </>
    );
}

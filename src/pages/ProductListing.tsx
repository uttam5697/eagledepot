import React from "react";
// import Header from "../components/Header";
import ProductGrid from "../components/ProductGrid";
import { useParams } from "react-router-dom";

const ProductListing: React.FC = () => {
    const { id } = useParams<{ id: string | undefined }>();
    return (
        <div >
            <ProductGrid categoryId={id} />
        </div>
    )
}

export default ProductListing;
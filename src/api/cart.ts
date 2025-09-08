import { useQuery } from "@tanstack/react-query";
import { getAllAddress, getCartData } from "../hook/useCart";

export const useCart = (skip = false) => {
    const query = useQuery({
        queryKey: ["cart" , skip],
        queryFn: () => getCartData(),
        refetchOnWindowFocus: false,
        enabled: !skip,
    });

    return query;
};

export const useAddress = (skip = false) => {
    const query = useQuery({
        queryKey: ["address"],
        queryFn: () => getAllAddress(),
        refetchOnWindowFocus: false,
        enabled: !skip,
    });

    return query;
};


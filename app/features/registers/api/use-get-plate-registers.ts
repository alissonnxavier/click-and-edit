import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"


export const useGetRegisters = () => {
    const data = useQuery(api.plate.get);
    const isLoading = data === undefined;

    return { data, isLoading };
};
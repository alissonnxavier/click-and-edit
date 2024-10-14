import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface useGetWorkspaceProps {
    id: Id<"plateRegister">| undefined;
}

export const useGetRegister = ({ id }: useGetWorkspaceProps) => {

        const data = useQuery(api.plate.getById, { id});
        const isLoading = data === undefined;

    return { data, isLoading };
};
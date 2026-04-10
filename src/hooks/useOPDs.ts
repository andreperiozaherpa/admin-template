import { useState, useEffect, useCallback } from "react";
import { OPD } from "@/types/opd";
import { opdService } from "@/services/opdService";

export const useOPDs = () => {
    const [opds, setOpds] = useState<OPD[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOPDs = useCallback(async () => {
        try {
            setLoading(true);
            const data = await opdService.getOPDs();
            setOpds(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOPDs();
    }, [fetchOPDs]);

    return { opds, loading, error, refresh: fetchOPDs };
};

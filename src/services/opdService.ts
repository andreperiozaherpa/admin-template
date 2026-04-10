import { OPD } from "@/types/opd";

export const opdService = {
    async getOPDs(): Promise<OPD[]> {
        const response = await fetch("/mock/opd.json");
        if (!response.ok) throw new Error("Failed to fetch OPDs");
        return response.json();
    },

    async getOPDById(id: string): Promise<OPD | undefined> {
        const opds = await this.getOPDs();
        return opds.find(o => o.id === id);
    }
};

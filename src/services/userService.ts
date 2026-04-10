import { User } from "@/types/user";

export const userService = {
    async getUsers(): Promise<User[]> {
        const response = await fetch("/mock/users.json");
        if (!response.ok) throw new Error("Failed to fetch users");
        return response.json();
    },

    async getUserById(id: string): Promise<User | undefined> {
        const users = await this.getUsers();
        return users.find(u => u.id === id);
    }
};

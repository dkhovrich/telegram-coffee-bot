export interface User {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
}

export interface UserData {
    id: number;
    name: string;
    displayName: string;
}

export const getUserData = (user: User): UserData => ({
    id: user.id,
    name: user.username ?? user.first_name,
    displayName: `${user.first_name} ${user.last_name ?? ""}`.trim()
});

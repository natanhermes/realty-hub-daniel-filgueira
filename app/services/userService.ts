import db from "@/lib/db";
import { compareSync } from "bcrypt-ts";

type User = {
    name: string;
    username: string;
    password?: string;
}

export async function findUserByCredentials(username: string, password: string): Promise<User | null> {
    const user = await db.user.findFirst({
        where: {
            username,
        }
    });

    if (!user) {
        return null;
    }

    const passwordsMatch = compareSync(password, user.password);

    if (passwordsMatch) return {
        name: user.name,
        username: user.username,
    };

    return null;
}

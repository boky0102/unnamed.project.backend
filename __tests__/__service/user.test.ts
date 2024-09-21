import { initializeDB, pool } from "../../services/db.services";
import { getUser } from "../../services/user.services"
import { HttpException } from "../../Types/error";

afterAll(async () => {
    await initializeDB();
    await pool.end();
})


describe("Testing user service", () => { 
    test("service for getting user from db should work correctly",async () => {
        const user = await getUser("8ffa8839-a6ce-4eb2-8484-5341645f1a36");
        expect(user).toMatchObject({
            username: "borna_ivankovic",
            avatar: "https://cdn.discordapp.com/avatars/398501114095337472/12eebc5c0a8e0ecbfc48ead85d2e50bd.png"
        });
    })

    test("service for getting user from db should throw when given bad user id", async () => {
        await expect(async () => {
            return await getUser("e136f9a8-4bbf-4a70-91a3-0d29fd0f34b9"); // non existing uuid
        }).rejects.toThrow(new HttpException(404, "User doesn't exist"));
    })
})
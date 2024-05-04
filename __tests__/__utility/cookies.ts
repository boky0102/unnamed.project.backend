import { parseCookie } from "../../utility/cookies.utility"

describe("Testing cookie parser", () => {
    test("It should parse cookie correctly", async () => {

        const cookieString = "value1=dasdas;value2=2222;value3=12345";

        const parsedCookie = await parseCookie(cookieString);

        expect(parsedCookie).toHaveProperty("value1");

        expect(parsedCookie).toHaveProperty("value2");

        expect(parsedCookie).toHaveProperty("value3");

        console.log(parsedCookie);

        expect(parsedCookie.value1).toBe("dasdas");

        expect(parsedCookie.value2).toBe("2222");

        expect(parsedCookie.value3).toBe("12345");
    })
})
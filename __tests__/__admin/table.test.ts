import { getObjectKeys } from "../../utility/object.utility";

describe("Testing object keys parsing into array", () => {
    it("Should contain all keys of an object", async() => {
        const testObj = {
            key1: "test",
            key2: "test",
            key3: "test"
        };

        const arrayOfKeys = await getObjectKeys(testObj);

        expect(arrayOfKeys).toContain("key1");
        expect(arrayOfKeys).toContain("key2");
        expect(arrayOfKeys).toContain("key3");

        expect(arrayOfKeys.length).toBe(3);


    })

})
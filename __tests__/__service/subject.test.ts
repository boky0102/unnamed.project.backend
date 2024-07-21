import { HttpException } from "../../Types/error";
import { Subject } from "../../Types/subject.types";
import { initializeDB, pool } from "../../services/db.services";
import { deleteSubject, getSubjectsStartingWith, saveSubject } from "../../services/subject.services"


afterAll(async () => {
    await initializeDB();
    await pool.end();
})

describe("Subject service should handle saving subjects properly", () => {
    test("It should save new subject to the database", async() => {
        await saveSubject("Mechanics");

        const db = await pool.connect();

        const query = "SELECT name FROM subject WHERE name = 'Mechanics'"

        const res = await db.query<Subject>(query);

        expect(res.rows[0].name).toBe("Mechanics");

        db.release();
    });

    test("It should not save subject with same name", async() => {

        await expect(async () => {
            return await saveSubject("Mechanics");
        }).rejects.toThrow(new Error("Subject already exists in database"));


    });

    test("It should throw error if given subject name is too short (less than 4 chars)", async() => {

        await expect(async () => {
            return await saveSubject("Mec")
        }).rejects.toThrow(new Error("Subject name is too short"));
        
    })
});


describe("Subject service should handle getting subjects array that starts with given string proprely", () => {
    test("It should return 10 subjects that start with given string", async() => {


        const subjects = await getSubjectsStartingWith("mech");

        expect(subjects.length > 0).toBe(true);

        let mechanicsPresent = false;
        subjects.forEach((subject) => {
            if(subject.name === "Mechanics") mechanicsPresent= true;
        });

        expect(mechanicsPresent).toBe(true);

    });

    test("It should throw not found error if there is no subjects starting with given index", async () => {

        await expect(async () => {
            return await getSubjectsStartingWith("biology");
        }).rejects.toThrow(new Error("No subjects start with given string"));

    })
})
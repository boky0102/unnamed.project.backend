import { DbTableInfo } from "../Types/db.types";
import { pool } from "./db.services";

export const getTableNames = async ():Promise<string[]> => {
    const db = await pool.connect();

    const dbResponse = await db.query<DbTableInfo>("SELECT * FROM pg_catalog.pg_tables WHERE schemaname='public'");
    
    db.release();

    const tableNames = dbResponse.rows.map((tableData) => tableData.tablename);

    return tableNames;

    
}
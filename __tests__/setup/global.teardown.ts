import { pool } from "../../services/db.services"


module.exports = async () => {
    await pool.end();
    console.log("ENDED");
}

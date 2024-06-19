import { initializeDB } from "../../services/db.services"

module.exports = async () => {
    await initializeDB();
}

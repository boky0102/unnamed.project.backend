require('dotenv').config();
import { initializeDB } from './services/db.services';
import app from './app';

/*

    Here the server is started and db is initialized.

*/

initializeDB()

    .then(() => {    
        app.listen(3000, () => {
            console.log("server is running on 3000");
        })
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })


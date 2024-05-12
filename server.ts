require('dotenv').config();
import { initializeDB } from './services/db.services';
import app from './app';
import { log } from './utility/logger.utility';

/*

    Here the server is started and db is initialized.

*/

log.printHeader();

initializeDB()

    .then(() => {    
        app.listen(process.env.PORT || 80, () => {
            log.success(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        log.error(error);
        process.exit(1);
    })


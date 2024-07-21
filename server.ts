require('dotenv').config();
import  { initializeWebServer } from './app';
import { log } from './utility/logger.utility';

/*

    Here the server is started and db is initialized.

*/

log.printHeader();

async function start(){
    await initializeWebServer();
}

start()
    .then(() => {
        log.info("App started successfully");
    })
    .catch((error) => {
        log.info("Error occured during startup", error);
    })
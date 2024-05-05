# unnamed.project.backend

This project requires latest node version installed on your machine
check:  https://nodejs.org/en

To initialize project, while being project folder run
```npm install```

Install ts node on your machine if not installed
``` npm install -g ts-node ```

To spin up the server write into console
``` npm run dev ```

To run the tests
```npm run test```

You can edit .env file to change app behaviour
These are the settings that you can change: 

```APP_MODE``` - on / off ----- sets app development mode

```AUTOGENERATE_USER_ID``` - on / off ----- if turned on, db will autogenerate
userid on insert. If turned off, it will allow user id to be manually inserted,
which helps if you want to generate mock data. Needs to be turned off id you want
to populate data with populate.sql script.



```DROP_DB_ON_RESTART``` = on / off -----  configure server behavior regarding database deletion on restart

```FRONTEND_URL``` = url of frontend app
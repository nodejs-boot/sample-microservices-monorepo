import {AccountsApplication} from "./app";

// Starts the Node-Boot server with the application deployed
new AccountsApplication()
    .start()
    .then(app => {
        app.logger.debug(`AccountsApplication started successfully at port ${app.appOptions.port}`);
    })
    .catch(reason => {
        console.error(`Error starting AccountsApplication: ${reason}`);
    });

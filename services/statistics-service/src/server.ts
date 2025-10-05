import {StatisticsApplication} from "./app";

// Starts the Node-Boot server with the application deployed
new StatisticsApplication()
    .start()
    .then(app => {
        app.logger.debug(`StatisticsApplication started successfully at port ${app.appOptions.port}`);
    })
    .catch(reason => {
        console.error(`Error starting StatisticsApplication: ${reason}`);
    });

const mongoose = require('mongoose');
export const dbConnectionDefaultURL = `mongodb://localhost:27017/fhir-server-dev`;


export async function connectToDatabase(url: string) {
    return new Promise((resolve) => {
        mongoose.connection
            .on('error', (error: string) => {
                console.log(`Unable to connect to the database: ${error}`);
                setTimeout(() => mongoose.connect(url), 500);
            })
            .on('open', () => {
                console.log(`Database connection opened`);
                resolve(mongoose.connections[0]);
            })
            .on('close', () => {
                console.log(`Database connection closed`);
            });
        mongoose.connect(url);
        console.log('Connecting to the database ...')
    });
}

export const DATABASE_STATUS = {
    DISCONNECTED: 0,
    CONNECTED: 1,
    CONNECTING: 2,
    DISCONNECTING: 3
};

export function getDatabaseStatus() {
    return mongoose.connection.readyState
}

export function getMongooseInstance() {
    return mongoose;
}
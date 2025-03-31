import "dotenv/config";

import { createServer } from "http";
import mongoose from "mongoose";
import { app } from "./app";

const server = createServer(app);

const port = 8080
async function init() {
    await mongoose.connect(process.env.CONNECTION_STRING!, {
        dbName: "notesAJAX",
    });

    server.listen(port, () => console.log((new Date()).toLocaleString(),`Server listening on port ${port}`));
}

init();



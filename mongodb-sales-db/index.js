const app = require("./app");
const { connectDB, getMongoUri } = require("./db");

const PORT = 4000;

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Connected to ${getMongoUri()}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
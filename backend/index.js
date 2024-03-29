import 'dotenv/config';
import express from "express";
import cors from "cors";
import route from "./Routes/route.js";
import configureAWS from './config/awsConfig.js'
import dnsRoutes from "./Routes/dnsRoutes.js"


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

app.use("/", route);
app.use("/api/dns", dnsRoutes);

// configureAWS();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

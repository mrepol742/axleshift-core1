import dotenv from "dotenv";
dotenv.config();

export const allowedOrigins = [process.env.REACT_APP_ORIGIN, "/api/v1/freight/"];

const cors = {
    origin: function (origin, callback) {
        console.log(origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

export default cors;

import dotenv from "dotenv";
dotenv.config();

export const allowedOrigins = [process.env.CLIENT_ORIGIN];

const cors = {
    origin: function (origin, callback) {
        console.log(JSON.stringify(allowedOrigins))
        console.log(origin)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

export default cors;

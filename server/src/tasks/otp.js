import { ObjectId } from "mongodb";
import database from "../models/db.js";
import logger from "../components/logger.js";

const otp = () => {
    Promise.all([
        (async () => {
            try {
                const db = await database();
                const otpCollection =  await db.collection("otp");
                const otp = otpCollection.find({ verified: false, expired: false }).toArray();

                if (otp.length === 0) return;

                for (const _otp of otp) {
                    const past = new Date(_otp.created_at);
                    const ten = 10 * 60 * 1000;
            
                    if (Date.now() - past > ten) {
                        otpCollection.updateOne(
                            { _id: new ObjectId(_otp._id) },
                            {
                                $set: {
                                    expired: true,
                                    updated_at: Date.now(),
                                    modified_by: 'system',
                                },
                            }
                        );
                    }
                }
            } catch (e) {
                logger.error(e);
            }
        })(),
    ]);
};

export default otp;

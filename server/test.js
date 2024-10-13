import dotenv from "dotenv";
dotenv.config();
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LlamaCpp } from "@langchain/community/llms/llama_cpp";
import readline from 'readline';
import logger from './src/components/logger.js';
console.log(process.env.LLMS_MODEL)
const model = await new LlamaCpp({
    modelPath: `./src/models/${process.env.LLMS_MODEL}`,
    gpuLayers: 99
});

const prompt = ChatPromptTemplate.fromTemplate(`Answer the following question if you don't know the answer say so.`);
const chain = prompt.pipe(model);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const main = async () => {
    rl.question("hello: ", async (input) => {
        if (input.toLowerCase() === 'exit') {
            logger.warning("exiting....")
            rl.close();
            return;
        }

        logger.info(new Date());
        const result = await chain.invoke({ input });
        logger.info(result);
        logger.info(new Date());

        main();
    });
};

main();

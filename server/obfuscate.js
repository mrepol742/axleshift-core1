import js from 'javascript-obfuscator'
import fs from 'fs'
import logger from './logger.js'

main("build/");

function main(location) {
    fs.readdir(location, function (err, files) {
        if (err) return logger.error(err);
        
        for (let i = 0; i < files.length; i++) {
            const file = location + "/" + files[i];
            fs.stat(file, async (err, stats) => {
                if (err) return logger.error(err);

                if (stats.isFile()) {
                    const fileContent = fs.readFileSync(file, "utf8");
                    if (files[i].endsWith(".js")) {
                        logger.info("[Encrypting] " + files[i]);
                        let result = js.obfuscate(fileContent, {
                            compact: true,
                            controlFlowFlattening: true,
                            debugProtection: true,
                            debugProtectionInterval: 2500,
                            disableConsoleOutput: true,
                            identifierNamesGenerator: "mangled",
                            log: false,
                            numbersToExpressions: false,
                            renameGlobals: false,
                            selfDefending: false,
                            simplify: true,
                            splitStrings: false,
                            stringArray: true,
                            stringArrayShuffle: true,
                            stringArrayCallsTransform: true,
                            stringArrayCallsTransformThreshold: 0.5,
                            stringArrayEncoding: ["rc4"],
                            stringArrayIndexShift: true,
                            stringArrayRotate: true,
                            stringArrayWrappersCount: 1,
                            stringArrayWrappersChainedCalls: true,
                            stringArrayWrappersParametersMaxCount: 2,
                            stringArrayWrappersType: "variable",
                            stringArrayThreshold: 0.75,
                            unicodeEscapeSequence: false,
                        });
                        fs.writeFileSync(file, result.getObfuscatedCode(), "utf8");
                    }
                } else if (stats.isDirectory()) {
                    logger.info("[Folder] " + file);
                    main(file);
                } else {
                    logger.info("[Unknown] " + file);
                }
            });
        }
    });
}
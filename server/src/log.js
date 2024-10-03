import fs from 'fs';
import path from 'path';

const logFilePath = './log/crash.log';

fs.mkdir("./log", { recursive: true }, (err) => {
    if (err) throw err;
});

const log = (error) => {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : '';
    const logEntry = `${new Date().toISOString()}: ${message}\n${stack}\n`;

    fs.stat(logFilePath, (err, stats) => {
        if (err && err.code !== 'ENOENT') throw err;

        //10MB
        if (stats && stats.size > 10 * 1024 * 1024) {
            fs.readFile(logFilePath, 'utf8', (err, data) => {
                if (err) throw err;
                const lines = data.split('\n');
                // last hundreth lines
                // take me to your heart - michael learns to rock.... 3:00 ---- 4:00
                const newData = lines.slice(lines.length - 100).join('\n'); 
                fs.writeFile(logFilePath, newData, (err) => {
                    if (err) throw err;
                    appendLog(logEntry);
                });
            });
        } else {
            appendLog(logEntry);
        }
    });
};

const appendLog = (res) => {
    fs.appendFileSync(logFilePath, res, (err) => {
        if (err) throw err;
    });
};

export default log;

import { exec } from 'child_process'

export const run = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error: ${error}`)
            } else {
                resolve(stdout)
            }
        })
    })
}

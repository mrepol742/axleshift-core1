module.exports = {
    apps: [
        {
            name: 'core1-axleshift',
            script: 'src/index.js',
            instances: 'max',
            exec_mode: 'cluster',
            sticky: true,
        },
    ],
}

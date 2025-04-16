module.exports = {
    apps: [
        {
            name: 'core1-axleshift',
            script: 'src/index.js',
            instances: 3,
            exec_mode: 'cluster',
            sticky: true,
            node_args: '--max-old-space-size=1024',
            env: {
                NODE_ENV: 'production',
            },
            max_memory_restart: '512M',
            watch: false,
            autorestart: true,
        },
    ],
}

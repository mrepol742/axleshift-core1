const { NlpManager } = require('node-nlp');
const readline = require('readline');

const manager = new NlpManager({ languages: ['en'], forceNER: true });

const isWhitelisted = (ip) => {
    const whitelistedIPs = ['192.168.1.1', '10.0.0.1'];
    return whitelistedIPs.includes(ip);
};

(async () => {
    await manager.load('./model.nlp');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log('Chatbot is ready! Type your query or type "exit" to quit.');

    const askQuestion = () => {
        rl.question('You: ', async (query) => {
            if (query.toLowerCase() === 'exit') {
                console.log('Goodbye!');
                rl.close();
                return;
            }

            const response = await manager.process('en', query);
            console.log(response.intent)
              if (response.intent === 'ip.check') {
                const ip = response.entities.find((entity) => entity.entity === 'ip');

                if (ip) {
                    console.log(JSON.stringify(ip))
                    console.log(`Bot: ${ip} is ${isWhitelisted(ip) ? 'whitelisted' : 'not whitelisted'}`);
                    return askQuestion();
                }
            }

            console.log('Bot:', response.answer || 'I didn\'t understand that.');
            askQuestion();
        });
    };

    askQuestion();
})();

const { NlpManager } = require('node-nlp');
const fs = require('fs');
const faq = JSON.parse(fs.readFileSync('./data/faq.json', 'utf8'));
const casual = JSON.parse(fs.readFileSync('./data/casual.json', 'utf8'));

const manager = new NlpManager({ languages: ['en'], forceNER: true });

manager.addNamedEntityText(
    'ip',
    'ip',
    ['en'],
    [
        '192.168.0.1',
        '127.0.0.1',
        '10.0.0.1',
        '255.255.255.255',
        'any other IP address'
    ]
);

manager.addNamedEntityText(
    'geo',
    'geo',
    ['en'],
    [
    ]
);

for (let index = 0; index < faq.length; index++) {
    const item = faq[index];
    manager.addDocument('en', item.question, `faq.question-${index}`);
    manager.addAnswer('en', `faq.question-${index}`, item.answer);
}

for (let index = 0; index < casual.length; index++) {
    const item = casual[index];
    manager.addDocument('en', item.question, `faq.chat-${index}`);
    manager.addAnswer('en', `faq.chat-${index}`, item.answer);
}

manager.addDocument('en', 'is %ip% whitelisted?', 'ip.check');
manager.addDocument('en', 'check if %ip% is allowed', 'ip.check');
manager.addDocument('en', 'check if %ip% is blocked', 'ip.check');

manager.addDocument('en', 'is %coordinates% whitelisted?', 'geo.check');
manager.addDocument('en', 'check if %coordinates% is allowed', 'geo.check');
manager.addDocument('en', 'check if %coordinates% is blocked', 'geo.check');

manager.addDocument('en', 'is %recaptcha_score% good?', 'recaptcha.check');
manager.addDocument('en', 'check if %recaptcha_score% is bot', 'recaptcha.check');
manager.addDocument('en', 'check if %recaptcha_score% is human', 'recaptcha.check');

manager.addAnswer('en', 'ip.check', 'Verifying the IP address...');
manager.addAnswer('en', 'geo.check', 'Verifying the coordinates...');
manager.addAnswer('en', 'recaptcha.check', 'Verifying the reCAPTCHA score...');

(async () => {
    await manager.train();
    manager.save();
    console.log('Model trained and saved.');
})();
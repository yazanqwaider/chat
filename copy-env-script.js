const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

fs.readFile('.env', 'utf8', (err, data) => {
    if(err) throw err;

    let env_content = data;
    
    const key = 'ACCESS_TOKEN_SECRET';
    const new_token = crypto.createHash('sha256').update(crypto.randomBytes(32)).digest('base64');
    const old_value = key + '=' + process.env[key];
    const new_value = key + '=' + new_token;

    env_content = env_content.replace(old_value, new_value);
    
    fs.writeFile('.env', env_content, (err, results) => {
        if(err) throw err;
        console.info('Key has generated.');
    });
});
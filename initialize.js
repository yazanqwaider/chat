const fs = require('fs');

// Create messages resources directories.
if(!fs.existsSync('public/messages')) {
    fs.mkdirSync('public/messages');
    fs.mkdirSync('public/messages/images');
    fs.mkdirSync('public/messages/audios');
}

console.info('Initialized ✨');

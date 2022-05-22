const fs = require('fs');

const path = require('path');
const readline = require('readline');

const { stdin: input } = require('process');
const rl = readline.createInterface({ input }); 

const fileName = 'destination.txt';

const output = fs.createWriteStream(path.join(__dirname, fileName));

console.log('Привет! Напишите что-то:');
rl.on('line', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    output.write(data + '\n');
  }
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('Спасибо за проверку!'));

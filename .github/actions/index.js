const core = require('@actions/core');

const envFile = core.getInput('env-file');

console.log(`envFile: ${envFile}`);

console.log('Hello, world!');
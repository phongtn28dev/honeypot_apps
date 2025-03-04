const core = require('@actions/core');

const envFile = core.getInput('env-file');

console.log(`envFile: ${envFile}`);

console.log('Hello, world!');

//替换 env 文件中的变量值，并重写文件
function readAndReplaceEnvFile() {
 const env = fs.readFileSync(envFile, 'utf8');
 const envLines = env.split('\n');
 const envMap = new Map();

 for (const line of envLines) {
  const [key, value] = line.split('=');
  envMap.set(key, value);
 }

 // 替换 env 文件中的变量值
 for (const [key, value] of envMap.entries()) {
  if (new RegExp(`^\${${key}}$`).test(value)) {
   const replacedValue = process.env[key];
   envMap.set(key, replacedValue);
  }
 }

 // 重写 env 文件
 fs.writeFileSync(envFile, envMap.entries().map(([key, value]) => `${key}=${value}`).join('\n'));
}

readAndReplaceEnvFile();

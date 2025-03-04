const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const vercelToken = process.env.WORKFLOW_VERCEL_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID;
const projectId = process.env.PROJECT_ID;

// 读取 env 文件
let envContent = fs.readFileSync(process.env.ENV_FILE, "utf8");

// 替换环境变量
envContent = envContent.replace(/\$\{([^}]+)\}/g, (_, varName) => {
 return process.env[varName] || "";
});

console.log("process.env.ENV_FILE", process.env.ENV_FILE);

// 写回更新后的 env 文件
fs.writeFileSync(process.env.ENV_FILE, envContent);
console.log("✅ Updated", process.env.ENV_FILE);

// 获取 Vercel 现有环境变量
async function getVercelEnv() {
 const url = `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`;
 try {
  const res = await axios.get(url, {
   headers: { Authorization: `Bearer ${vercelToken}` },
  });
  return res.data.envs || [];
 } catch (err) {
  console.error("❌ Failed to fetch Vercel env:", err.response?.data || err);
  return [];
 }
}


function getValue(key, value) {
 if (key === "NPM_RC") {
  return Buffer.from(value, "base64").toString("utf8");
 }
 return value;
}

// 更新或创建 Vercel 环境变量
async function updateVercelEnv() {
 const currentEnvs = await getVercelEnv();
 const existingEnvKeys = currentEnvs.map((env) => env.key);

 const envLines = envContent.split("\n").filter((line) => line.trim() && !line.startsWith("#"));
 for (const line of envLines) {
  const [key, value] = line.split("=");
  if (!key || !value) continue;

  if (existingEnvKeys.includes(key)) {
   console.log(`🔄 Updating ${key}...`);


   const envVarId = currentEnvs.find((env) => env.key === key).id;
   await axios.patch(
    `https://api.vercel.com/v10/projects/${projectId}/env/${envVarId}?teamId=${teamId}`,
    {
     key,
     value: getValue(key, value),
     type: "encrypted",
     target: ["production", "preview"],
    },
    { headers: { Authorization: `Bearer ${vercelToken}` } }
   );
  } else {
   console.log(`➕ Creating ${key}...`);
   await axios.post(
    `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`,
    {
     key,
     value,
     type: "encrypted",
     target: ["production", "preview"],
    },
    { headers: { Authorization: `Bearer ${vercelToken}` } }
   );
  }
 }
}

updateVercelEnv().then(() => console.log("✅ Vercel env update completed."));
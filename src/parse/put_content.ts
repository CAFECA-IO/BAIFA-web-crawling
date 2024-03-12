import { resolve } from "path";
const envPath = resolve(__dirname, "../../../auditing_system/.env");

import { config } from "dotenv";
config({ path: envPath });

import { exec } from "child_process";

function runCommand(command) {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`\x1b[31mError: ${error.message}\x1b[0m`);
      }
      resolve(stdout);
    });

    process.stdout.on('data', function (data) {
      console.log(data);
    });
  });
}


async function put_content() {
  const nftAddress = process.env.NFT_ADDRESS;
  try {
    await runCommand(
      `node auditing_system/baifa_database/scripts/test.js ${nftAddress}`,
    );
    console.log("put_content success");
  } catch (error) {
    console.log("put_content error:", error);
  }
}

export { put_content };

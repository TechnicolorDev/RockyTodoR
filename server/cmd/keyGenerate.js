/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                    !CAUTION WARNING!                                            //
//                    This is script responsible for yarn env:key:generate                         //
//         This code generates you APP_KEY in .env and is responsible for delivering  key          //
//                                  For API Endpoint auth                                          //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////

const { program } = require('commander');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const chalk = require('chalk');
const inquirer = require("inquirer");
const prompts = require('prompts');

let ora;
(async () => {
    ora = await import('ora');

    const rootDir = path.resolve(__dirname, "../../");
    const envPath = path.join(rootDir, ".env");

    function generateToken() {
        const randomBytes = crypto.randomBytes(32);
        let token = randomBytes.toString("base64");
        token = token.replace(/=/g, "").slice(0, 24);
        return token;
    }

    function readEnvFile() {
        if (!fs.existsSync(envPath)) {
            return {};
        }

        const content = fs.readFileSync(envPath, "utf-8");
        const envObject = {};

        content.split("\n").forEach((line) => {
            const [key, value] = line.split("=");
            if (key && value) {
                envObject[key.trim()] = value.trim();
            }
        });
        return envObject;
    }

    function writeEnvFile(envObject) {
        const content = Object.entries(envObject)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        fs.writeFileSync(envPath, content, "utf-8");
    }

    async function askForOverwrite(currentToken) {
        const response = await prompts({
            type: 'confirm',
            name: 'overwrite',
            message: `Do you wish to overwrite the current APP_KEY? Current key: ${currentToken}`,
            initial: false,
        });

        return response.overwrite;
    }

    async function generateAppkey() {
        const spinner = ora.default(chalk.blue('Reading .env file...')).start();

        const env = readEnvFile();
        const currentToken = env.APP_KEY;

        spinner.stopAndPersist({
            symbol: '✔',
            text: chalk.green('File read successfully!'),
        });

        if (currentToken) {
            const overWrite = await askForOverwrite(currentToken);
            if (!overWrite) {
                console.log(chalk.yellow('Token was not overwritten.'));
                return;
            }
        }

        const newToken = generateToken();

        spinner.start(chalk.blue('Generating new APP_KEY...'));
        console.log(chalk.cyan(`Generated new APP_KEY: ${chalk.bold(newToken)}`));

        env.APP_KEY = newToken;
        writeEnvFile(env);

        spinner.stopAndPersist({
            symbol: '✔',
            text: chalk.green('.env file was successfully updated!'),
        });
    }

    program
        .command('env:key:generate')
        .description('Generate a new 24-character secure APP_KEY and update the .env file')
        .action(generateAppkey);

    program.parse(process.argv);
})();

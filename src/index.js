import 'dotenv/config'
import { fileURLToPath } from "node:url";
import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseIfJson(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}

function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


/**
 * @typedef {Object} ResponseBody
 * @property {string} completion
 */

/**
 * Invokes a Bedrock agent to run an inference using the input
 * provided in the request body.
 *
 * @param {string} prompt - The prompt that you want the Agent to complete.
 * @param {string} sessionId - An arbitrary identifier for the session.
 */
async function invokeBedrockAgent (prompt, sessionId) {
    const client = new BedrockAgentRuntimeClient({
        awsRegion: process.env.AWS_REGION,
    });

    const agentId = process.env.AGENT_ID;
    const agentAliasId = process.env.AGENT_ALIAS_ID;

    const command = new InvokeAgentCommand({
        agentId,
        agentAliasId,
        sessionId,
        inputText: prompt,
    });

    try {
        let completion = "";
        const response = await client.send(command);

        if (response.completion === undefined) {
            new Error("Completion is undefined");
        }

        for await (const chunkEvent of response.completion) {
            const chunk = chunkEvent.chunk;
            const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
            completion += decodedResponse;
        }

        return { sessionId: sessionId, completion };
    } catch (err) {
        console.error(err);
    }
}

async function processName(name, attempt = 1) {
    const maxAttempts = 3;
    if (attempt > maxAttempts) {
        console.log(`Max attempts of ${attempt} reached for: ${name.first_name} ${name.last_name}`);
        return;
    }
    console.log('Evaluating name: ', name);
    const prompt = `${JSON.stringify(name)}`;
    const result = await invokeBedrockAgent(prompt, `test-session-id-name-${Date.now()}`);
    console.log('Our Result is: ', result);
    const completion = parseIfJson(result.completion);
    const completionScoreIsFloat = completion && completion.score && !isNaN(completion.score) && !Number.isSafeInteger(completion.score);
    if (!completionScoreIsFloat && attempt < maxAttempts) {
        const newAttemptCount = attempt + 1;
        console.log(`Starting attempt #${newAttemptCount} for ${name.first_name} ${name.last_name}`);
        await processName(name, newAttemptCount);
    }

    await sleep(getRandomValue(1500, 5000));
}

const arrayOfNames = [
    { first_name: "Tammy", last_name: "Chiang" },
    { first_name: "Marcilla", last_name: "Farnham" },
    { first_name: "Lydia", last_name: "Harvey" },
    { first_name: "Michelle", last_name: "Springer" },
    { first_name: "Guy", last_name: "Fricks" },
    { first_name: "Alaiaguy1971@gmail.com", last_name: "Fricks" },
    { first_name: "Lailah", last_name: "Smith" },
    { first_name: "CHRIS", last_name: "PRUITT" },
    { first_name: "Chris", last_name: "Pruitt" },
    { first_name: "Derek", last_name: "Reyna" },
    { first_name: "????", last_name: "Rodrigues" },
    { first_name: "SHERLONIA", last_name: "Powell" },
    { first_name: "Sarataia", last_name: "Sadek" },
    { first_name: "Jennifer", last_name: "Singh" },
    { first_name: "Kirsten Ward", last_name: "Hampton" },
    { first_name: "Trevor", last_name: "Shaw" },
    { first_name: "Irvin", last_name: "Dominguez" },
    { first_name: "Nicholas ", last_name: "Cazeault" },
    { first_name: "Nick", last_name: "Cazeault" },
    { first_name: "Gandy", last_name: "Washburn" },
    { first_name: "Peter", last_name: "Russo" },
    { first_name: "Rolando", last_name: "Tilos" },
    { first_name: "Kaitlin Jiral", last_name: "Mynar" },
    { first_name: "Salvador ", last_name: "Hernandez" },
    { first_name: "Jacqueline", last_name: "Montiel" },
    { first_name: "irene", last_name: "milan" },
    { first_name: "Tlali", last_name: "Manosa" },
    { first_name: "Andres", last_name: "Alvarez" },
    { first_name: "Enprize", last_name: "Me" },
    { first_name: "Hafiz Khair Muhammad ", last_name: "JuneJO " },
    { first_name: "Carlos", last_name: "Medina" },
    { first_name: "Richard", last_name: "Oliver" },
    { first_name: "Autumn ", last_name: "Jackson" },
    { first_name: "MJ", last_name: "Jondle" },
    { first_name: "Gui", last_name: "Borges" },
    { first_name: "Robert", last_name: "Sirois" },
    { first_name: "Sylvia Sylwia", last_name: "Kolanko" },
    { first_name: "Nicholas ", last_name: "Tilas " },
    { first_name: "Mark", last_name: "Naidu" },
    { first_name: "Ana", last_name: "chacon" },
    { first_name: "Tavio", last_name: "Henson" },
    { first_name: "gtrtg", last_name: "gtyrfthy" },
    { first_name: "Abir", last_name: "bhushan" },
    { first_name: "Walt", last_name: "Moore" },
    { first_name: "Lasadie", last_name: "Russell" },
    { first_name: "Olushola ", last_name: "ojo" },
    { first_name: "jaris", last_name: "bryant" },
    { first_name: "Ojo", last_name: "Olusola" },
    { first_name: "Angelique", last_name: "Clay" },
    { first_name: "Jorge", last_name: "Ojeda" },
    { first_name: "Lisa", last_name: "M." },
    { first_name: "Ivan", last_name: "Gabriel" },
    { first_name: "Rosangela", last_name: "Da silva " },
    { first_name: "Rosângela ", last_name: "Da silva " },
    { first_name: "Valeria", last_name: "Ibarra" },
    { first_name: "Barbara", last_name: "Freeze" },
    { first_name: "Verónica H", last_name: "Hernández" },
    { first_name: "Tiffany", last_name: "Goodsell" },
    { first_name: "Milca", last_name: "Cruz" },
    { first_name: "Kiara", last_name: "Lemon" },
    { first_name: "Nasim", last_name: "Talank" },
    { first_name: "alex", last_name: "Manukyan" },
    { first_name: "Charlene", last_name: "Lorah" },
    { first_name: "Korey", last_name: "James" },
    { first_name: "Joseph B.", last_name: "Thompson" },
    { first_name: "Keith", last_name: "Douglas" },
    { first_name: "Angeline", last_name: "Gnanasekaran" },
    { first_name: "Navya", last_name: "Gadh" },
    { first_name: "Kathy", last_name: "Loo" },
    { first_name: "Johana Torres", last_name: "Angulo" },
    { first_name: "Elizabeth ", last_name: "Boykin" },
    { first_name: "Christopher", last_name: "Acevedo-Ramos" }
]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    for (const name of arrayOfNames) {
        await processName(name);
    }
}
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

const arrayOfNames = [
    {
        first_name: "Jack",
        last_name: "Smith"
    },
    {
        first_name: "Caroline",
        last_name: "Martin"
    },
    {
        first_name: "12312u",
        last_name: "7sg00mb4"
    },
    {
        first_name: "Caudalia",
        last_name: "Dubois"
    },
    {
        first_name: "Johanna",
        last_name: "Bauer"
    },
    {
        first_name: "jwero",
        last_name: "asrg"
    },
    {
        first_name: "Adele",
        last_name: "Schneider"
    },
    {
        first_name: "Felix",
        last_name: "Meyer"
    },
    {
        first_name: "THEEEEE",
        last_name: "4CHANGOD"
    },
    {
        first_name: "Ella",
        last_name: "Hoffman"
    },
    {
        first_name: "thanhnthanhnamam",
        last_name: "thanhnam"
    },
    {
        first_name: "thanhnam",
        last_name: "thanhnam"
    },
    {
        first_name: "Ramesh",
        last_name: "Sharma"
    },
    {
        first_name: "jhsdgkfj",
        last_name: "ldfkjsvdfgd"
    },
]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    for (const name of arrayOfNames) {
        console.log('Evaluating name: ', name);
        const prompt = `${JSON.stringify(name)}`;
        const result = await invokeBedrockAgent(prompt, `test-session-id-name-${Date.now()}`);
        console.log('Our Result is: ', result);
        const completion = parseIfJson(result.completion) ?? result.completion;
        console.log('Parsed completion is: ', Object.keys(completion).length ? completion : 'Cannot parse completion...');
        await sleep(getRandomValue(1500, 5000));
    }
}
import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import 'dotenv/config'

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
export const invokeBedrockAgent = async (prompt, sessionId) => {
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
        console.log('OUR response', response);

        if (response.completion === undefined) {
            throw new Error("Completion is undefined");
        }

        for await (const chunkEvent of response.completion) {
            const chunk = chunkEvent.chunk;
            console.log(chunk);
            const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
            completion += decodedResponse;
        }

        return { sessionId: sessionId, completion };
    } catch (err) {
        console.error(err);
    }
};

// Call function if run directly
import { fileURLToPath } from "node:url";
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const result = await invokeBedrockAgent(JSON.stringify([
        {
            first_name: "Jack",
            last_name: "Smith"
        },
        {
            first_name: "Ramesh",
            last_name: "Sharma"
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
            first_name: "jhsdgkfj",
            last_name: "ldfkjsvdfgd"
        },
    ]), `test-session-id-${Date.now()}`);
    console.log(result);
}
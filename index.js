const Discord = require("discord.js");
const config = require("./config.json");

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const prefix = "!";

(async () => {
    await client.login(config.BOT_TOKEN);

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;
        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();
        if (command === "ping") {
            const timeTaken = Date.now() - message.createdTimestamp;
            await message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
        }
    });

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        if (message.content.startsWith(prefix)) return;

        const response = await openai.createCompletion("text-davinci-001", {
            prompt: `Tweet: \"${message}\"\nSentiment::`,
            temperature: 0,
            max_tokens: 60,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        const res = response.data.choices[0].text;
        if (res.toLowerCase().includes('positive')) {
            await message.react('😃');
        } else if (res.toLowerCase().includes('negative')) {
            await message.react('🤢');
        } else {
            await message.react(res);
        }
    });



})()
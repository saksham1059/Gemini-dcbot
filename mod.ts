import { load } from "https://deno.land/std/dotenv/mod.ts"
import { green, red } from "https://deno.land/std/fmt/colors.ts"
import {
	Client,
	GatewayIntents,
	Message,
	Embed
} from "https://deno.land/x/harmony/mod.ts"
import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from "https://esm.sh/@google/generative-ai"

await load({
	export: true,
})

const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN")
const GEMINI_TOKEN = Deno.env.get("GEMINI_TOKEN")
const GEMINI_AI = new GoogleGenerativeAI(GEMINI_TOKEN)
const GEMINI_MODEL = GEMINI_AI.getGenerativeModel({
	model: "gemini-pro",
	safetySettings: [
		{
			category: HarmCategory.HARM_CATEGORY_HARASSMENT,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
	],
})

async function queryGemini(query: string) {
	const result = await GEMINI_MODEL.generateContent(
		`Answer "${query}" in 80-100 words.`,
	)
	const response = await result.response

	return response.text()
}

const client = new Client({
	token: DISCORD_TOKEN,
	intents: [
		"GUILDS",
		"DIRECT_MESSAGES",
		"GUILD_MESSAGES",
	],
})

client.on(
	"ready",
	() => console.log(`${green("[INFO]")} Gemini Bot is Online Now!`),
)
client.on("messageCreate", async (msg: Message) => {
	// console.log(`[DEBUG]: ${msg.content}`)
	switch (msg.content) {
		case "$meow":
			msg.reply("_Meeeooooww~!_")
			break
		case "$acoustic":
			msg.reply(
				"https://media.discordapp.net/attachments/1232350728954318863/1234171905062469773/pichu.mp4?ex=6631bde7&is=66306c67&hm=550f17003043d4be6bc71cd0014246633e6b0962c8c49b39515b09ff2c93a2dd&",
			)
			break
		case "$test":
			msg.reply(new Embed({
				title: "Test Embed!?",
				description: "Hi, Hello! <3",
				color: "15844367"
			}))
			break
		case "$help":
			msg.reply(new Embed({
				title: "Welcome to Gemini!",
				description: 
				`
				Hi, this is a tiny bot with only a few commands.

				**$meow** for me to meow back at you.
				**$acoustic** for a funny clip.
				**$query** to ask me questions.
				`.replaceAll("\t", ""),
				color: 0x2D415F
			}))
			break
		default:
			if (msg.content.startsWith("$query")) {
				try {
					const text = await queryGemini(msg.content.replace("$query", ""))
					msg.reply(text)
				} catch (e) {
					const err = `${red("[ERROR]")} ${e}`
					msg.reply(new Embed({
						title: "Uncaught Error!",
						description: e,
						color: "10038562"
					}))
					console.error(err)
				}
			}
			break
	}
})

client.connect()

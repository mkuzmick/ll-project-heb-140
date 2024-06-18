const llog = require('learninglab-log')
const bots = require('../bots');
const OpenAI = require('openai');

const imHandler = async ({client, message, say}) => {
    llog.magenta(`got an im from <@${message.user}>`);
    llog.blue(message);
    await say(`...`);
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        let result = await client.conversations.history({channel: message.channel, limit: 20})
        llog.magenta("result", result)
        const conversation = result.messages.map(message => {
            return {
                writer: message.user,
                text: message.text
            }
        })
        let oAiCompletion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant who functions as a writing tutor and you are helping me write my paper on the evolution of Friendship." },
                { role: "user", content: `here is the JSON fora conversation between me and you, I am ${message.user} and you are the bots, please respond with the next appropriate thing to say given the conversation thread, but return only the value of message.text, not actual JSON: ${JSON.stringify(conversation)}` }
            ],
            model: "gpt-4o",
          });

          console.log(oAiCompletion.choices[0]);
          let slackResult = await client.chat.postMessage({
            channel: message.channel,
            text: `${oAiCompletion.choices[0].message.content}`,
            // icon_url: randomBot.imageUrl,
            username: "Writing Tutor"
        });
        // llog.magenta(oAiCompletion)
    } catch (error) {
        llog.red(error)
    }


    

}

exports.testing = async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>!`);
}

exports.parseAll = async ({ client, message, say, event }) => {
    // const loggerBotResult = await loggerBot({ client, message, say, event });
    // const directorResult = await directorBot({ client, message, say, event });
    if ( message.channel_type == "im" ) {
       const imResponseResult = await imHandler({ client, message, say });
    } else if ( message.channel == process.env.SLACK_WORK_CHANNEL) {
        llog.cyan(`handling message because ${message.channel} is the summer work channel`);
        const workBotResult = await ({ client, message });
    } 
    
    else {
        llog.magenta(`some other message we aren't handling now--uncomment message-handler line 27 to get the json`)
        // llog.blue(`message wasn't in array ${JSON.stringify(BOT_CONFIG.channels, null, 4)}`)
        llog.yellow(message)
    }
    if (message.channel==process.env.SLACK_WORK_CHANNEL) {
        // let mkWorkBotResult = await mkWorkBot.handleMessage({ client, message, say });
        llog.yellow(`handling message because ${message.channel} is the work channel`);
    }
}


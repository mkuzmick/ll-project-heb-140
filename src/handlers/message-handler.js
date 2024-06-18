const llog = require('learninglab-log')
const bots = require('../bots');
const OpenAI = require('openai');
const writingTutorFriend = require('../bots/friends/writing-tutor-friend')
const frenemy = require('../bots/friends/frenemy')
const bestFriend = require('../bots/friends/best-friend')

exports.testing = async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>!`);
}

exports.parseAll = async ({ client, message, say, event }) => {
    // const loggerBotResult = await loggerBot({ client, message, say, event });
    // const directorResult = await directorBot({ client, message, say, event });
    if ( message.channel_type == "im" ) {
       const writingTutorResponse = await writingTutorFriend({ client, message, say });
       llog.cyan(writingTutorResponse)
       const frenemyResult = await frenemy({
            client,
            message,
            writingTutorMessage: writingTutorResponse.tutorResponse,
            history: writingTutorResponse.history,
            threadTs: writingTutorResponse.slackResult.ts

       })
       llog.magenta(frenemyResult)
       const bestFriendResult = await bestFriend({
            client,
            message,
            writingTutorMessage: writingTutorResponse.tutorResponse,
            frenemyMessage: frenemyResult.message.text,
            history: writingTutorResponse.history,
            threadTs: writingTutorResponse.slackResult.ts
       })
    } else if ( message.channel == process.env.SLACK_WORK_CHANNEL) {
        llog.cyan(`handling message because ${message.channel} is the summer work channel`);
        // const workBotResult = await ({ client, message });
        
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


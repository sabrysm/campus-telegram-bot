import { Handler } from "aws-lambda";
import Update from "../interfaces/Update";
import Telegram from "../libs/telegram";
import Message from "../interfaces/Message";
import ReactionType from "../interfaces/ReactionType";
import { DYNAMO_DB_TABLE_NAME, GROUP_ID } from "../constants";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import generateId from "../libs/genrateId";
import SendMessageParameters from "../interfaces/SendMessageParameters";
import { text } from "body-parser";
import InlineKeyboardButton from "../interfaces/InlineKeyboardButton";
import InlineKeyboardMarkup from "../interfaces/InlineKeyboardMarkup";
import ForceReply from "../interfaces/ForceReply";
import CopyMessage from "../interfaces/copyMessage";

const client = new DynamoDBClient({
    region: "eu-west-3",
    credentials: {
        accessKeyId: 'AKIAWRCFDXA7Y3434OWL',
        secretAccessKey: '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'
    }
});
const docClient = DynamoDBDocumentClient.from(client);

const askQuestionHandler = async (message: Message) => {

    const message_type = message.text !== undefined ? "text" : message.photo !== undefined ? "photo" : message.audio !== undefined ? "audio" : message.video !== undefined ? "video" : message.voice !== undefined ? "voice" : message.document !== undefined ? "document" : "text";
    const id = message.message_id.toString();
    console.log("Question ID: ", id)
    console.log("Question type: ", message_type)

    if (message_type === "text") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id,
                text: message.text,
                from: message.from!.id,
                type: "question",
                message_type: "text"
            }
        })
        const a = await docClient.send(putCommand);

        await Telegram.instance.sendMessage({
            chat_id: GROUP_ID,
            text: `${message.text}\n\n#AnonQuestion`
        })
    }
    else if (message_type === "photo") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id,
                photo: message.photo![0].file_id,
                caption: message.caption,
                from: message.from!.id,
                type: "question",
                message_type: "photo"
            }
        })
        const a = await docClient.send(putCommand);

        await Telegram.instance.sendPhoto({
            chat_id: GROUP_ID,
            photo: message.photo![0].file_id,
            caption: message.caption + "\n\n#AnonQuestion"
        })
    } else if (message_type === "audio") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id,
                audio: message.audio!.file_id,
                caption: message.caption,
                from: message.from!.id,
                type: "question",
                message_type: "audio"
            }
        })
        const a = await docClient.send(putCommand);

        await Telegram.instance.sendAudio({
            chat_id: GROUP_ID,
            audio: message.audio!.file_id,
            caption: message.caption + "\n\n#AnonQuestion"
        })
    } else if (message_type === "video") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id,
                video: message.video!.file_id,
                caption: message.caption,
                from: message.from!.id,
                type: "question",
                message_type: "video"
            }
        })
        const a = await docClient.send(putCommand);

        await Telegram.instance.sendVideo({
            chat_id: GROUP_ID,
            video: message.video!.file_id,
            caption: message.caption + "\n\n#AnonQuestion"
        })
    }
    else if (message_type === "document") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id,
                document: message.document!.file_id,
                caption: message.caption,
                from: message.from!.id,
                type: "question",
                message_type: "document"
            }
        })
        const a = await docClient.send(putCommand);

        await Telegram.instance.sendDocument({
            chat_id: GROUP_ID,
            document: message.document!.file_id,
            caption: message.caption + "\n\n#AnonQuestion"
        })
    } else if (message_type === "voice") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id,
                voice: message.voice!.file_id,
                caption: message.caption,
                from: message.from!.id,
                type: "question",
                message_type: "voice"
            }
        })
        const a = await docClient.send(putCommand);

        await Telegram.instance.sendVoice({
            chat_id: GROUP_ID,
            voice: message.voice!.file_id,
            caption: message.caption + "\n\n#AnonQuestion"
        })
    } else {
        console.log("Message type not supported")
        await Telegram.instance.sendMessage({
            chat_id: message.chat.id,
            text: "Message type not supported"
        })
    }
}



const getIdFromQuestionMessage = (message: Message): string => {
    const entitie = message.entities!.find(entity => entity.type === "hashtag")!


    return message.text!.slice(entitie.offset + 1, entitie.offset + entitie.length);
}


const answerQuestionHandler = async (message: Message) => {

    // console.log(message.reply_to_message)
    // console.log(getIdFromQuestionMessage(message.reply_to_message!))
    const getCommand = new GetCommand({
        TableName: DYNAMO_DB_TABLE_NAME,
        Key: {
            id: (message.reply_to_message!.message_id - 1).toString(),
            type: "question"
        }
    })

    const { Item } = await docClient.send(getCommand)

    const question_type = Item?.message_type;
    const accept_button: InlineKeyboardButton = {
        text: "Accept Answer ✅",
        callback_data: "accept"
    }
    const keyboard: InlineKeyboardMarkup = { inline_keyboard: [[accept_button]] }

    const copied_msg = await Telegram.instance.copyMessage({
        chat_id: (message.from!.id).toString(), // Replace it later with Item.from
        from_chat_id: GROUP_ID,
        message_id: message.message_id,
        reply_markup: keyboard,
    })


    let message_type = message.text !== undefined ? "text" : message.photo !== undefined ? "photo" : message.audio !== undefined ? "audio" : message.video !== undefined ? "video" : message.voice !== undefined ? "voice" : message.document !== undefined ? "document" : "text";
    console.log("Answer ID: ", message.message_id)
    console.log("Answer type: ", message_type)

    console.log("Forwarded message ID: ", copied_msg.result.message_id)


    if (message_type === "text") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id - 1).toString(),
                question_text: Item?.text,
                text: message.text,
                from: message.from!.id,
                type: "answer",
                message_type: "text",
                question_type: question_type
            }
            // return message ID and chat ID
        })

        await docClient.send(putCommand);
    } else if (message_type === "photo") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id - 1).toString(),
                question_text: Item?.caption,
                photo: message.photo![0].file_id,
                from: message.from!.id,
                type: "answer",
                message_type: "photo"
            }
        })
        await docClient.send(putCommand);
    } else if (message_type === "audio") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id - 1).toString(),
                question_text: Item?.caption,
                audio: message.audio!.file_id,
                from: message.from!.id,
                type: "answer",
                message_type: "audio"
            }
        })
        await docClient.send(putCommand);
    } else if (message_type === "video") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id - 1).toString(),
                question_text: Item?.caption,
                video: message.video!.file_id,
                from: message.from!.id,
                type: "answer",
                message_type: "video"
            }
        })
        await docClient.send(putCommand);
    } else if (message_type === "document") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id - 1).toString(),
                question_text: Item?.caption,
                document: message.document!.file_id,
                from: message.from!.id,
                type: "answer",
                message_type: "document"
            }
        })
        await docClient.send(putCommand);
    } else if (message_type === "voice") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id - 1).toString(),
                question_text: Item?.caption,
                voice: message.voice!.file_id,
                from: message.from!.id,
                type: "answer",
                message_type: "voice"
            }
        })
        await docClient.send(putCommand);
    } else {
        console.log("Message type not supported")
        await Telegram.instance.sendMessage({
            chat_id: message.chat.id,
            text: "Message type not supported"
        })
    }
}



const setReactionHandler = async (message_id: number) => {
    const reaction: ReactionType = {
        type: "emoji",
        emoji: "👍"
    }

    await Telegram.instance.setMessageReaction({
        chat_id: GROUP_ID,
        message_id: message_id,
        reaction: [reaction],
        is_big: false
    });
}


const AcceptAnswer = async (message_id: number) => {

    const getCommand = new GetCommand({
        TableName: DYNAMO_DB_TABLE_NAME,
        Key: {
            id: (message_id - 1).toString(),
            type: "answer"
        }
    })

    const { Item } = await docClient.send(getCommand)


    const answer_type = Item?.message_type;

    console.log("Message type from Reaction Handler: ", answer_type)

    await Telegram.instance.sendMessage({
        chat_id: GROUP_ID,
        text: `*Accepted Answer* ✅`,
        reply_parameters: {
            message_id: message_id - 1,
            chat_id: GROUP_ID
        },
        parse_mode: "MarkdownV2"
    })

    await setReactionHandler(message_id - 1)
}

const replyToGroupAnswer = async (message: Message, new_question: Message) => {
    const message_type = new_question.text !== undefined ? "text" : new_question.photo !== undefined ? "photo" : new_question.audio !== undefined ? "audio" : new_question.video !== undefined ? "video" : new_question.voice !== undefined ? "voice" : new_question.document !== undefined ? "document" : "text";

    console.log("Reply to group answer message type: ", message_type)

    if (message_type === "text") {
        await Telegram.instance.sendMessage({
            chat_id: GROUP_ID,
            text: new_question.text ? new_question.text + "\n\n#AnonQuestion" : "",
            reply_parameters: {
                message_id: message.message_id - 1,
                chat_id: GROUP_ID
            }
        })
    } else if (message_type === "photo") {
        await Telegram.instance.sendPhoto({
            chat_id: GROUP_ID,
            photo: new_question.photo![0].file_id,
            caption: new_question.caption + "\n\n#AnonQuestion",
            reply_parameters: {
                message_id: message.message_id - 1,
                chat_id: GROUP_ID
            }
        })
    } else if (message_type === "audio") {
        await Telegram.instance.sendAudio({
            chat_id: GROUP_ID,
            audio: new_question.audio!.file_id,
            caption: "#AnonQuestion",
            reply_parameters: {
                message_id: message.message_id - 1,
                chat_id: GROUP_ID
            }
        })
    } else if (message_type === "video") {
        await Telegram.instance.sendVideo({
            chat_id: GROUP_ID,
            video: new_question.video!.file_id,
            caption: "#AnonQuestion",
            reply_parameters: {
                message_id: message.message_id - 1,
                chat_id: GROUP_ID
            }
        })
    } else if (message_type === "document") {
        await Telegram.instance.sendDocument({
            chat_id: GROUP_ID,
            document: new_question.document!.file_id,
            caption: "#AnonQuestion",
            reply_parameters: {
                message_id: message.message_id - 1,
                chat_id: GROUP_ID
            }
        })
    } else if (message_type === "voice") {
        await Telegram.instance.sendVoice({
            chat_id: GROUP_ID,
            voice: new_question.voice!.file_id,
            caption: "#AnonQuestion",
            reply_parameters: {
                message_id: message.message_id - 1,
                chat_id: GROUP_ID
            }
        })
    } else {
        console.log("Message type not supported")
        await Telegram.instance.sendMessage({
            chat_id: new_question.chat.id,
            text: "Message type not supported"
        })
    }
}

const removeAcceptAnswerButton = async (message: Message) => {
    const accessibleMessage = message as Message
    /**
     * In all other places characters '_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!' must be escaped with the preceding character '\'.
     * place \\ in front of them to escape it in a filtered string
     */
    
    const message_type = message.text !== undefined ? "text" : message.photo !== undefined ? "photo" : message.audio !== undefined ? "audio" : message.video !== undefined ? "video" : message.voice !== undefined ? "voice" : message.document !== undefined ? "document" : "text";
    console.log("Message type of Accepted Answer: ", message_type)
    if (message_type === "text") {
        const filtered_text = accessibleMessage.text!.replace(/_/g, "\\_").replace(/\*/g, "\\*").replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/~/g, "\\~").replace(/`/g, "\\`").replace(/>/g, "\\>").replace(/#/g, "\\#").replace(/\+/g, "\\+").replace(/-/g, "\\-").replace(/=/g, "\\=").replace(/\|/g, "\\|").replace(/{/g, "\\{").replace(/}/g, "\\}").replace(/\./g, "\\.").replace(/!/g, "\\!");
        await Telegram.instance.editMessageText({
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: filtered_text + "\n\n*Accepted Answer* ✅",
            parse_mode: "MarkdownV2"
        })
    } else {
        await Telegram.instance.editMessageCaption({
            chat_id: message.chat.id,
            message_id: message.message_id,
            caption: "\n\n*Accepted Answer* ✅",
            parse_mode: "MarkdownV2"
        })
    
    }
}


export const handler: Handler = async (event) => {

    try {
        const update = JSON.parse(event.body) as Update
        const { message } = update
        // on start of the bot
        if (message !== undefined && message.text === "/start") {
            await Telegram.instance.sendMessage({
                chat_id: message.chat.id,
                text: "*Welcome to the ECE 25 Telegram Bot*\\!\n\nThis bot is all about asking questions *anonymously*\\.\nGot a question\\? Just shoot a message to this bot\\.\nWanna help someone out\\?\nReply to their question with your answer\\.\n*It's super easy*\\!\n\n*Just a heads\\-up:*\n• This bot hangs out exclusively in the Campus group chat\\.\n• The creators won't know who sent the question\\, so feel free to ask without any concerns\\.\n• If you got 3 warnings from the bot, you will get banned\\!\n\n*Happy chatting and enjoy using the bot*\\!",
                parse_mode: "MarkdownV2"
            })
        }
        // check for callback query
        else if (update.callback_query !== undefined) {
            if (update.callback_query.data === "accept") {
                await AcceptAnswer(update.callback_query.message!.message_id)
                await removeAcceptAnswerButton(update.callback_query.message!)

            }
        } // if the message in private chat was replied to
        else if (message !== undefined && message.reply_to_message !== undefined && message.chat.id !== GROUP_ID) {
            if (message.chat.id !== GROUP_ID) {
                await replyToGroupAnswer(message.reply_to_message!, message)
            }
        } // if the message was sent in the group chat
        else {
            if (message !== undefined) {
                if (message.chat.id === GROUP_ID && message.reply_to_message !== undefined && message.reply_to_message.from!.id !== message.from!.id && message.reply_to_message.text !== undefined && (message.reply_to_message.text.includes("#AnonQuestion") || (message.reply_to_message.caption !== undefined ? message.reply_to_message.caption.includes("#AnonQuestion") : false))) {
                    // && message.reply_to_message.from!.id !== message.from!.id 
                    await answerQuestionHandler(message);
                }
                else if (message.chat.id !== GROUP_ID) {
                    await askQuestionHandler(message)
                }
            }
        }

    } catch (error) {
        console.log(error)


    }
    console.log("Webhook called")
    return {
        statusCode: 200
    }

}

/**
 * question: #1
 * forwardedQuestion: #2
 * answer: #3
 * forwardedAnswer: #4
 * answer2: #5
 * forwardedAnswer2: #6
 * answer3: #7
 * forwardedAnswer3: #8
 * <<Accepted answer 3>>
 * 
 * 
 */
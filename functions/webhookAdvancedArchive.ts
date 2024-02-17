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
            caption: message.caption
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
            caption: message.caption
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
            caption: message.caption
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
            caption: message.caption
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
            caption: message.caption
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

    const original_msg = await Telegram.instance.forwardMessage({
        chat_id: (message.from!.id).toString(), // Replace it later with Item.from
        from_chat_id: GROUP_ID,
        message_id: message.message_id
    })
    let message_type = message.text !== undefined ? "text" : message.photo !== undefined ? "photo" : message.audio !== undefined ? "audio" : message.video !== undefined ? "video" : message.voice !== undefined ? "voice" : message.document !== undefined ? "document" : "text";
    console.log("Answer type: ", message_type)


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

    const reactionValue: ReactionType = {
        type: "emoji",
        emoji: "👍"
    };

    await Telegram.instance.setMessageReaction({
        chat_id: GROUP_ID,
        message_id: message_id,
        reaction: [reactionValue],
        is_big: false
    });
}


const reactionHandler = async (message_id: number, dm_chat_id: number) => {

    const getCommand = new GetCommand({
        TableName: DYNAMO_DB_TABLE_NAME,
        Key: {
            id: (message_id - 1).toString(),
            type: "answer"
        }
    })

    const { Item } = await docClient.send(getCommand)

    const getCommand2 = new GetCommand({
        TableName: DYNAMO_DB_TABLE_NAME,
        Key: {
            id: Item?.question_id.toString(),
            type: "question"
        }
    })

    const Item2 = await docClient.send(getCommand2)

    console.log("Answer ID: ", message_id - 1, "\nQuestion ID: ", Item?.question_id)

    console.log("Item2 from Reaction Handler: ", Item2)

    const answer_type = Item?.message_type;
    const question_type = Item2.Item?.message_type;

    console.log("Message type from Reaction Handler: ", answer_type)

    if (answer_type === "text" &&  question_type === "text") {
        await Telegram.instance.sendMessage({
            chat_id: GROUP_ID,
            text: `*Accepted Answer* ✅\n\n*Original Question:*\n${Item?.question_text}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (answer_type === "text" && question_type === "photo") {
        await Telegram.instance.sendPhoto({
            chat_id: GROUP_ID,
            photo: Item2?.Item?.photo,
            caption: `*Accepted Answer* ✅\n\n*Original Question:*\n${Item2?.Item?.caption}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (answer_type === "text" && question_type === "audio") {
        await Telegram.instance.sendAudio({
            chat_id: GROUP_ID,
            audio: Item2?.Item?.audio!,
            caption: `*Accepted Answer* ✅`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (answer_type === "text" && question_type === "video") {
        await Telegram.instance.sendVideo({
            chat_id: GROUP_ID,
            video: Item2?.Item?.video!,
            caption: `*Accepted Answer* ✅\n\n*Original Question:*\n${Item2?.Item?.caption}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (answer_type === "text" && question_type === "document") {
        await Telegram.instance.sendDocument({
            chat_id: GROUP_ID,
            document: Item2?.Item?.document!,
            caption: `*Accepted Answer* ✅\n\n*Original Question:*\n${Item2?.Item?.caption}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (answer_type === "text" && question_type === "voice") {
        await Telegram.instance.sendVoice({
            chat_id: GROUP_ID,
            voice: Item2?.Item?.voice!,
            caption: `*Accepted Answer* ✅`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    }
    else if (answer_type === "photo") {
        await Telegram.instance.sendPhoto({
            chat_id: GROUP_ID,
            photo: Item?.photo,
            caption: `*Accepted Answer* ✅\n\n*Original Question:*\n${Item?.question_text}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (answer_type === "audio") {
        await Telegram.instance.sendAudio({
            chat_id: GROUP_ID,
            audio: Item?.audio!,
            caption: `*Accepted Answer* ✅`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (answer_type === "video") {
        await Telegram.instance.sendVideo({
            chat_id: GROUP_ID,
            video: Item?.video!,
            caption: `*Accepted Answer* ✅`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (answer_type === "document") {
        await Telegram.instance.sendDocument({
            chat_id: GROUP_ID,
            document: Item?.document!,
            caption: `*Accepted Answer* ✅\n\n*Original Question:*\n${Item?.question_text}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (answer_type === "voice") {
        await Telegram.instance.sendVoice({
            chat_id: GROUP_ID,
            voice: Item?.voice!,
            caption: `*Accepted Answer* ✅`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else {
        console.log("Message type not supported")
        await Telegram.instance.sendMessage({
            chat_id: dm_chat_id,
            text: "Message type not supported"
        })
    }

    await setReactionHandler(message_id - 1)
}

export const handler: Handler = async (event) => {

    try {
        const update = JSON.parse(event.body) as Update
        const { message } = update

        if (message !== undefined) {
            if (message.chat.id === GROUP_ID) {
                await answerQuestionHandler(message);
            }
            else {
                await askQuestionHandler(message)
            }
        }
        else if (update.message_reaction !== undefined) {
            const reactionValue: ReactionType = {
                type: "emoji",
                emoji: "👍"
            };

            if (update.message_reaction.chat.id !== GROUP_ID && JSON.stringify(update.message_reaction.new_reaction[0]) === JSON.stringify(reactionValue)) {
                // Get the message ID from the database that has the same text as the message reacted to
                await reactionHandler(update.message_reaction.message_id, update.message_reaction.chat.id)
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
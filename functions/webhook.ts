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

    // determine the message type whether is a video, audio, photo, or text
    // if it is a video, audio, or photo, forward the message to the group
    // if it is a text, save the message to the database
    // then send the message to the group

    const message_type = message.text !== undefined ? "text" : message.photo !== undefined ? "photo" : message.audio !== undefined ? "audio" : message.video !== undefined ? "video" : message.voice !== undefined ? "voice" : message.document !== undefined ? "document" : "text";
    console.log("Message type: ", message_type)
    const id = message.message_id.toString();

    if (message_type === "text") {
    const putCommand = new PutCommand({
        TableName: DYNAMO_DB_TABLE_NAME,
        Item: {
            id,
            text: message.text,
            from: message.from!.id,
            type: "question"


        }
    })
    const a= await docClient.send(putCommand);

    await Telegram.instance.sendMessage({
        chat_id: GROUP_ID,
        text: `${message.text}\n\n#AnonQuestion`
    })
    }
    else {
         if (message_type === "photo") {
            const putCommand = new PutCommand({
                TableName: DYNAMO_DB_TABLE_NAME,
                Item: {
                    id,
                    photo: message.photo![0].file_id,
                    from: message.from!.id,
                    type: "question"
                }
            })
            await docClient.send(putCommand);
            await Telegram.instance.sendPhoto({
                chat_id: GROUP_ID,
                photo: message.photo![0].file_id
            })
        } else if (message_type === "audio") {
            const putCommand = new PutCommand({
                TableName: DYNAMO_DB_TABLE_NAME,
                Item: {
                    id,
                    audio: message.audio!.file_id,
                    from: message.from!.id,
                    type: "question"
                }
            })
            await docClient.send(putCommand);
            await Telegram.instance.sendAudio({
                chat_id: GROUP_ID,
                audio: message.audio!.file_id
            })
        } else if (message_type === "video") {
            const putCommand = new PutCommand({
                TableName: DYNAMO_DB_TABLE_NAME,
                Item: {
                    id,
                    video: message.video!.file_id,
                    from: message.from!.id,
                    type: "question"
                }
            })
            await docClient.send(putCommand);
            await Telegram.instance.sendVideo({
                chat_id: GROUP_ID,
                video: message.video!.file_id
            })
        } 
        else if (message_type === "document") {
            const putCommand = new PutCommand({
                TableName: DYNAMO_DB_TABLE_NAME,
                Item: {
                    id,
                    document: message.document!.file_id,
                    from: message.from!.id,
                    type: "question"
                }
            })
            await docClient.send(putCommand);
            await Telegram.instance.sendDocument({
                chat_id: GROUP_ID,
                document: message.document!.file_id
            })
        } else if (message_type === "voice") {
            const putCommand = new PutCommand({
                TableName: DYNAMO_DB_TABLE_NAME,
                Item: {
                    id,
                    voice: message.voice!.file_id,
                    from: message.from!.id,
                    type: "question"
                }
            })
            await docClient.send(putCommand);
            await Telegram.instance.sendVoice({
                chat_id: GROUP_ID,
                voice: message.voice!.file_id
            })
        } else {
            console.log("Message type not supported")
            await Telegram.instance.sendMessage({
                chat_id: message.chat.id,
                text: "Message type not supported"
            })
        }
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
            id: (message.reply_to_message!.message_id-1).toString(),
            type: "question"
        }
    })

    const { Item } = await docClient.send(getCommand)

    const original_msg = await Telegram.instance.forwardMessage({
        chat_id: (message.from!.id).toString(), // Replace it later with Item.from
        from_chat_id: GROUP_ID,
        message_id: message.message_id
    })
    const message_type = message.text !== undefined ? "text" : message.photo !== undefined ? "photo" : message.audio !== undefined ? "audio" : message.video !== undefined ? "video" : message.voice !== undefined ? "voice" : message.document !== undefined ? "document" : "text";
    if (message_type === "text") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id-1).toString(),
                question_text: Item?.text,
                text: message.text,
                from: message.from!.id,
                type: "answer"
            }
            // return message ID and chat ID
        })

        await docClient.send(putCommand);
    } else if (message_type === "photo") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id-1).toString(),
                question_text: Item?.text,
                photo: message.photo![0].file_id,
                from: message.from!.id,
                type: "answer"
            }
        })
        await docClient.send(putCommand);
    } else if (message_type === "audio") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id-1).toString(),
                question_text: Item?.text,
                audio: message.audio!.file_id,
                from: message.from!.id,
                type: "answer"
            }
        })
        await docClient.send(putCommand);
    } else if (message_type === "video") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id-1).toString(),
                question_text: Item?.text,
                video: message.video!.file_id,
                from: message.from!.id,
                type: "answer"
            }
        })
        await docClient.send(putCommand);
    } else if (message_type === "document") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id-1).toString(),
                question_text: Item?.text,
                document: message.document!.file_id,
                from: message.from!.id,
                type: "answer"
            }
        })
        await docClient.send(putCommand);
    } else if (message_type === "voice") {
        const putCommand = new PutCommand({
            TableName: DYNAMO_DB_TABLE_NAME,
            Item: {
                id: message.message_id.toString(),
                question_id: (message.reply_to_message!.message_id-1).toString(),
                question_text: Item?.text,
                voice: message.voice!.file_id,
                from: message.from!.id,
                type: "answer"
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


const getBotInfo = async () => {
    const response = await Telegram.instance.getMe();
    // console.log(response)

    return response
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


const reactionHandler = async (message_id: number) => {

    const getCommand = new GetCommand({
        TableName: DYNAMO_DB_TABLE_NAME,
        Key: {
            id: (message_id-1).toString(),
            type: "answer"
        }
    })

    const { Item } = await docClient.send(getCommand)

    console.log("Item from Reaction Handler: ", Item)

    const message_type = Item?.voice !== undefined ? "voice" : Item?.photo !== undefined ? "photo" : Item?.audio !== undefined ? "audio" : Item?.video !== undefined ? "video" : Item?.document !== undefined ? "document" : "text";
    console.log("Message type from Reaction Handler: ", message_type)
    if (message_type === "text") {
        await Telegram.instance.sendMessage({
            chat_id: GROUP_ID,
            text: `*Confirmed Answer* ✅\n\n*Original Question:*\n${Item?.question_text}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (message_type === "photo") {
        await Telegram.instance.sendPhoto({
            chat_id: GROUP_ID,
            photo: Item?.photo!,
            caption: `*Confirmed Answer* ✅\n\n*Original Question:*\n${Item?.question_text}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (message_type === "audio") {
        await Telegram.instance.sendAudio({
            chat_id: GROUP_ID,
            audio: Item?.audio!,
            caption: `*Confirmed Answer* ✅\n\n*Original Question:*\n${Item?.question_text}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (message_type === "video") {
        await Telegram.instance.sendVideo({
            chat_id: GROUP_ID,
            video: Item?.video!,
            caption: `*Confirmed Answer* ✅\n\n*Original Question:*\n${Item?.question_text}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (message_type === "document") {
        await Telegram.instance.sendDocument({
            chat_id: GROUP_ID,
            document: Item?.document!,
            caption: `*Confirmed Answer* ✅\n\n*Original Question:*\n${Item?.question_text}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else if (message_type === "voice") {
        await Telegram.instance.sendVoice({
            chat_id: GROUP_ID,
            voice: Item?.voice!,
            caption: `*Confirmed Answer* ✅\n\n*Original Question:*\n${Item?.question_text}`,
            reply_parameters: {
                message_id: message_id - 1,
                chat_id: GROUP_ID
            },
            parse_mode: "MarkdownV2"
        })
    } else {
        console.log("Message type not supported")
        await Telegram.instance.sendMessage({
            chat_id: GROUP_ID,
            text: "Message type not supported"
        })
    }

    await setReactionHandler(message_id-1)
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
                await reactionHandler(update.message_reaction.message_id)
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
import { Handler } from "aws-lambda";
import Update from "../interfaces/Update";
import Telegram from "../libs/telegram";
import Message from "../interfaces/Message";
import ReactionType from "../interfaces/ReactionType";
import { DYNAMO_DB_TABLE_NAME, GROUP_ID } from "../constants";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import generateId from "../libs/genrateId";


const client = new DynamoDBClient({
    region: "eu-west-3",
    credentials: {
        accessKeyId: 'AKIAWRCFDXA7Y3434OWL',
        secretAccessKey: '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'
    }
});
const docClient = DynamoDBDocumentClient.from(client);

const askQuestionHandler = async (message: Message) => {

    const id = generateId()
    const putCommand = new PutCommand({
        TableName: DYNAMO_DB_TABLE_NAME,
        Item: {
            id,
            text: message.text,
            from: message.from!.id,
            type: "question"


        }
    })




    // const a= await docClient.send(putCommand);

    // console.log(a)


    await Telegram.instance.sendMessage({
        chat_id: GROUP_ID,
        text: `Question: #${id}\n#AnonQuestion\n\n${message.text}`,

    })

}

const getIdFromQuestionMessage = (message: Message): string => {
    const entitie = message.entities!.find(entity => entity.type === "hashtag")!


    return message.text!.slice(entitie.offset + 1, entitie.offset + entitie.length);
}

const answerQuestionHandler = async(message: Message) => {

    console.log(message.reply_to_message)
    console.log(getIdFromQuestionMessage(message.reply_to_message!))
    const getCommand = new GetCommand({
        TableName: DYNAMO_DB_TABLE_NAME,
        Key: {
            id: getIdFromQuestionMessage(message.reply_to_message!),
            type: "question"
        }
    })

    const {Item} = await docClient.send(getCommand)

    console.log(Item)

    await Telegram.instance.forwardMessage({
        chat_id: (message.from!.id).toString(), // Replace it later with Item.from
        from_chat_id: GROUP_ID,
        message_id: message.message_id  
    })
    const putCommand = new PutCommand({
        TableName: DYNAMO_DB_TABLE_NAME,
        Item: {
            id:generateId(),
            text: message.text,
            from: message.from!.id,
            type: "answer"
        }
    })

    await docClient.send(putCommand);
}


const reactionsHandler = async (message: Message) => {

    console.log("Reactions handler called")

    if (message.reply_to_message !== undefined) {
        const reactionValue: ReactionType = {
            type: "emoji",
            emoji: "👍"
        };

        await Telegram.instance.setMessageReaction({
            chat_id: GROUP_ID,
            message_id: message.message_id,
            reaction: [reactionValue],
            is_big: false
        });
        console.log("Reaction sent")
    }

}

export const handler: Handler = async (event) => {

    try {
        const update = JSON.parse(event.body) as Update

        console.log(update)

        const { message } = update

        if (message !== undefined)
            if (message.chat.id === GROUP_ID) {
                if (message.reply_to_message !== undefined) {
                        await reactionsHandler(message);
                        await answerQuestionHandler(message);
                    }
                }
             else {
                await askQuestionHandler(message)
            }

    } catch (error) {
        console.log(error)


    }
    console.log("Webhook called")
    return {
        statusCode: 200
    }

}

import ForwardMessageParameters from "../interfaces/ForwardMessageParameters";
import SendMessageParameters from "../interfaces/SendMessageParameters";
import SetMessageReactionParameters from "../../campus-telegram-bot/interfaces/SetMessageReactionParameters";
import axiosInstance from "./axios";
import Chat from "../interfaces/Chat";
import SendAudio from "../interfaces/SendAudio";
import SendDocument from "../interfaces/SendDocument";
import SendPhoto from "../interfaces/SendPhoto";
import SendVideo from "../interfaces/SendVideo";
import SendVoice from "../interfaces/SendVoice";
import CopyMessage from "../interfaces/copyMessage";
import EditMessageText from "../interfaces/editMessageText";
import EditMessageReplyMarkup from "../interfaces/editMessageReplyMarkup";
import EditMessageCaption from "../interfaces/EditMessageCaption";

class Telegram{
    static readonly instance = new Telegram()
    
    private constructor(){ }

    async sendMessage(body: SendMessageParameters){ 
        await axiosInstance({
            url: "/sendMessage",
            data: body
        })
    }

    async forwardMessage(body: ForwardMessageParameters){

        const response = await axiosInstance({
            url: "/forwardMessage",
            data: body
        })
        return response.data
    }

    async setMessageReaction(body: SetMessageReactionParameters){
        await axiosInstance({
            url: "/setMessageReaction",
            data: body
        })
    }

    async getMe(){
        const response = await axiosInstance({
            url: "/getMe"
        })
        return response.data
    }

    async getChat(body: Chat){
        const response = await axiosInstance({
            url: "/getChat",
            data: body
        })
        return response.data
    }

    async sendPhoto(body: SendPhoto){
        await axiosInstance({
            url: "/sendPhoto",
            data: body
        })
    }

    async sendAudio(body: SendAudio){
        await axiosInstance({
            url: "/sendAudio",
            data: body
        })
    }

    async sendDocument(body: SendDocument){
        await axiosInstance({
            url: "/sendDocument",
            data: body
        })
    }

    async sendVideo(body: SendVideo){
        await axiosInstance({
            url: "/sendVideo",
            data: body
        })
    }

    async sendVoice(body: SendVoice){
        await axiosInstance({
            url: "/sendVoice",
            data: body
        })
    }

    async copyMessage(body: CopyMessage){
        const response = await axiosInstance({
            url: "/copyMessage",
            data: body
        })
        return response.data
    }

    async editMessageText(body: EditMessageText){
        await axiosInstance({
            url: "/editMessageText",
            data: body
        })
    }

    async editMessageReplyMarkup(body: EditMessageReplyMarkup){
        await axiosInstance({
            url: "/editMessageReplyMarkup",
            data: body
        })
    }

    async editMessageCaption(body: EditMessageCaption){
        await axiosInstance({
            url: "/editMessageCaption",
            data: body
        })
    }
}


export default Telegram
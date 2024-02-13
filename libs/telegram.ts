
import ForwardMessageParameters from "../interfaces/ForwardMessageParameters";
import SendMessageParameters from "../interfaces/SendMessageParameters";
import axiosInstance from "./axios";

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

        await axiosInstance({
            url: "/forwardMessage",
            data: body
        })
    }

}


export default Telegram
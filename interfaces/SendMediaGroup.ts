import ReplyParameters from "./ReplyParameters";
import InputMediaPhoto from "./InputMediaPhoto";
import InputMediaVideo from "./InputMediaVideo";
import InputMediaAudio from "./InputMediaAudio";
import InputMediaDocument from "./InputMediaDocument";

interface SendMediaGroup {
    chat_id: number | string;
    message_thread_id?: number;
    media: (InputMediaPhoto | InputMediaVideo | InputMediaAudio | InputMediaDocument)[];
    disable_notification?: boolean;
    protect_content?: boolean;
    reply_parameters?: ReplyParameters;
}

export default SendMediaGroup;
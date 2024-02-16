import MessageEntity from "./MessageEntity";
import ReplyParameters from "./ReplyParameters";

interface SendAudio {
    chat_id: number | string;
    message_thread_id?: number;
    audio: string;
    caption?: string;
    parse_mode?: string;
    caption_entities?: MessageEntity[];
    duration?: number;
    performer?: string;
    title?: string;
    thumbnail?: string;
    disable_notification?: boolean;
    protect_content?: boolean;
    reply_parameters?: ReplyParameters;
    // reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
}

export default SendAudio;
import MessageEntity from "./MessageEntity";
import ReplyParameters from "./ReplyParameters";

interface SendVoice {
    chat_id: number | string;
    message_thread_id?: number;
    voice: string;
    caption?: string;
    parse_mode?: string;
    caption_entities?: MessageEntity[];
    duration?: number;
    disable_notification?: boolean;
    protect_content?: boolean;
    reply_parameters?: ReplyParameters;
    // reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
}

export default SendVoice;
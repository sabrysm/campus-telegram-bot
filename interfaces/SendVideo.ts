import MessageEntity from "./MessageEntity";
import ReplyParameters from "./ReplyParameters";

interface SendVideo {
    chat_id: number | string;
    message_thread_id?: number;
    video: string;
    duration?: number;
    width?: number;
    height?: number;
    thumbnail?: string;
    caption?: string;
    parse_mode?: string;
    caption_entities?: MessageEntity[];
    has_spoiler?: boolean;
    supports_streaming?: boolean;
    disable_notification?: boolean;
    protect_content?: boolean;
    reply_parameters?: ReplyParameters;
    // reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
}

export default SendVideo;
import MessageEntity from "./MessageEntity";
import ReplyParameters from "./ReplyParameters";

interface SendDocument {
    chat_id: number | string;
    message_thread_id?: number;
    document: string;
    thumbnail?: string;
    caption?: string;
    parse_mode?: string;
    caption_entities?: MessageEntity[];
    disable_content_type_detection?: boolean;
    disable_notification?: boolean;
    protect_content?: boolean;
    reply_parameters?: ReplyParameters;
    // reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
}

export default SendDocument;
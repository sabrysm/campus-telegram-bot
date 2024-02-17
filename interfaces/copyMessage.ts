import MessageEntity from "./MessageEntity";
import ReplyParameters from "./ReplyParameters";
import InlineKeyboardMarkup from "./InlineKeyboardMarkup";
import ForceReply from "./ForceReply";

interface CopyMessage {
    chat_id: number | string;
    // message_thread_id: number;
    from_chat_id: number;
    message_id: number;
    caption?: string;
    parse_mode?: string;
    caption_entities?: MessageEntity[];
    disable_notification?: boolean;
    protect_content?: boolean;
    reply_parameters?: ReplyParameters;
    reply_markup?: InlineKeyboardMarkup | ForceReply;
}

export default CopyMessage;
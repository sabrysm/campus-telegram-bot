import InlineKeyboardMarkup from "./InlineKeyboardMarkup";
import MessageEntity from "./MessageEntity";

interface EditMessageCaption {
    chat_id: number | string;
    message_id: number;
    inline_message_id?: string;
    caption: string;
    parse_mode?: string;
    caption_entities?: MessageEntity[];
    reply_markup?: InlineKeyboardMarkup;
}

export default EditMessageCaption;
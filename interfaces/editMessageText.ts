import MessageEntity from "./MessageEntity";
import InlineKeyboardMarkup from "./InlineKeyboardMarkup";

interface EditMessageText {
  chat_id: number | string;
  message_id: number;
  inline_message_id?: string;
  text: string;
  parse_mode?: string;
  entities?: MessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
}

export default EditMessageText;

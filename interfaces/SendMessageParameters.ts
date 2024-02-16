import MessageEntity from "./MessageEntity";
import ReplyParameters from "./ReplyParameters";

interface SendMessageParameters {
  chat_id: number | string;
  message_thread_id?: number;
  text: string;
  parse_mode?: string;
  entities?: MessageEntity[];
  // link_preview_options?: LinkPreviewOptions;
  disable_notification?: boolean;
  protect_content?: boolean;
  reply_parameters?: ReplyParameters;
  // reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
}

export default SendMessageParameters
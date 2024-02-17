import MessageEntity from "./MessageEntity";
import ReplyParameters from "./ReplyParameters";
import ForceReply from "./ForceReply";
import InlineKeyboardMarkup from "./InlineKeyboardMarkup";

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
  reply_markup?: InlineKeyboardMarkup | ForceReply;
}

export default SendMessageParameters;
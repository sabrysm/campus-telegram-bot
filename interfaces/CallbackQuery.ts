import User from "./User";
import Message from "./Message";
import InaccessibleMessage from "./InaccessibleMessage";

interface CallbackQuery {
    id: string,
    from: User,
    message: Message | InaccessibleMessage,
    inline_message_id: string,
    chat_instance: string,
    data: string,
    game_short_name: string
}

export default CallbackQuery;
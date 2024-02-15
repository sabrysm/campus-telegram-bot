import ReactionType from "../../campus-telegram-bot/interfaces/ReactionType";

interface setMessageReactionParameters {
  chat_id: number | string;
  message_id?: number;
  reaction: ReactionType[];
  is_big?: boolean;
}

export default setMessageReactionParameters
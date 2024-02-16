import Chat from "./Chat";
import User from "./User";
import ReactionType from "./ReactionType";

interface MessageReactionUpdated {
    chat: Chat; // The chat containing the message the user reacted to
    message_id: number; // Unique identifier of the message inside the chat
    user?: User; // The user that changed the reaction, if the user isn't anonymous
    actor_chat?: Chat; // The chat on behalf of which the reaction was changed, if the user is anonymous
    date: number; // Date of the change in Unix time
    old_reaction: ReactionType[]; // Previous list of reaction types that were set by the user
    new_reaction: ReactionType[]; // New list of reaction types that were set by the user
  }

export default MessageReactionUpdated
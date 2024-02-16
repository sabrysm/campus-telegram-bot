import Message from "./Message";
import MessageReactionUpdated from "./MessageReactionUpdated";

interface Update {
    update_id: number; // The update's unique identifier
    message?: Message; // New incoming message
    edited_message?: Message; // New version of a message that was edited
    channel_post?: Message; // New incoming channel post
    edited_channel_post?: Message; // New version of a channel post that was edited
    message_reaction?: MessageReactionUpdated; // A reaction to a message was changed by a user
    // message_reaction_count?: MessageReactionCountUpdated; // Reactions to a message with anonymous reactions were changed
    // inline_query?: InlineQuery; // New incoming inline query
    // chosen_inline_result?: ChosenInlineResult; // The result of an inline query that was chosen by a user
    // callback_query?: CallbackQuery; // New incoming callback query
    // shipping_query?: ShippingQuery; // New incoming shipping query
    // pre_checkout_query?: PreCheckoutQuery; // New incoming pre-checkout query
    // poll?: Poll; // New poll state
    // poll_answer?: PollAnswer; // A user changed their answer in a non-anonymous poll
    // my_chat_member?: ChatMemberUpdated; // The bot's chat member status was updated in a chat
    // chat_member?: ChatMemberUpdated; // A chat member's status was updated in a chat
    // chat_join_request?: ChatJoinRequest; // A request to join the chat has been sent
    // chat_boost?: ChatBoostUpdated; // A chat boost was added or changed
    // removed_chat_boost?: ChatBoostRemoved; // A boost was removed from a chat
  }

  export default Update
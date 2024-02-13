import Message from "./Message";
import ReactionType from "./ReactionType";

interface Chat {
    id: number;
    type: "private" | "group" | "supergroup" | "channel";
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    is_forum?: boolean;
    // photo?: ChatPhoto;
    active_usernames?: string[];
    available_reactions?: ReactionType[];
    accent_color_id?: number;
    background_custom_emoji_id?: string;
    profile_accent_color_id?: number;
    profile_background_custom_emoji_id?: string;
    emoji_status_custom_emoji_id?: string;
    emoji_status_expiration_date?: number;
    bio?: string;
    has_private_forwards?: boolean;
    has_restricted_voice_and_video_messages?: boolean;
    join_to_send_messages?: boolean;
    join_by_request?: boolean;
    description?: string;
    invite_link?: string;
    pinned_message?: Message;
    // permissions?: ChatPermissions;
    slow_mode_delay?: number;
    message_auto_delete_time?: number;
    has_aggressive_anti_spam_enabled?: boolean;
    has_hidden_members?: boolean;
    has_protected_content?: boolean;
    has_visible_history?: boolean;
    sticker_set_name?: string;
    can_set_sticker_set?: boolean;
    linked_chat_id?: number;
    // location?: ChatLocation;
}

export default Chat
  

  
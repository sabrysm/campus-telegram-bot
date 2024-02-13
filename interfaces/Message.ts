import Audio from "./Audio";
import Chat from "./Chat";
import Document from "./Document";
import MessageEntity from "./MessageEntity";
import PhotoSize from "./PhotoSize";
import User from "./User";
import Video from "./Video";
import VideoNote from "./VideoNote";
import Voice from "./Voice";

interface Message {
    message_id: number;
    message_thread_id?: number;
    from?: User;
    sender_chat?: Chat;
    date: number;
    chat: Chat;
    // forward_origin?: MessageOrigin;
    is_topic_message?: boolean;
    is_automatic_forward?: boolean;
    reply_to_message?: Message;
    // external_reply?: ExternalReplyInfo;
    // quote?: TextQuote;
    via_bot?: User;
    edit_date?: number;
    has_protected_content?: boolean;
    media_group_id?: string;
    author_signature?: string;
    text?: string;
    entities?: MessageEntity[];
    // link_preview_options?: LinkPreviewOptions;
    // animation?: Animation;
    audio?: Audio;
    document?: Document;
    photo?: PhotoSize[];
    // sticker?: Sticker;
    // story?: Story;
    video?: Video;
    video_note?: VideoNote;
    voice?: Voice;
    caption?: string;
    caption_entities?: MessageEntity[];
    has_media_spoiler?: boolean;
    // contact?: Contact;
    // dice?: Dice;
    // game?: Game;
    // poll?: Poll;
    // venue?: Venue;
    // location?: Location;
    new_chat_members?: User[];
    left_chat_member?: User;
    new_chat_title?: string;
    new_chat_photo?: PhotoSize[];
    delete_chat_photo?: boolean;
    group_chat_created?: boolean;
    supergroup_chat_created?: boolean;
    channel_chat_created?: boolean;
    // message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged;
    // migrate_to_chat_id?: number;
    // migrate_from_chat_id?: number;
    // pinned_message?: MaybeInaccessibleMessage;
    // invoice?: Invoice;
    // successful_payment?: SuccessfulPayment;
    // users_shared?: UsersShared;
    // chat_shared?: ChatShared;
    // connected_website?: string;
    // write_access_allowed?: WriteAccessAllowed;
    // passport_data?: PassportData;
    // proximity_alert_triggered?: ProximityAlertTriggered;
    // forum_topic_created?: ForumTopicCreated;
    // forum_topic_edited?: ForumTopicEdited;
    // forum_topic_closed?: ForumTopicClosed;
    // forum_topic_reopened?: ForumTopicReopened;
    // general_forum_topic_hidden?: GeneralForumTopicHidden;
    // general_forum_topic_unhidden?: GeneralForumTopicUnhidden;
    // giveaway_created?: GiveawayCreated;
    // giveaway?: Giveaway;
    // giveaway_winners?: GiveawayWinners;
    // giveaway_completed?: GiveawayCompleted;
    // video_chat_scheduled?: VideoChatScheduled;
    // video_chat_started?: VideoChatStarted;
    // video_chat_ended?: VideoChatEnded;
    // video_chat_participants_invited?: VideoChatParticipantsInvited;
    // web_app_data?: WebAppData;
    // reply_markup?: InlineKeyboardMarkup;
}
  

export default  Message
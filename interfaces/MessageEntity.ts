import User from "./User";

interface MessageEntity {
    type: string; // Type of the entity
    offset: number; // Offset in UTF-16 code units to the start of the entity
    length: number; // Length of the entity in UTF-16 code units
    url?: string; // URL that will be opened after user taps on the text (for "text_link" only)
    user?: User; // Mentioned user (for "text_mention" only)
    language?: string; // Programming language of the entity text (for "pre" only)
    custom_emoji_id?: string; // Unique identifier of the custom emoji (for "custom_emoji" only)
}

export default MessageEntity
import MessageEntity from "./MessageEntity";

interface InputMediaDocument {
    type: string;
    media: string;
    thumbnail?: string;
    caption?: string;
    parse_mode?: string;
    caption_entities?: MessageEntity[];
    disable_content_type_detection?: boolean;
}

export default InputMediaDocument;
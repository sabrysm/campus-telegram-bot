import MessageEntity from "./MessageEntity";

interface InputMediaPhoto {
    type: string;
    media: string;
    caption?: string;
    parse_mode?: string;
    caption_entities?: MessageEntity[];
    has_spoiler?: boolean;
}

export default InputMediaPhoto;
import MessageEntity from "./MessageEntity";

interface InputMediaVideo {
    type: string;
    media: string;
    thumbnail?: string;
    caption?: string;
    parse_mode?: string;
    caption_entities?: MessageEntity[];
    width?: number;
    height?: number;
    duration?: number;
    supports_streaming?: boolean;
    has_spoiler?: boolean;
}

export default InputMediaVideo;
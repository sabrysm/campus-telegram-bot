import MessageEntity from "./MessageEntity";

interface InputMediaAudio {
    type: string;
    media: string;
    thumbnail?: string;
    caption?: string;
    parse_mode?: string;
    caption_entities?: MessageEntity[];
    duration?: number;
    performer?: string;
    title?: string;
}

export default InputMediaAudio;
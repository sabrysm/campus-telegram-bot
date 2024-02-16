import MessageEntity from "./MessageEntity";

interface TextQuote {
    text: string;
    entities?: MessageEntity[];
    position: number;
    is_manual: boolean;
}

export default TextQuote;
interface ReactionTypeEmoji {
    type: "emoji";
    emoji: string; // Reaction emoji
}

interface ReactionTypeCustomEmoji {
type: "custom_emoji";
custom_emoji_id: string; // Custom emoji identifier
}

type ReactionType = ReactionTypeEmoji | ReactionTypeCustomEmoji;

export default ReactionType
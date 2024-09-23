import emojiMap from 'emojilib';

export const emojiList = Object.keys(emojiMap);

const emojiCache: Record<string, string> = {};

export const searchEmoji = (query: string, one = false): string[] => {
	if (!query) return emojiList;

	const search = query.replaceAll(/(^\:)|(\:$)/g, '').toLowerCase();
	console.log('searchEmoji', search);

	const emojis: string[] = [];
	let found = false;
	for (const [emoji, words] of Object.entries(emojiMap)) {
		for (const word of words) {
			if (word.includes(search)) {
				emojis.push(emoji);
				found = true;
				break;
			}
		}
		if (found && one) {
			console.log('searchEmoji', emojis);

			return emojis;
		}
	}
	return emojis;
};

export const convertEmoji = (keyword: string): string | null => {
	if (emojiCache[keyword]) {
		return emojiCache[keyword];
	}
	const emojis = searchEmoji(keyword, true);
	const emoji = emojis.at(0);
	if (emoji) {
		emojiCache[keyword] = emoji;
	}
	return emoji ?? null;
};

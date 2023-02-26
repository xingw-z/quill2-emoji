import emojiList from "./emoji-list";

const emojiMap: any = {};

emojiList.forEach((emojiListObject) => {
    emojiMap[emojiListObject.name] = emojiListObject;
});

export default emojiMap;
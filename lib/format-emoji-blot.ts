import Quill from 'quill';
const Embed = Quill.import('blots/embed');
import emojiMap from "./emoji-map";

class EmojiBlot extends Embed {
  static create(value: any) {
    let node = super.create();
    if (typeof value === 'object') {

      EmojiBlot.buildSpan(value, node);
    } else if (typeof value === "string") {
      const valueObj = emojiMap[value];

      if (valueObj) {
        EmojiBlot.buildSpan(valueObj, node);
      }
    }

    return node;
  }

  static value(node: any) {
    return node.dataset.name;
  }

  static buildSpan(value: any, node: any) {
    node.setAttribute('data-name', value.name);
    let emojiSpan = document.createElement('span');
    emojiSpan.classList.add(this.emojiClass);
    emojiSpan.classList.add(this.emojiPrefix + value.name);
    // unicode can be '1f1f5-1f1ea',see emoji-list.js.
    emojiSpan.innerText = String.fromCodePoint(...EmojiBlot.parseUnicode(value.unicode));
    node.appendChild(emojiSpan);
  }
  static parseUnicode(string: string) {
    return string.split('-').map(str => parseInt(str, 16));
  }
}

EmojiBlot.blotName = 'emoji';
EmojiBlot.className = 'ql-emojiblot';
EmojiBlot.tagName = 'span';
EmojiBlot.emojiClass = 'ap';
EmojiBlot.emojiPrefix = 'ap-';

export default EmojiBlot;
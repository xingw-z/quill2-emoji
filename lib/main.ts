import Quill from 'quill';
import EmojiBlot from './format-emoji-blot';
import ToolbarEmoji from './module-toolbar-emoji';
import './style/quill-emoji.less';

Quill.register({
  'formats/emoji': EmojiBlot,
  'modules/emoji-toolbar': ToolbarEmoji,
}, true);  

export { EmojiBlot, ToolbarEmoji };
import Quill from 'quill';
// import * as Emoji from "../lib/main";
// @ts-ignore
import { EmojiBlot, ToolbarEmoji } from "../dist";
import '../dist/style.css'
import 'quill/dist/quill.snow.css';

Quill.register({
  'formats/emoji': EmojiBlot,
  'modules/emoji-toolbar': ToolbarEmoji,
}, true);  

// Quill.register("modules/emoji", Emoji);

new Quill('#editor', {
  modules: { 
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
    
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
    
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
    
      ['emoji', 'clean']                                         // remove formatting button
    ],
    'emoji-toolbar': true,
  },
  theme: 'snow',
});
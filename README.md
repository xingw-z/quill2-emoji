# quill2-emoji
quill2 version emoji

# Install

```bash
npm install quill2-emoji
```

# Usage

```js
import * as Emoji from "quill2-emoji";
import 'quill2-emoji/dist/style.css';


Quill.register("modules/emoji", Emoji);

new Quill('#editor', {
  modules: { 
    'emoji-toolbar': true,
  },
});
```

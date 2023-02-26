import Quill from 'quill';
import Fuse from 'fuse.js';
import emojiList from './emoji-list.js';

const Module = Quill.import('core/module');

class ToolbarEmoji extends Module {
  constructor(quill: Quill, options: any) {
    super(quill, options);

    this.quill = quill;
    this.toolbar = quill.getModule('toolbar');
    if (typeof this.toolbar !== 'undefined')
      this.toolbar.addHandler('emoji', this.checkPaletteExists);

    var emojiBtns = document.getElementsByClassName('ql-emoji');
    if (emojiBtns) {
      [].slice.call(emojiBtns).forEach(function (emojiBtn: any) {
        emojiBtn.innerHTML = options.buttonIcon;
      });
    }
  }

  checkPaletteExists() {
    let quill = this.quill;
    fn_checkDialogOpen(quill);
    // @ts-ignore
    this.quill.on('text-change', function (delta: any, oldDelta: any, source: any) {
      if (source === 'user') {
        fn_close();
      }
    });
  }
}

ToolbarEmoji.DEFAULTS = {
  buttonIcon: '<svg viewbox="0 0 18 18"><circle class="ql-fill" cx="7" cy="7" r="1"></circle><circle class="ql-fill" cx="11" cy="7" r="1"></circle><path class="ql-stroke" d="M7,10a2,2,0,0,0,4,0H7Z"></path><circle class="ql-stroke" cx="9" cy="9" r="6"></circle></svg>'
};

function fn_close() {
  let ele_emoji_plate = document.getElementById('emoji-palette');
  document.getElementById('emoji-close-div')!.style.display = "none";
  if (ele_emoji_plate) {
    ele_emoji_plate.remove()
  }
}

function fn_checkDialogOpen(quill: Quill) {
  let elementExists = document.getElementById("emoji-palette");
  if (elementExists) {
    elementExists.remove();
  } else {
    fn_showEmojiPalette(quill);
  }
}

function fn_showEmojiPalette(quill: Quill) {
  // const paletteWidthAndHeight = 250;
  const paletteWidth = 356;
  const paletteHeight = 258;
  let ele_emoji_area = document.createElement('div');
  let selection = quill.getSelection();
  const selectionBounds = quill.getBounds(selection!.index);
  const editorBounds = (quill as any).container.getBoundingClientRect();
  const selectionCenter = (selectionBounds.left + selectionBounds.right) / 2;
  const selectionMiddle = (selectionBounds.top + selectionBounds.bottom) / 2;
  const toolbarBounds = (quill as any)?.theme?.modules?.toolbar?.container.querySelector('.ql-emoji').getBoundingClientRect?.();
  function getPaletteLeft () { // 处理 emoji 浮窗 的 left 距离
    // const beforePaletteLeft = editorBounds.left + selectionCenter + paletteWidthAndHeight <= document.documentElement.clientWidth ? selectionCenter : editorBounds.left - paletteWidthAndHeight;
    const beforePaletteLeft = editorBounds.left + selectionCenter + paletteWidth <= document.documentElement.clientWidth ? selectionCenter : editorBounds.left - paletteWidth;
    const maxPaletteLeft = editorBounds.width > paletteWidth ? editorBounds.width - paletteWidth : 0; // 如果 整个富文本都没有 emoji 浮窗大 那就 靠最左边
    if (toolbarBounds) {
      const leftVal = toolbarBounds.left - editorBounds.left;
      return leftVal > maxPaletteLeft ? maxPaletteLeft : leftVal;
    }
    return beforePaletteLeft > maxPaletteLeft ? maxPaletteLeft : beforePaletteLeft;  
  }
  const paletteLeft = getPaletteLeft();
  function getPaletteTop () { // 处理 emoji 浮窗 的 top 距离
    if (toolbarBounds) {
      return toolbarBounds.top - editorBounds.top + toolbarBounds.height;
    }
    // const beforePaletteTop = editorBounds.top + selectionMiddle + paletteWidthAndHeight + 10 <= document.documentElement.clientHeight ? selectionMiddle + 10 :
    // editorBounds.top + selectionMiddle - paletteWidthAndHeight - 10 >= 0 ? selectionMiddle - paletteWidthAndHeight - 10 :
    //   document.documentElement.clientHeight - paletteWidthAndHeight - editorBounds.top;
    const beforePaletteTop = editorBounds.top + selectionMiddle + paletteHeight + 10 <= document.documentElement.clientHeight ? selectionMiddle + 10 :
      editorBounds.top + selectionMiddle - paletteHeight - 10 >= 0 ? selectionMiddle - paletteHeight - 10 :
        document.documentElement.clientHeight - paletteHeight - editorBounds.top;
    return beforePaletteTop;
  }
  const paletteTop = getPaletteTop();
  // const paletteTop = editorBounds.top + selectionMiddle + paletteWidthAndHeight + 10 <= document.documentElement.clientHeight ? selectionMiddle + 10 :
  //   editorBounds.top + selectionMiddle - paletteWidthAndHeight - 10 >= 0 ? selectionMiddle - paletteWidthAndHeight - 10 :
  //     document.documentElement.clientHeight - paletteWidthAndHeight - editorBounds.top;

  (quill as any).container.appendChild(ele_emoji_area);
  ele_emoji_area.id = 'emoji-palette';
  ele_emoji_area.style.left = `${paletteLeft}px`;
  ele_emoji_area.style.top = `${paletteTop}px`;

  let tabToolbar = document.createElement('div');
  tabToolbar.id = "tab-toolbar";
  ele_emoji_area.appendChild(tabToolbar);

  //panel
  let panel = document.createElement('div');
  panel.id = "tab-panel";
  ele_emoji_area.appendChild(panel);

  var emojiType = [
    {'type': 'p', 'name': 'people', 'content': '<div class="i-people"></div>'},
    {'type': 'n', 'name': 'nature', 'content': '<div class="i-nature"></div>'},
    {'type': 'd', 'name': 'food', 'content': '<div class="i-food"></div>'},
    {'type': 's', 'name': 'symbols', 'content': '<div class="i-symbols"></div>'},
    {'type': 'a', 'name': 'activity', 'content': '<div class="i-activity"></div>'},
    {'type': 't', 'name': 'travel', 'content': '<div class="i-travel"></div>'},
    {'type': 'o', 'name': 'objects', 'content': '<div class="i-objects"></div>'},
    {'type': 'f', 'name': 'flags', 'content': '<div class="i-flags"></div>'}
  ];

  let tabElementHolder = document.createElement('ul');
  tabToolbar.appendChild(tabElementHolder);

  if (document.getElementById('emoji-close-div') === null) {
    let closeDiv = document.createElement('div');
    closeDiv.id = 'emoji-close-div';
    closeDiv.addEventListener("click", fn_close, false);
    document.getElementsByTagName('body')[0].appendChild(closeDiv);
  } else {
    document.getElementById('emoji-close-div')!.style.display = "block";
  }


  emojiType.map(function (emojiType) {
    //add tab bar
    let tabElement = document.createElement('li');
    tabElement.classList.add('emoji-tab');
    tabElement.classList.add('filter-' + emojiType.name);
    tabElement.innerHTML = emojiType.content;
    tabElement.dataset.filter = emojiType.type;
    tabElementHolder.appendChild(tabElement);

    let emojiFilter = document.querySelector('.filter-' + emojiType.name) ?? document.createElement('div');
    emojiFilter.addEventListener('click', function () {
      let tab = document.querySelector('.active');
      if (tab) {
        tab.classList.remove('active');
      }
      emojiFilter.classList.toggle('active');
      fn_updateEmojiContainer(emojiFilter, panel, quill);
    })
  });
  fn_emojiPanelInit(panel, quill);
}

function fn_emojiPanelInit(panel: any, quill: Quill) {
  fn_emojiElementsToPanel('p', panel, quill);
  document.querySelector('.filter-people')!.classList.add('active');
}

function fn_emojiElementsToPanel(type: any, panel: any, quill: Quill) {
  let fuseOptions: any = {
    shouldSort: true,
    matchAllTokens: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: [
      "category"
    ]
  };
  let fuse = new Fuse(emojiList, fuseOptions);
  let result = fuse.search(type);
  result.sort(function (a: any, b: any) {
    return a.emoji_order - b.emoji_order;
  });

  quill.focus();
  let range = quill.getSelection();

  result.map(function (emoji) {
    let span = document.createElement('span');
    let t = document.createTextNode(emoji.shortname);
    span.appendChild(t);
    span.classList.add('bem');
    span.classList.add('bem-' + emoji.name);
    span.classList.add('ap');
    span.classList.add('ap-' + emoji.name);
    let output = '' + emoji.code_decimal + '';
    span.innerHTML = output + ' ';
    panel.appendChild(span);

    let customButton = document.querySelector('.bem-' + emoji.name);
    if (customButton) {
      customButton.addEventListener('click', function () {
        makeElement("span", {className: "ico", innerHTML: '' + emoji.code_decimal + ' '});
        quill.insertEmbed(range!.index, 'emoji', emoji, Quill.sources.USER);
        setTimeout(() => quill.setSelection((range!.index + 1) as any), 0);
        fn_close();
      });
    }
  });
}

function fn_updateEmojiContainer(emojiFilter: any, panel: any, quill: Quill) {
  while (panel.firstChild) {
    panel.removeChild(panel.firstChild);
  }
  let type = emojiFilter.dataset.filter;
  fn_emojiElementsToPanel(type, panel, quill);
}

function makeElement(tag: any, attrs: any, ...children: any[]) {
  const elem = document.createElement(tag);
  Object.keys(attrs).forEach(key => elem[key] = attrs[key]);
  children.forEach(child => {
    if (typeof child === "string")
      child = document.createTextNode(child);
    elem.appendChild(child);
  });
  return elem;
}

export default ToolbarEmoji;

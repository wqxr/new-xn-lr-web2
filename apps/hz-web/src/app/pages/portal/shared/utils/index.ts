import * as md5 from 'js-md5';

export class XnUtils {
  static addEvent(obj, type, fn){
    if (obj.attachEvent){ // ie
      obj.attachEvent('on' + type, () => {
        fn.call(obj);
      });
    }else{
      obj.addEventListener(type, fn, false);
    }
  }
  static removeEvent(obj, type, fn){
    if (obj.attachEvent){ // ie
      obj.detachEvent('on' + type, () => {
        fn.call(obj);
      });
    }else{
      obj.removeEventListener(type, fn, false);
    }
  }
  static requestSign() {
    const time = Math.floor(new Date().getTime() / 1000);
    const appId = sessionStorage.getItem('appId');
    const clientkey = sessionStorage.getItem('clientkey');
    const userId = sessionStorage.getItem('userId');

    return {
      t: time,
      sign: md5(`${appId}${clientkey}${time}${userId}`),
    };
  }
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  static getTextNodeList(dom) {
    const nodeList = [...dom.childNodes];
    const textNodes = [];
    while (nodeList.length) {
      const node = nodeList.shift();
      if (node.nodeType === node.TEXT_NODE) {
        textNodes.push(node);
      } else {
        nodeList.unshift(...node.childNodes);
      }
    }
    return textNodes;
  }
  static getTextInfoList(textNodes) {
    let length = 0;
    const textList = textNodes.map(text => {
      // tslint:disable-next-line:one-variable-per-declaration
      const start = length, end = length + text.wholeText.length;
      length = end;
      return [text.wholeText, start, end];
    });
    return textList;
  }
  static getMatchList(content, keyword) {
    const characters = [...'\\[]()?.+*^${}:'].reduce((r, c) => (r[c] = true, r), {});
    keyword = keyword.split('').map(s => characters[s] ? `\\${s}` : s).join('[\\s\\n]*');
    const reg = new RegExp(keyword, 'gmi');
    return [...content.matchAll(reg)]; // matchAll结果是个迭代器，用扩展符展开得到数组
  }
  static replaceMatchResult(textNodes, textList, matchList) {
    // 对于每一个匹配结果，可能分散在多个标签中，找出这些标签，截取匹配片段并用font标签替换出
    for (let i = matchList.length - 1; i >= 0; i--) {
      const match = matchList[i];
      // tslint:disable-next-line:one-variable-per-declaration
      const matchStart = match.index, matchEnd = matchStart + match[0].length; // 匹配结果在拼接字符串中的起止索引
      // 遍历文本信息列表，查找匹配的文本节点
      for (let textIdx = 0; textIdx < textList.length; textIdx++) {
        const { text, startIdx, endIdx } = textList[textIdx]; // 文本内容、文本在拼接串中开始、结束索引
        if (endIdx < matchStart) { continue; } // 匹配的文本节点还在后面
        if (startIdx >= matchEnd) { break; } // 匹配文本节点已经处理完了
        let textNode = textNodes[textIdx]; // 这个节点中的部分或全部内容匹配到了关键词，将匹配部分截取出来进行替换
        const nodeMatchStartIdx = Math.max(0, matchStart - startIdx); // 匹配内容在文本节点内容中的开始索引
        const nodeMatchLength = Math.min(endIdx, matchEnd) - startIdx - nodeMatchStartIdx; // 文本节点内容匹配关键词的长度
        if (nodeMatchStartIdx > 0) { textNode = textNode.splitText(nodeMatchStartIdx); } // textNode取后半部分
        if (nodeMatchLength < textNode.wholeText.length) { textNode.splitText(nodeMatchLength); }
        const font = document.createElement('span');
        font.style.color = '#fff';
        font.style.backgroundColor = '#1D67C7';
        font.innerText = text.substr(nodeMatchStartIdx, nodeMatchLength);
        textNode.parentNode.replaceChild(font, textNode);
      }
    }
  }
  static replaceKeywords(htmlString, keyword) {
    if (!keyword) { return htmlString; }
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    const textNodes = XnUtils.getTextNodeList(div);
    console.log('textNodes', textNodes);
    const textList = XnUtils.getTextInfoList(textNodes).map(c => {
      return { text: c[0].trim(), startIdx: c[1], endIdx: c[2] };
    });
    console.log('textList', textList);
    const content = textList.map(({ text }) => text).join('');
    console.log('content', content);
    const matchList = XnUtils.getMatchList(content, keyword);
    console.log('matchList', matchList);
    XnUtils.replaceMatchResult(textNodes, textList, matchList);
    console.log('html',  div.innerHTML);
    return div.innerHTML;
  }
}

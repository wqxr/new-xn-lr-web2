import { isObject } from 'util';

export const FontColor = {
    string: 'green',
    boolean: 'darkorange',
    number: 'blue',
    null: 'magenta',
    key: 'red'
}
export class JsonUtils {
    static jsonShowFn(json) {
        // if (!json.match("^\{(.+:.+,*){1,}\}$")) {
        //     return json;  //判断是否是json数据，不是直接返回
        // }
        if (!isObject(json)) {
            return json;  //判断是否是json数据，不是直接返回
        }

        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
            // return `<span class="${cls}" style="color: ${FontColor[cls]};">${match}</span>`;
        });
    }
}
import {isNullOrUndefined} from 'util';

declare let CryptoJS: any;

export class DataTableUtils {

    static readonly dataTableLanguage = {
        emptyTable: '没有记录',
        zeroRecords: '没有记录',
        loadingRecords: '数据加载中...',
        processing: '正在请求数据...',
        search: '搜索',
        lengthMenu: '每页显示 _MENU_ 行',
        info: '显示第_START_-_END_行, 共_TOTAL_行',
        infoEmpty: '显示第_START_-_END_行, 共_TOTAL_行',
        infoFiltered: '(从_MAX_行中过滤)',
        paginate: {
            first: '首页',
            last: '末页',
            next: '下页',
            previous: '上页'
        }
    };

    static buildUrl(config: any, method: string) {
        const type = (typeof config.url).toLowerCase();
        if (type === 'string') {
            return config.url + '?method=' + method.toLowerCase();
        } else if (type === 'object') {
            return config.url[method];
        }
    }

    /**
     *  采购融资 请求
     * @param config
     * @param method
     */
    static buildAvengerUrl(config: any, method: string) {
        const type = (typeof config.url).toLowerCase();
        if (type === 'string') {
            return `${config.url}/${method}`;
        } else if (type === 'object') {
            return config.url[method];
        }
    }

    static buildTableColumns(config: any): any[] {
        const columns = [];
        for (const value of config.fields) {
            if (value.inColumn === undefined || value.inColumn === true) {
                columns.push({
                    title: value.label,
                    data: value.name,
                    render: value.render,
                    orderable: value.orderable
                });
            }
        }
        return columns;
    }

    static addRowId(config: any, data: any): void {
        if (isNullOrUndefined(data)) { return; }

        for (const value of data) {
            // 给返回的数据增加DT_RowId字段，目前先简单用hex编码方式
            if (config.keys.length === 1) {
                value.DT_RowId = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(value[config.keys[0]]));
            } else {
                value.DT_RowId = '';
                let isFirst = true;
                for (const keyName of config.keys) {
                    if (!isFirst) {
                        value.DT_RowId += ';';
                    } else {
                        isFirst = false;
                    }
                    value.DT_RowId += value[keyName];
                }
                value.DT_RowId = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(value.DT_RowId));
            }
        }
    }

    /**
     * 把返回的options内容做下分割，有时key是'procedureId, showProcedureId'这种
     * @param data
     */
    static splitOptions(data: any) {
        const adds = {} as any;
        const dels = [];
        for (const key in data.options) {
            if (key.indexOf(',') > 0) {
                dels.push(key);
                const arr = key.split(',');
                for (const newKey of arr) {
                    adds[newKey.trim()] = data.options[key];
                }
            }
        }

        if (dels.length === 0) { return; }

        for (const key in adds) {
            data.options[key] = adds[key];
        }

        for (const key of dels) {
            delete data.options[key];
        }

    }

    /**
     * 从rowid里解析出只包含主键字段的where结构
     * @param key
     */
    static parseRowId(config: any, key: string): any {
        key = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(key));

        const where = {} as any;
        if (config.keys.length === 1) {
            // 单字段主键
            where[config.keys[0]] = key;
        } else {
            // 多字段主键
            const arr = key.split(';');
            if (arr.length !== config.keys.length) {
                console.error(`key ${key} not match ${config.keys}`);
            }
            for (let i = 0; i < arr.length; ++i) {
                where[config.keys[i]] = arr[i];
            }
        }

        return where;
    }

    static isTrueEmpty(e) {
        if (e === null || e === undefined || e === '') { return true; }
        return false;
    }

    static verifyRequired(config: any, params: any): any[] {
        const msg: any[] = [];
        for (const field of config.fields) {
            if (field.inEditor === undefined || field.inEditor === true) {
                if (field.required !== false && DataTableUtils.isTrueEmpty(params[field.name])) {
                    msg.push(field.label);
                }
            }
        }
        return msg;
    }
}

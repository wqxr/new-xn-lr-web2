export default class CommUtils {

    /**
     * 从字段数组中获取new需要的字段
     * @param fields 字段数组
     */
    static getNewFields(fields) {
        return this._getFields(fields, true, '_inNew');
    }

    /**
     * 从字段数组中获取edit需要的字段
     * @param fields 字段数组
     */
    static getEditFields(fields) {
        return this._getFields(fields, true, '_inEdit');
    }

    /**
     * 从字段数组中获取detail需要的字段
     * @param fields 字段数组
     */
    static getDetailFields(fields) {
        return this._getFields(fields, true, '_inDetail');
    }

    /**
     * 从字段数组中获取list需要的字段
     * @param fields 字段数组
     */
    static getListFields(fields) {
        return this._getFields(fields, true, '_inList');
    }

    /**
     * 从字段数组中获取search需要的字段
     * @param fields 字段数组
     */
    static getSearchFields(fields) {
        return this._getFields(fields, true, '_inSearch');
    }

    /**
     * 过滤字段的公共方法
     * @param fields 字段数组
     * @param def  def决定默认是否把字段放入结果，默认为true
     * @param match  match
     */
    private static _getFields(fields, def, match) {
        const ret = [];
        for (const field of fields) {
            const nfield = {} as any;
            let ok = def;
            for (const key in field) {
                if (key.startsWith('_')) {
                    // 以下划线_起头的字段是隐藏字段，不放入nfield中
                    if (key === match) {
                        const value = field[key];
                        // 这里的value要么是true/false，要么是{}
                        if (value === false || value === true) {
                            ok = value;
                            break;
                        } else {
                            ok = true;
                            for (const k of Object.keys(value)) {
                                this._mergeValue(nfield, value, k);
                            }
                        }
                    }
                } else {
                    nfield[key] = field[key];
                }
            }
            if (ok) {
                ret.push(nfield);
            }
        }
        return ret;
    }

    /**
     * 把src的key字段合并到dst
     * @param dst
     * @param src
     * @param key
     */
    private static _mergeValue(dst, src, key) {
        const srcv = src[key];
        const dstv = dst[key];
        if (dstv === undefined || dstv === null) {
            dst[key] = srcv;
            return;
        }

        const dstt = (typeof dstv).toLowerCase();
        if (dstt === 'object') {
            if (dstt.constructor === Array) {
                // 数组
                for (const n of srcv) {
                    dstv.push(n);
                }
            } else {
                // 对象
                for (const k of srcv) {
                    dstv[k] = srcv[k];
                }
            }
        } else {
            dst[key] = srcv; // 其他类型直接赋值
        }
    }

    /**
     * 休眠指定的毫秒数
     * @param paramT 要休眠的时长
     */
    public static async sleep(paramT: number) {
        await this.WaitFunction(setTimeout, paramT);
    }

    /**
     * 异步调用函数,注意：要求第一个参数回调函数
	 * @static
	 * @memberOf utils
     * @param {function} paramFunc 要调用的函数
     * @param {...args} args 要调用的参数
     * @return {...args} 返回回调函数的传入参数列表
     */
    public static async WaitFunction(paramFunc: Function, ...args: any[]): Promise<any> {
        return new Promise((resolve) => {
            paramFunc((...result: any[]) => {
                resolve(result);
            }, ...args);
        });
    }

}

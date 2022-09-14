/**
 * 增值税发票的有关函数
 */
export class InvoiceUtils {

    private static readonly code = ['144031539110', '131001570151', '133011501118', '111001571071'];
    static readonly invoiceType = {
      VAT_SPECIAL: 1,   // 增值税专用发票
      VAT_ORDINARY: 2,  // 增值税普通发票
    };
    /**
     * 计算发票类型
     * @param invoiceCode 发票代码
     */
    private static calcInvoiceType(invoiceCode: string): string {
        let invoiceType = '99';

        if (invoiceCode.length === 12) {
            invoiceType = '10' || '11' || '03';

        } else if (invoiceCode.length === 10) {
            invoiceType = '01' || '04' || '02';
        }

        return invoiceType;
    }

    static getInvoiceTypeValidator(invoiceType: number): any {
      switch (invoiceType) {
        case 1: {
          return {
            number: '01',
            title: '发票开具金额(不含税)',
            memo: '请输入发票开具金额',
            error: '发票开具金额(不含税)有误',
          };
        }
        case 2: {
          return {
            number: '11',
            title: '发票校验码',
            memo: '请输入发票校验码<span style="color:#ff0000; font-size:18px; background-color: #cccccc">后六位</span>',
            error: '发票校验码有误',
          };
        }
        default: {
          return {
            number: '00',
            title: '发票开票金额',
            memo: '请输入发票开票金额',
            error: '发票开票金额有误'
          };
        }
      }
    }
    /**
     * 判断是不是合法的发票代码 10位或者12位
     * @param invoiceCode 发票代码
     * @returns boolean
     */
    static isValidInvoiceCode(invoiceCode: string): boolean {
      return invoiceCode && [10, 12].includes(invoiceCode.length);
    }

    /**
     * 获取附加检查项
     * @param invoiceCode 发票代码
     */
    static getAdditionalValidator(invoiceCode: string): any {
        const invoiceType = InvoiceUtils.calcInvoiceType(invoiceCode);
        switch (invoiceType) {
            case '01':
                return {
                    number: '01',
                    title: '发票开具金额(不含税)',
                    memo: '请输入发票开具金额',
                    error: '发票开具金额(不含税)有误'
                };
            case '02':
                return {
                    number: '02',
                    title: '发票合计金额',
                    memo: '请输入发票合计金额',
                    error: '发票合计金额有误'
                };
            case '03':
                return {
                    number: '03',
                    title: '发票不含税价',
                    memo: '请输入发票不含税价',
                    error: '发票不含税价有误'
                };
            case '04':
            case '10':
            case '11':
                return {
                    number: '11',
                    title: '发票校验码',
                    memo: '请输入发票校验码<span style="color:#ff0000; font-size:18px; background-color: #cccccc">后六位</span>',
                    error: '发票校验码有误'
                };

            default:
                return {
                    number: '00',
                    title: '发票开票金额',
                    memo: '请输入发票开票金额',
                    error: '发票开票金额有误'
                };
        }
    }

    /**
     * 获取图片验证码的描述文字
     * @param type 验证码类型
     * @returns string
     */
    static getVcodeMemo(type: string): string {
        if (type === '00') {
            return '请输入验证码文字';
        }
        if (type === '01') {
            return `请输入验证码图片中<span style="color:#ff0000; font-size:18px; background-color: #cccccc">红色</span>文字`;
        }
        if (type === '02') {
            return `请输入验证码图片中<span style="color:#ffff00; font-size:18px; background-color: #cccccc">黄色</span>文字`;
        }
        if (type === '03') {
            return `请输入验证码图片中<span style="color:#0000ff; font-size:18px; background-color: #cccccc">蓝色</span>文字`;
        }
        return '未知类型，请联系管理员';
    }

    /**
     * 验证附加检查项
     * @param invoiceCode 发票代码
     * @param value 开票金额
     * @returns boolean
     */
    static verifyAdditionalValidator(invoiceCode: string, value: string): boolean {
        const invoiceType = InvoiceUtils.calcInvoiceType(invoiceCode);
        if (invoiceType === '01' || invoiceType === '02' || invoiceType === '03') {
            return InvoiceUtils.ea(value);
        } else {
            return InvoiceUtils.eb(value);
        }
    }
    static verifyAdditionalValidator2(invoiceType: number, invoiceAmount: string): boolean {
      if (invoiceType === InvoiceUtils.invoiceType.VAT_SPECIAL) {
        return InvoiceUtils.ea(invoiceAmount);
      } else {
        return InvoiceUtils.eb(invoiceAmount);
      }
    }
    private static ea(value: string): boolean {
        return /(^-?\d{1,11}$)|(^-?\d{1,11}\.\d{1,2}$)/.test(value);
    }

    private static eb(value: string): boolean {
        return /^-?(\d+$)|(\d+\.\d{1,2})$/.test(value);
    }

    /**
     * 解析发票查验结果
     * @param json
     */
    static handleInvoideResponse(jsonData: any) {
        if (jsonData.key2 && jsonData.key2.length) {
            const fpxx = jsonData.key2.split('≡');
            return {
                ret: 0,
                invoiceAmount: parseFloat(fpxx[12])
            };
        }
    }

    /**
     * 加法函数，用来得到精确的加法结果
     * javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
     * @param {*} arg1
     * @param {*} arg2
     */
    private static accAdd(arg1, arg2) {
        let r1, r2, m;
        if (arg1.trim() === '') {
            return arg1;
        }
        if (parseInt(arg1, 10).toString() === arg1) {
            r1 = 0;
        } else {
            r1 = arg1.toString().split('.')[1].length;
        }
        if (parseInt(arg2, 10).toString() === arg2) {
            r2 = 0;
        } else {
            r2 = arg2.toString().split('.')[1].length;
        }
        m = Math.pow(10, Math.max(r1, r2));
        const r = (arg1 * m + arg2 * m) / m;
        return r.toFixed(2);
    }

    /**
     * 从税务局网站抽取的代码
     * @param {*} je
     * @param {*} ss
     */
    private static getje(je, ss) {
        if (typeof je !== 'undefined' && je !== '') {
            return InvoiceUtils.accAdd(je, ss);
        } else {
            return je;
        }
    }

    /**
     * 从税务局网站抽取的代码
     * @param {*} je
     */
    private static GetJeToDot(je) {
        if (typeof je !== 'undefined' && je.trim() !== '') {
            if (je.trim() === '-') {
                return je;
            }
            je = je.trim() + '';
            if (je.substring(0, 1) === '.') {
                je = '0' + '.' + je.substring(1, je.length);
                return je;
            }
            const index = je.indexOf('.');
            if (index < 0) {
                je += '.00';
            } else if (je.split('.')[1].length === 1) {
                je += '0';
            }
            if (je.substring(0, 2) === '-.') {
                je = '-0.' + je.substring(2, je.length);
            }
            return je;
        } else {
            return je;
        }
    }
}

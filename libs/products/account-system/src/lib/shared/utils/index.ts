
/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\utils\index.ts
* @summary：init MinUtils
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-24
***************************************************************************/
import { NzUploadFile } from "ng-zorro-antd/upload"
export class MinUtils {

  /**
   * 过滤上传文件key
   * @param fileList 文件
   * @returns
   */
  static filterFileKey(fileList: any[]): string {
    MinUtils.jsonToHump(fileList);
    if (!fileList.length) {
      return ''
    }
    const fileKey = fileList.map((File: any) => {
      if (File?.response) {
        // 未编辑的
        return File.response.data.fileKey
      } else {
        // 手动上传的
        return File.fileKey
      }
    })[0]
    return fileKey
  }

  /**
   * 展示文件组装
   * @param fileName 文件名
   * @param fileKey 文件id
   * @returns
   */
  static filterViewFileList(fileName: string, fileKey: string): NzUploadFile[] {
    if (!fileName && !fileKey) {
      return []
    }
    return [
      {
        response: { data: { fileName, fileKey } },
        name: fileName,
        uid: fileKey,
        status: 'done'
      }
    ]
  }

  /**
   * 字符串日期格式化
   * @param date 日期字符串如 "yyyymmdd"
   * @returns
   */
  static getDateTime(dateStr: string) {
    if (!dateStr) {
      return '';
    } else {
      const date = `${dateStr.slice(0, 4)}-
      ${dateStr.slice(4, 6)}-
      ${dateStr.slice(6, 8)}`;
      return new Date(date);
    }
  }

  /**
   * 手机号过滤展示
   * @param mobile
   * @returns
   */
  static formatMobile(mobile: string): string {
    return `${mobile.substr(
      0,
      3
    )}****${mobile.substr(7, 4)}`
  }

  /**
   * 格式化金额每三位加小数点控件
   */
  static formatMoney(num: any): string {
    if (num === 0) {
      return num.toString();
    }
    if (!num) {
      return '';
    }
    num = num.toString();
    num = num.replace(/,/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    let numTemp = 0;
    // 检测是否为负数
    if (parseInt(num.toString().indexOf('-'), 0) !== -1) {
      numTemp = -1;
      num = num.replace(/-/g, '');
    }
    // 检测是否是小数
    if (parseInt(num.toString().indexOf('.'), 0) !== -1) {
      const regArrTemp = num.split('.');
      const regArrFirstTemp = regArrTemp[0];
      num = num.replace(/^0/, '');
      const regArr = num.split('.');
      regArr[0] = regArr[0].replace(/^0+/, ''); // 检测前面是否有0
      regArr[0] = regArr[0]
        .replace(/,/g, '')
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})/g, '$1,')
        .replace(/\,$/, '')
        .split('')
        .reverse()
        .join('');
      num = regArr.join('.');
      num = parseInt(regArrFirstTemp, 0) === 0 ? '0' + num : num; // 检测小数是不是0.x的这种小数
    } else {
      if (parseInt(num, 0) !== 0) {
        num = num.replace(/^0+/, ''); // 不等于0，把0去掉
        // num += '.00';
      } else {
        num = num.replace(/^0+/, '0'); // 为0，保留1个0
      }
      num = num
        .replace(/,/g, '')
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})/g, '$1,')
        .replace(/\,$/, '')
        .split('')
        .reverse()
        .join('');
      // num += '.00';
    }
    if (numTemp === -1) {
      num = '-' + num;
    }
    return num;
  }

  // 保留小数
  static formatMoneyFloat(num: any): string {
    num = num.toString();
    num = num.replace(/,/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    let numTemp = 0;
    // 检测是否为负数
    if (parseInt(num.toString().indexOf('-'), 0) !== -1) {
      numTemp = -1;
      num = num.replace(/-/g, '');
    }
    // 检测是否是小数
    if (parseInt(num.toString().indexOf('.'), 0) !== -1) {
      const regArrTemp = num.split('.');
      const regArrFirstTemp = regArrTemp[0];
      num = num.replace(/^0/, '');
      const regArr = num.split('.');
      regArr[0] = regArr[0].replace(/^0+/, ''); // 检测前面是否有0
      regArr[0] = regArr[0]
        .replace(/,/g, '')
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})/g, '$1,')
        .replace(/\,$/, '')
        .split('')
        .reverse()
        .join('');
      num = regArr.join('.');
      num = parseInt(regArrFirstTemp, 0) === 0 ? '0' + num : num; // 检测小数是不是0.x的这种小数
    } else {
      if (parseInt(num, 0) !== 0) {
        num = num.replace(/^0+/, ''); // 不等于0，把0去掉
        //  num += '.00';
      } else {
        num = num.replace(/^0+/, '0'); // 为0，保留1个0
      }
      num = num
        .replace(/,/g, '')
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})/g, '$1,')
        .replace(/\,$/, '')
        .split('')
        .reverse()
        .join('');
      num += '.00';
    }
    if (numTemp === -1) {
      num = '-' + num;
    }
    return num;
  }

  // 字符串的下划线格式转驼峰格式
  static underline2Hump(s: string) {
    return s.replace(/_(\w)/g, function (all: any, letter: string) {
      return letter.toUpperCase()
    })
  }

  // 字符串的驼峰格式转下划线格式
  static hump2Underline(s: string) {
    return s.replace(/([A-Z])/g, '_$1').toLowerCase()
  }

  /**
   * JSON对象的key值转换为驼峰式
   * @param obj
   */
  static jsonToHump(obj: any) {
    if (obj instanceof Array) {
      obj.forEach(function (v, i) {
        MinUtils.jsonToHump(v);
      })
    } else if (obj instanceof Object) {
      Object.keys(obj).forEach(function (key) {
        const newKey = MinUtils.underline2Hump(key);
        if (newKey !== key) {
          obj[newKey] = obj[key];
          delete obj[key];
        }
        MinUtils.jsonToHump(obj[newKey]);
      })
    }
  }

  /**
   *  JSON对象的key值转换为下划线格式
   * @param obj
   */
  static jsonToUnderline(obj: any) {
    if (obj instanceof Array) {
      obj.forEach(function (v, i) {
        MinUtils.jsonToUnderline(v);
      })
    } else if (obj instanceof Object) {
      Object.keys(obj).forEach(function (key) {
        const newKey = MinUtils.hump2Underline(key);
        if (newKey !== key) {
          obj[newKey] = obj[key];
          delete obj[key];
        }
        MinUtils.jsonToUnderline(obj[newKey]);
      })
    }
  }

}

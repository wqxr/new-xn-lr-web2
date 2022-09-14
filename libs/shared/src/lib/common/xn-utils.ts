
import { ElementRef } from '@angular/core';
import { isArray, isObject, isString } from 'util';
import { ProxyTypeEnum } from '../config/enum';

declare let $: any;

export class XnUtils {
  static isEmpty(v) {
    return v === undefined || v === null || v.length === 0;
  }
  /**
   * 隐藏手机号
   * @param phone 手机号
   */
  static cyptPhone(phone: string): string {
    return phone.substr(0, 3) + '****' + phone.substr(7, 11);
  }
  /**
   * 判空函数
   * undefined， null， ''， NaN，false，0，[]，{} ，空白字符串，都返回true，否则返回false
   * @param v 值
   * @param except 指定值除外，如0，则当v为0时返回false
   */
  static isEmptys(v: any, except?: any[]) {
    if (except && except.includes(v)) {
      return false;
    }
    switch (typeof v) {
      case 'undefined':
        return true;
      case 'string':
        if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length === 0)
          return true;
        break;
      case 'boolean':
        if (!v) return true;
        break;
      case 'number':
        if (v === 0 || isNaN(v)) return true;
        break;
      case 'object':
        if (v === null || v.length === 0) return true;
        if (Object.keys(v).length) {
          return false;
        }
        return true;
    }
    return false;
  }

  /**
   * 3.判断是否是数字
   * @param val
   * @param orString true表示支持字符串类数字 false或不传此参数表示仅支持数字
   * 返回true:数值型的，false：非数值型
   */
  static isNumber(val: any, orString?: boolean) {
    if (orString) {
      // 校验只要是数字（包含正负整数，0以及正负浮点数或字符串数字）就返回true
      const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
      const regNeg =
        /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true;
      } else {
        return false;
      }
    } else {
      // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
      if (val === '' || val == null) {
        return false;
      }
      if (typeof val === 'number' && !isNaN(val)) {
        // 对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
        // 所以如果不需要val包含这些特殊情况，则这个判断改写为if(typeof val === 'number' && !isNaN(val))
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   *  时间推移量
   * @param n  推移天数
   * @param current 当前日期
   * @param Direc 正负
   * @returns {any}
   */
  static dateSalculate(n, current, Direc): any {
    const mins = 24 * 60 * 60 * 1000;
    const payDays = new Date(current).getTime() + Direc * n * mins;
    // 当前时间
    const date = XnUtils.formatDate(payDays);
    return date;
  }
  /**
   *
   * @param dateStr 传入字符串
   */
  static reverseFormateDate(dateStr: any) {
    if (dateStr instanceof Date) {
      return dateStr;
    }
    if (dateStr === ''){
      return '';
    }
    if (typeof dateStr !== 'string') {
      return null;
    }
    if (dateStr.indexOf('-') !== -1 || dateStr.indexOf('/') !== -1) {
      /** YYYY-MM-DD和 YYYY/MM/DD 类型时间特殊处理 */
      return dateStr.split('/').join('-');
    }
    const rawDate = dateStr;
    const year = rawDate.substring(0, 4);
    const month = rawDate.substring(4, 6);
    const day = rawDate.substring(rawDate.length - 2, rawDate.length);
    // console.log(year + '-' + month + '-' + day);
    const date = year + '-' + month + '-' + day;
    return new Date(date);
  }
  static formatDate(timestamp, noHyphen?: boolean): string {
    if (typeof timestamp === 'string') {
      if (timestamp.indexOf('-') !== -1 || timestamp.indexOf('/') !== -1) {
        /** YYYY-MM-DD和 YYYY/MM/DD 类型时间特殊处理 */
        return timestamp.split('/').join('-');
      } else {
        timestamp = parseFloat(timestamp);
      }
    }
    if (!!timestamp && timestamp !== 0) {
      timestamp = Number(timestamp);
      const date = new Date(timestamp);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const sm = m < 10 ? '0' + m : m;
      const d = date.getDate();
      const sd = d < 10 ? '0' + d : d;
      return noHyphen ? `${y}${sm}${sd}` : `${y}-${sm}-${sd}`;
    } else {
      return '';
    }
  }

  static formatDateZh(timestamp): string {
    if (timestamp !== 0) {
      const date = new Date(timestamp);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();
      return `${y}年${m}月${d}日`;
    } else {
      return '';
    }
  }

  static formatDatetime(timestamp): string {
    if (timestamp !== 0) {
      const date = new Date(timestamp);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const sm = m < 10 ? '0' + m : m;
      const d = date.getDate();
      const sd = d < 10 ? '0' + d : d;
      const h = date.getHours();
      const sh = h < 10 ? '0' + h : h;
      const minute = date.getMinutes();
      const sminute = minute < 10 ? '0' + minute : minute;
      return `${y}-${sm}-${sd} ${sh}:${sminute}`;
    } else {
      return '';
    }
  }

  static formatLongDatetime(timestamp): string {
    if (timestamp !== 0) {
      const date = new Date(timestamp);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const sm = m < 10 ? '0' + m : m;
      const d = date.getDate();
      const sd = d < 10 ? '0' + d : d;
      const h = date.getHours();
      const sh = h < 10 ? '0' + h : h;
      const minute = date.getMinutes();
      const sminute = minute < 10 ? '0' + minute : minute;
      const s = date.getSeconds();
      const ss = s < 10 ? '0' + s : s;
      return `${y}-${sm}-${sd} ${sh}:${sminute}:${ss}`;
    } else {
      return '';
    }
  }

  static formatShortDatetime(timestamp): string {
    if (timestamp !== 0) {
      const date = new Date(timestamp);
      const m = date.getMonth() + 1;
      const sm = m < 10 ? '0' + m : m;
      const d = date.getDate();
      const sd = d < 10 ? '0' + d : d;
      const h = date.getHours();
      const sh = h < 10 ? '0' + h : h;
      const minute = date.getMinutes();
      const sminute = minute < 10 ? '0' + minute : minute;
      return `${sm}-${sd} ${sh}:${sminute}`;
    } else {
      return '';
    }
  }

  static deepCopy(obj, c?: any) {
    c = c || {};
    for (const i in obj) {
      if (typeof obj[i] === 'object') {
        c[i] = obj[i].constructor === Array ? [] : {};
        this.deepCopy(obj[i], c[i]);
      } else {
        c[i] = obj[i];
      }
    }
    return c;
  }
  // 分割数组
  /**
   *
   * @param arr 数组
   * @param index 二维数组的个数
   */
  static splitTwoArrary(arr, index) {
    let result = [];
    let temp = [];
    for (let i = 0; i < arr.length; i++) {
      if (i % index === 0) {
        temp = [];
      }
      temp.push(arr[i]);
      if (i % index === 0) {
        result.push(temp);
      }
    }
    return result;
  }
  // 深拷贝
  static deepClone(obj: any) {
    if (!(obj && typeof obj === 'object')) {
      return obj;
    }

    const clone = Array.isArray(obj) ? [] : ({} as any);
    Object.keys(obj).forEach((key) => {
      if (
        typeof obj[key] === 'object' &&
        Object.prototype.toString.call(obj[key]) !== '[object Date]'
      ) {
        clone[key] = this.deepClone(obj[key]);
      } else {
        clone[key] = obj[key];
      }
    });

    return clone;
  }
  static convertCurrency(currency: string | number): [boolean, string] {
    // Constants:
    const MAXIMUM_NUMBER = 99999999999.99;
    // Predefine the radix characters and currency symbols for output:
    const CN_ZERO = '零';
    const CN_ONE = '壹';
    const CN_TWO = '贰';
    const CN_THREE = '叁';
    const CN_FOUR = '肆';
    const CN_FIVE = '伍';
    const CN_SIX = '陆';
    const CN_SEVEN = '柒';
    const CN_EIGHT = '捌';
    const CN_NINE = '玖';
    const CN_TEN = '拾';
    const CN_HUNDRED = '佰';
    const CN_THOUSAND = '仟';
    const CN_TEN_THOUSAND = '万';
    const CN_HUNDRED_MILLION = '亿';
    const CN_SYMBOL = '人民币';
    const CN_DOLLAR = '元';
    const CN_TEN_CENT = '角';
    const CN_CENT = '分';
    const CN_INTEGER = '整';
    const CN_MINUS = '负';

    // Variables:
    let integral; // Represent integral part of digit number.
    let decimal; // Represent decimal part of digit number.
    let outputCharacters; // The output result.
    let parts;
    let digits, radices, bigRadices, decimals;
    let zeroCount;
    let i, p, d;
    let quotient, modulus;
    let currencyTemp, currencySymbol;

    // Validate input string:
    // 检测是否为负数
    currencyTemp = currency + '';
    if (parseInt(currencyTemp.indexOf('-'), 0) !== -1) {
      currencySymbol = -1;
      currency = currency.toString().replace(/-/g, '');
    }

    let currencyDigits = currency.toString();
    if (currencyDigits === '') {
      return [true, '请输入小写金额！'];
    }
    if (currencyDigits.match(/[^,.\d-]/) != null) {
      return [false, '小写金额含有无效字符！'];
    }
    if (
      currencyDigits.match(
        /^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?)|(\d+(.\d+)?))$/
      ) == null
    ) {
      return [false, '小写金额的格式不正确！'];
    }

    // Normalize the format of input digits:
    currencyDigits = currencyDigits.replace(/,/g, ''); // Remove comma delimiters.
    currencyDigits = currencyDigits.replace(/^0+/, ''); // Trim zeros at the beginning.
    // Assert the number is not greater than the maximum number.
    if (Number(currencyDigits) > MAXIMUM_NUMBER) {
      return [false, '金额过大，应小于1000亿元！'];
    }

    // Process the coversion from currency digits to characters:
    // Separate integral and decimal parts before processing coversion:
    parts = currencyDigits.split('.');
    if (parts.length > 1) {
      integral = parts[0];
      decimal = parts[1];
      // Cut down redundant decimal digits that are after the second.
      decimal = decimal.substr(0, 2);
    } else {
      integral = parts[0];
      decimal = '';
    }

    // Prepare the characters corresponding to the digits:
    digits = [
      CN_ZERO,
      CN_ONE,
      CN_TWO,
      CN_THREE,
      CN_FOUR,
      CN_FIVE,
      CN_SIX,
      CN_SEVEN,
      CN_EIGHT,
      CN_NINE,
    ];
    radices = ['', CN_TEN, CN_HUNDRED, CN_THOUSAND];
    bigRadices = ['', CN_TEN_THOUSAND, CN_HUNDRED_MILLION];
    decimals = [CN_TEN_CENT, CN_CENT];

    // Start processing:
    outputCharacters = '';
    // Process integral part if it is larger than 0:
    if (Number(integral) > 0) {
      zeroCount = 0;
      for (i = 0; i < integral.length; i++) {
        p = integral.length - i - 1;
        d = integral.substr(i, 1);
        quotient = p / 4;
        modulus = p % 4;
        if (d === '0') {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            outputCharacters += digits[0];
          }
          zeroCount = 0;
          outputCharacters += digits[Number(d)] + radices[modulus];
        }
        if (modulus === 0 && zeroCount < 4) {
          outputCharacters += bigRadices[quotient];
          zeroCount = 0;
        }
      }
      outputCharacters += CN_DOLLAR;
    }

    if (currencySymbol === -1) {
      outputCharacters = CN_MINUS + outputCharacters;
    }

    // Process decimal part if there is:
    if (decimal !== '') {
      for (i = 0; i < decimal.length; i++) {
        d = decimal.substr(i, 1);
        if (d !== '0') {
          outputCharacters += digits[Number(d)] + decimals[i];
        }
      }
    }

    // Confirm and return the final output string:
    if (outputCharacters === '') {
      outputCharacters = CN_ZERO + CN_DOLLAR;
    }
    if (decimal === '') {
      outputCharacters += CN_INTEGER;
    }

    return [true, outputCharacters];
  }

  /**
   * 递归判断value中是否有field
   * @param value
   * @param field
   * @returns {boolean}
   */
  static hasField(value, field): boolean {
    if (isArray(value)) {
      for (const item of value) {
        if (!XnUtils.hasField(item, field)) {
          return false;
        }
      }
      return true;
    }

    if (isObject(value)) {
      const v = value[field];
      return !(v === undefined || v === null || v === '');
    }

    return false;
  }

  /**
   * 把s转换为object对象
   * @param s
   * @returns {any}
   */
  static parseObject(s, def?) {
    if (XnUtils.isEmpty(s)) {
      return def || {};
    }
    if (isString(s) && !XnUtils.isZero(s)) {
      let d = JSON.parse(s);
      if (typeof d === 'number') {
        return s;
      }
      if (isArray(d)) {
        // d = JSON.parse(d[0]);
        d.forEach((el) => {
          if (isString(el) && el.indexOf('[') > -1) {
            // d = JSON.parse(el);
            this.parseObject(el);
          }
        });
      }
      return d;
    }
    return s;
  }

  /**
   *  判断字符串不是0开头
   */
  static isZero(str: any): boolean {
    return str.toString().substr(0, 1) === '0';
  }
  /**
   * 将数字转换为百分比的字符串
   * - 精确到0.01%
   * @param paramValue 要格式化的值
   * @param paramDefault 无效值后，返回的字符串
   * @return 格式化的百分比字符串
   *  - 对于paramValue为null或undefined
   */
  public static formatPercentage(
    paramValue: number | string,
    paramDefault: string = '0%'
  ) {
    const minNumber = 1000000;
    const PercentNumber = 100;

    if (paramValue === null || paramValue === undefined) {
      return paramDefault;
    }

    let n = '';
    let v = 0;
    if (typeof paramValue === 'string') {
      v = Math.round(Number.parseFloat(paramValue) * 10000) / 10000;
    } else {
      v = paramValue;
    }

    if (Number.isNaN(v)) {
      return paramDefault;
    }

    if (v < 0) {
      // 如果是小于0的数
      n = '-';
      v = Math.abs(v);
    }

    v *= minNumber;
    v = Math.round(v) / (minNumber / PercentNumber);
    return [n, v.toString(), '%'].join('');
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

  /**
   * 20170731这种日期校验
   */
  static toDateFromString(strDate: any): boolean {
    if (!strDate) {
      return;
    }
    if (isNaN(strDate) === true) {
      return false;
    }
    if (strDate.length !== 8) {
      return false;
    }

    let newDate;
    const nYear = parseInt(strDate.substring(0, 4), 10);
    const nMonth = parseInt(strDate.substring(4, 6), 10);
    const nDay = parseInt(strDate.substring(6, 8), 10);
    if (
      isNaN(nYear) === true ||
      isNaN(nMonth) === true ||
      isNaN(nDay) === true
    ) {
      return false;
    }
    newDate = new Date(nYear, nMonth - 1, nDay);
    if (
      nYear !== newDate.getFullYear() ||
      nMonth - 1 !== newDate.getMonth() ||
      nDay !== newDate.getDate()
    ) {
      return false;
    }
    return true;
  }

  /**
   * 20170731这种日期校验
   */
  static toDate(strDate: string): any {
    if (!strDate) {
      return;
    }
    if (strDate.length !== 8) {
      return;
    }
    let newDate;
    const nYear = parseInt(strDate.substring(0, 4), 10);
    const nMonth = parseInt(strDate.substring(4, 6), 10);
    const nDay = parseInt(strDate.substring(6, 8), 10);
    if (
      isNaN(nYear) === true ||
      isNaN(nMonth) === true ||
      isNaN(nDay) === true
    ) {
      return;
    }
    newDate = new Date(nYear, nMonth - 1, nDay);
    if (
      nYear !== newDate.getFullYear() ||
      nMonth - 1 !== newDate.getMonth() ||
      nDay !== newDate.getDate()
    ) {
      return;
    }
    return newDate;
  }

  /**
   * 图片旋转功能实现
   */
  static rotateImg(
    direction: string,
    degree: any,
    innerImg: any,
    outerImg: any,
    imgContainer: any,
    scaleValue?: number
  ): number {
    let scale = 1;
    if (direction === 'left') {
      degree = degree - 90;
    } else if (direction === 'right') {
      degree = degree + 90;
    }
    // 没有缩放大小，默认为1
    if (!!scaleValue) {
      scale = scaleValue;
    }
    // 开启硬件加速
    $(outerImg).css({ transform: 'rotate(' + degree + 'deg)' });

    const inner_Img = $(innerImg);
    const img_container = $(imgContainer);

    const widePercentTemp =
      Number((inner_Img.width() / inner_Img.height()).toFixed(4)) * 100;
    const widePercent = widePercentTemp + '%';

    // translateX是为了兼容270的时候，顶部出不来的情况。
    const translateXpxTemp =
      img_container.width() * (widePercentTemp / 100 - 1);
    const translateXpx = 'translateX(-' + translateXpxTemp + 'px)';

    // -270 是减270整除360
    if (degree % 90 === 0 && degree % 180 !== 0 && (degree - 270) % 360 !== 0) {
      $(innerImg).css({
        width: widePercent,
        transform: `translateX(0px) scale(${scale})`,
      });
    } else if ((degree - 270) % 360 === 0 && degree !== 0) {
      $(innerImg).css({
        width: widePercent,
        transform: `${translateXpx} scale(${scale})`,
      });
    } else {
      $(innerImg).css({
        width: '100%',
        transform: `translateX(0px) scale(${scale})`,
      });
    }

    return degree;
  }

  /**
   * 门户是否登录可见函数
   * json callback number
   * items need change
   * newItems new array
   */
  static portalCheckLogin(json: any, items: any): any {
    for (let j = 0; j < items.length; j++) {
      if (!(items[j].children && items[j].children.length)) {
        continue;
      }
      for (let i = 0; i < items[j].children.length; i++) {
        // 设多一个z，不然数组会乱
        for (let z = 0; z < json.data.data.length; z++) {
          if (items[j].children[i].id === json.data.data[z].columnId) {
            items[j].children[i].status =
              json.data.data[z].state === 1 ? true : false;
          }
        }
      }
    }
    return items;
  }

  static computeDay(controller, CalendarData) {
    if (
      !(
        controller.factoringDate ||
        (controller.params && controller.params.factoringDate)
      )
    ) {
      return controller;
    }
    const date = controller.factoringDate || controller.params.factoringDate;

    if (XnUtils.toDateFromString(date)) {
      if (isNaN(Number(date))) {
        // 该日历输入非数字
        controller.holidayAlert = '';
        controller.factoringEndAlert = '很抱歉，您需要输入格式为20170731的日期';
        controller.factoringDateTemp = false;
        return controller;
      }

      const week = CalendarData.toDateFromString(date);
      const nextYear = Date.parse(
        new Date(`${new Date().getFullYear() + 1}/01/01 00:00:00`).toString()
      );
      const beforeYear = Date.parse(new Date('2017/01/01 00:00:00').toString()); // 2017/01/01 00:00:00 以前的日历
      const now = Date.parse(new Date(week).toString()); // 2018/01/01 00:00:00 以后的日历
      if (nextYear <= now || beforeYear > now) {
        const str = this.calcWeek(week.getDay());
        const substr = this.calcQuarterly(date);
        controller.factoringEndAlert = '';
        controller.holidayAlert = '该到期日为' + str + '，' + substr;
        return controller;
      }
    }

    // 计算日期，用mock数据，不与后台进行交互
    CalendarData.getDateInfo(date).subscribe((json) => {
      if (!json) {
        controller.holidayAlert = '';
        controller.factoringEndAlert = '很抱歉，您需要输入格式为20170731的日期';
        controller.factoringDateTemp = false;
        return controller;
      }
      controller.factoringEndAlert = '';
      controller.factoringDateTemp = true;
      let str = '';

      str = this.calcWeek(json.week);
      const substr = this.calcQuarterly(date);
      if (json.isWorking === 0) {
        controller.holidayAlert =
          '该到期日为法定节假日，' +
          str +
          '，' +
          substr +
          '，下一个工作日为：' +
          json.dateTime;
      } else if (json.isWorking === 2) {
        // 特殊处理
        controller.holidayAlert =
          '该到期日为法定节假日，' + str + '，' + substr;
      } else {
        controller.holidayAlert = '该到期日为工作日，' + str + '，' + substr;
      }
    });
    return controller;
  }

  static computReceiveDay(controller, CalendarData) {
    // 判断应收账款到期日是否为工作日
    if (
      !(
        controller.receiveDate ||
        (controller.params && controller.params.receiveDate)
      )
    ) {
      return controller;
    }
    const date = controller.receiveDate || controller.params.receiveDate;
    const enddate = controller.endDate || controller.params.endDate;
    const addDay = controller.addDay;

    if (XnUtils.toDateFromString(date)) {
      const numDate = Number(date.replace(/-/g, ''));
      const numEnddate = Number(enddate.replace(/-/g, ''));
      if (numDate > numEnddate) {
        controller.factoringEndAlert = `贵公司期限是${addDay}天,请选择${enddate}之前的工作日`;
        controller.factoringDateTemp = false;
        controller.holidayAlert = '';
        return controller;
      }
    }

    // 计算日期，用mock数据，不与后台进行交互
    CalendarData.getDateInfo(date).subscribe((json) => {
      if (!json) {
        controller.holidayAlert = '';
        controller.factoringEndAlert = '很抱歉，您需要输入格式为20170731的日期';
        // controller.factoringDateTemp = false;
        return controller;
      }
      // controller.factoringDateTemp = true;
      let str = '';

      str = this.calcWeek(json.week);
      const substr = this.calcQuarterly(date);
      if (json.isWorking === 0) {
        controller.holidayAlert =
          '该到期日为法定节假日，' + str + '，' + substr + '，请选择工作日';
        controller.factoringDateTemp = false;
      } else if (json.isWorking === 2) {
        // 特殊处理
        controller.holidayAlert =
          '该到期日为法定节假日，' + str + '，' + substr + '，请选择工作日';
        controller.factoringDateTemp = false;
      } else {
        controller.holidayAlert = '';
        controller.factoringDateTemp = true;
      }
    });
    return controller;
  }
  static calcWeek(week) {
    let str;
    switch (week) {
      case 0:
        str = '星期日';
        break;
      case 1:
        str = '星期一';
        break;
      case 2:
        str = '星期二';
        break;
      case 3:
        str = '星期三';
        break;
      case 4:
        str = '星期四';
        break;
      case 5:
        str = '星期五';
        break;
      case 6:
        str = '星期六';
        break;
    }
    return str;
  }

  // 计算季度的前一周时间
  static calcQuarterly(date1: any) {
    // const date = this.replace(date1);
    const date = this.formString(date1);
    let str = '';
    if (
      date >= this.formString('20180324') &&
      date <= this.formString('20180331')
    ) {
      // 第一季度
      str = '第一季度最后一周';
    } else if (
      date >= this.formString('20180623') &&
      date <= this.formString('20180630')
    ) {
      str = '第二季度最后一周';
    } else if (
      date >= this.formString('20180923') &&
      date <= this.formString('20180930')
    ) {
      str = '第三季度最后一周';
    } else if (
      date >= this.formString('20181224') &&
      date <= this.formString('20181231')
    ) {
      str = '第四个季度最后一周';
    }
    return str;
  }

  // 日期转为毫秒数
  static dateTimes(date: any) {
    return new Date(date);
  }

  // 将20180702日期格式转为2018-07-02
  static replace(str) {
    return str.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  }

  // 截取字符串的后四位，并转化为number类型
  static formString(str) {
    return parseInt(str.substr(4), 0);
  }

  // 获取URL参数
  static parseUrl(url: string) {
    let name: string, value: string;
    let num: number =
      url.indexOf('?') > 0 ? url.indexOf('?') : url.indexOf('#');
    if (num < 0) {
      return;
    }
    url = url.substr(num + 1); // 取得所有参数

    const arr: any = url.split('&'); // 各个参数放到数组里
    const obj: any = {} as any;
    for (let i = 0; i < arr.length; i++) {
      num = arr[i].indexOf('=');
      if (num > 0) {
        name = arr[i].substring(0, num).trim();
        value = arr[i].substr(num + 1).trim();
        obj[name] = decodeURI(value);
      }
    }
    return obj;
  }

  // 找出数组中重复的元素
  static findArrayRepeat(arr, label?): any {
    const reps = []; // 重复的
    const afterReps = []; // 过滤后的
    if (arr.length) {
      if (!!label) {
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (
              !!arr[i][label] &&
              !!arr[j][label] &&
              arr[i][label] === arr[j][label]
            ) {
              reps.push(arr[i][label]);
            }
          }
        }
      } else {
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
              reps.push(arr[i]);
            } else {
              afterReps.push(arr[i]);
            }
          }
        }
      }
    }
    return { reps, afterReps };
  }

  static distinctArray3(files: any[], id: string) {
    if (!files || files.length === 0) {
      return;
    }
    const hash = {} as any;
    files = files.reduce((item, next) => {
      if (!hash[next[id]] || !next[id]) {
        // hash不存在 或者不存在发票号
        item.push(next);
        hash[next[id]] = true;
      }
      return item;
    }, []);
    return files;
  }
  // 根据两个字段去重复
  static distinctArrayTwo(files: any[], id: string, id1: string) {
    if (!files || files.length === 0) {
      return;
    }
    const hash = {} as any;
    files = files.reduce((item, next) => {
      if (!hash[next[id]] || !next[id] || !hash[next[id1] || !next[id1]]) {
        // hash不存在 或者不存在发票号
        item.push(next);
        hash[next[id]] = true;
        hash[next[id1]] = true;
      }
      return item;
    }, []);
    return files;
  }
  /**
   * 数组去重复
   */
  static distinctArray(files) {
    if (!files || files.length === 0) {
      return;
    }
    const hash = {} as any;
    return files.reduce((item, next) => {
      if (!hash[next]) {
        hash[next] = true;
        item.push(next);
      }
      return item;
    }, []);
  }

  /**
   * 文件数组去重
   * @param  {any[]} files 文件array
   * @param  {string} id
   */
  static distinctArray2(files: any[], id: string) {
    if (!files || files.length === 0) {
      return;
    }
    const hash = {} as any;
    return files.reduce((item, next) => {
      if (!hash[next[id]]) {
        hash[next[id]] = true;
        item.push(next);
      }
      return item;
    }, []);
  }

  // 数组去重
  static arrUnique(arrs, id) {
    const hash = {} as any;
    return arrs.reduce((item, next) => {
      if (!hash[next[id]]) {
        hash[next[id]] = true;
        item.push(next);
      }
      return item;
    }, []);
  }

  /**
   * 检查loading
   */
  static checkLoading(controller) {
    controller.loadingback = true;
    controller.loading.open();

    const check = setInterval(() => {
      controller.loading.checkLoading().subscribe((v) => {
        if (v === false) {
          controller.loadingback = false;
        }
      });
      if (controller.loadingback === false) {
        clearInterval(check);
      }
    }, 1000);

    return controller;
  }

  /**
   * 判断对象是否为空
   * @param paramObj true:为空，false:不为空
   */
  static isEmptyObject(paramObj: Object): boolean {
    return paramObj && Object.keys(paramObj).length === 0;
  }

  // 排序
  static sortData(data, rule) {
    if (data === '' || data.length === 0) {
      return;
    }
    return data.sort((a, b) => {
      if (a[rule] < b[rule]) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  static brData(data): string {
    data = data.replace(/\n/g, '<br/>');
    return data;
  }

  /**
   * 合同和图片同时去重，有id的为合同，否则为图片
   * @param fileArr
   */
  static uniqueBoth(fileArr): any {
    const hash = {} as any;
    return fileArr.reduce((item, next) => {
      if (!next.id) {
        if (hash[next.fileId]) {
        } else {
          console.log('ddddd');
          hash[next.fileId] = true;
          item.push(next);
        }
      } else {
        if (hash[next.secret]) {
        } else {
          // hash[next.id] = true;
          hash[next.secret] = true;
          item.push(next);
        }
      }
      return item;
    }, []);
  }

  /**
   * 流程处理操作  / 如果该交易flowId 为SpecialFlows中存在项则，则路径为 /console/record/avenger/todo/view/${record.recordId}
   * @param record 流程记录信息
   * @param xn
   */
  static doProcess(record: any, xn: any) {
    // 流程已完成 或者账号没有权限查看流程
    if (
      (record.status !== 1 && record.status !== 0) ||
      !XnUtils.getRoleExist(record.nowRoleId, xn.user.roles, record.proxyType)
    ) {
      if (record.proxyType === undefined) {
        xn.router.navigate([`/console/record/todo/view/${record.recordId}`]);
      } else {
        xn.router.navigate([ViewflowSet[record.proxyType] + record.recordId]);
      }
    } else {
      if (
        record.flowId === 'financing7' ||
        record.flowId === 'financing_bank7' ||
        record.flowId.indexOf('financing_factoring7') >= 0 ||
        record.flowId.indexOf('financing_supplier7') >= 0
      ) {
        // 银行流程（保证付款 + 商品融资）
        xn.router.navigate([
          `/console/bank/record/todo/edit/${record.recordId}`,
        ]);
      } else if (record.flowId === 'yajule_add_contract') {
        // todo 特殊处理，雅居乐供应商补充协议 直接跳转签署合同页面
        xn.router.navigate([
          `/console/record/supplier_sign/${record.mainFlowId}`,
        ]);
      } else {
        if (record.proxyType === undefined) {
          xn.router.navigate([`/console/record/todo/view/${record.recordId}`]);
        } else {
          if (
            record.flowId === 'dragon_platform_verify' &&
            record.zhongdengStatus === 1
          ) {
            xn.msgBox.open(false, '该流程中登登记处于登记中,不可处理');
            return;
          } else if (record.flowId === 'sub_dragon_book_change') {
            // 台账修改预录入
            xn.router.navigate([
              '/machine-account/record/sub_dragon_book_change/edit/' +
                record.recordId,
            ]);
          } else if (
            record.flowId === 'sub_bank_push_supplier_sign' ||
            record.flowId === 'sub_bank_push_platform_sign' ||
            record.flowId === 'sub_bank_platform_add_file' ||
            record.flowId === 'sub_bank_platform_change_file'
          ) {
            xn.router.navigate([
              '/console/bank-puhuitong/record/edit/' + record.recordId,
            ]);
          } else {
            // 此处跳转至set中对应的id值的路由path
            xn.router.navigate(
              [`${EditflowSet[record.proxyType]}${record.recordId}`],
              { queryParams: { factoringAppId: record.appId } }
            );
          }
        }
      }
    }
  }

  static transFormFilesConData(data): any[] {
    if (!data) {
      return [];
    }
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    } else {
      return JSON.parse(JSON.stringify(data));
    }
  }

  /**
   *  json 字符串转换
   * @param paramValue
   */
  static jsonTostring(paramValue: any): any {
    let str = '';
    if (!XnUtils.isEmpty(paramValue)) {
      str =
        typeof paramValue === 'string' ? JSON.parse(paramValue) : paramValue;
    }
    return str;
  }

  static getRoleExist(nowRoleId: string, userRoles: any, proxyType?: number) {
    // if (proxyType === 0) {
    return userRoles.includes(nowRoleId);
  }

  //解决两个数相乘精度确实的问题
  static accMul(arg1, arg2) {
    let m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {}
    try {
      m += s2.split('.')[1].length;
    } catch (e) {}
    return (
      (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
      Math.pow(10, m)
    );
  }

  /**
   *  判断输入的字符都为全角
   * @param paramValue
   */
  static fullOrHalf(paramValue: string): boolean {
    let res = true;
    for (let i = 0; i < paramValue.length; i++) {
      if (paramValue.charCodeAt(i) <= 128) {
        res = false;
        break;
      }
    }
    return res;
  }
  static renameKeys(obj: any, keysMap: any) {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const renamedObject = {
        [keysMap[key] || key]: obj[key],
      };

      return {
        ...acc,
        ...renamedObject,
      };
    }, {});
  }
  static deepRename(
    obj: { [x: string]: any } | any[],
    keysMap: any,
    cb?: (obj: any) => void
  ) {
    const isObj = typeof obj === 'object';

    if (!isObj && !Array.isArray(obj)) {
      throw new Error('required an object');
    }

    const res = isObj && Array.isArray(obj) ? ([] as any) : {};
    if (isObj) {
      if (cb) {
        cb.call(null, obj);
      }
      obj = this.renameKeys(obj, keysMap);
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const val = (obj as any)[key];
        if (typeof val === 'object' || Array.isArray(val)) {
          res[key] = this.deepRename(val, keysMap, cb);
        } else {
          res[key] = val;
        }
      }
    }
    return res;
  }
  /**
   * base64 转 Blob
   * @param base64Str base64Str
   * @param contentType contentType
   */
  static base64ToBlob(base64Str: any, contentType: string) {
    // Base64一行不能超过76字符，超过则添加回车换行符。因此需要把base64字段中的换行符
    // 回车符给去掉，有时候因为存在需要把加号空格之类的换回来，取决于base64存取时的规则
    base64Str = base64Str.replace(/[\n\r]/g, '');
    const raw = window.atob(base64Str);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType }); // 转成pdf类型
  }

  /**
   * 生成随机字符串
   * @returns
   */
  static getUid(): string {
    return Math.random().toString(36).substring(2);
  }

  /**
   * @description: 树结构过滤即保留某些符合条件的节点，剪裁掉其它节点.
   * 一个节点是否保留在过滤后的数组中，取决于它是否有符合条件。可以传入一个函数描述符合条件的节点:
   * @param {any} tree
   * @param {any[]} result 返回的结果是个节点数组
   * @param {Function} func
   * @return {any[]}
   */
  static treeFilter(
    tree: any[] = [],
    result: any[] = [],
    func: Function
  ): any[] {
    for (const data of tree) {
      if (func(data)) {
        result.push(data);
      }
      if (data.sub) {
        this.treeFilter(data.sub, result, func);
      }
    }
    return result;
  }

  /**
   * @description: 字符串首字母大写
   * @param {string} str
   * @return {*}
   */
  static string2FirstUpper(str: string = ''): string {
    if (!str) return;
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }

  /**
   * 判断是否数组类型
   * @param value value
   */
  static isArray(value: any): boolean {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(value);
    } else {
      return Object.prototype.toString.call(value) === '[object Array]';
    }
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
        XnUtils.jsonToHump(v);
      })
    } else if (obj instanceof Object) {
      Object.keys(obj).forEach(function (key) {
        const newKey = XnUtils.underline2Hump(key);
        if (newKey !== key) {
          obj[newKey] = obj[key];
          delete obj[key];
        }
        XnUtils.jsonToHump(obj[newKey]);
      })
    }
  }

  /**
   *  JSON对象的key值转换为下划线格式
   * @param obj
   */
  static jsonToUnderline(obj: any) {
    if (obj instanceof Array) {
      obj.forEach((v) => XnUtils.jsonToUnderline(v));
    } else if (obj instanceof Object) {
      Object.keys(obj).forEach((key) => {
        const newKey = XnUtils.hump2Underline(key);
        if (newKey !== key) {
          obj[newKey] = obj[key];
          delete obj[key];
        }
        XnUtils.jsonToUnderline(obj[newKey]);
      });
    }
  }

   /**
   * 合并json数组
   * @param oldJsonArr
   * @param newJsonArr
   * @returns jsonArr
   */
    static mergeJsonArry(oldJsonArr: string, newJsonArr: string): string {
      const oldArr = JSON.parse(oldJsonArr) || [];
      const newArr = JSON.parse(newJsonArr) || [];
      const mergeArr = oldArr.reduce((pre: any, cur: any) => {
        newArr.push(cur)
        return newArr
      }, newArr);
      return JSON.stringify(mergeArr);
    }

  /**
   * json格式文件转arry
   * @param fileData
   */
   static jsonFileToArry(fileData: string) {
    if( XnUtils.isEmptys(fileData) ){
      return [];
    }

    if (isString(fileData) && !XnUtils.isZero(fileData)) {
      const fileArry = fileData ? JSON.parse(fileData) : [];
      if (Object.prototype.toString.call(fileArry[0]) === '[object String]') {
        const files = [];
        // 文件data是二维数组格式,将文件拼接在一个数组展示
        fileArry.forEach((fileJson: any, index: number) => {
          const subFiles = JSON.parse(fileJson);
          subFiles.forEach((subFile: any) => {
            files.push(subFile);
          });
        });
        return files;
      } else {
        return fileArry;
      }
    }
    return fileData;
  }

  /**
   * 滚动表格,固定列表列
   * @param tableRef table
   * @param scrollWidth 滚动距离
   */
  static scrollTable(tableRef: ElementRef, scrollWidth?: number) {
    const newtables = $(tableRef.nativeElement);
    if(scrollWidth) {
      newtables.scrollLeft(scrollWidth);
    } else {
      newtables.scrollLeft(0);
      setTimeout(() => {
        newtables.scrollLeft(5);
      },0);
    }
  }
}
enum EditflowSet {
  '/console/record/todo/edit/' = ProxyTypeEnum.CONSOLE,
  '/console/record/avenger/todo/edit/' = ProxyTypeEnum.AVENGER,
  '/logan/record/todo/edit/' = ProxyTypeEnum.VANKE_LOGAN,
  '/country-graden/record/todo/edit/' = ProxyTypeEnum.COUNTRY_GRADEN,
  '/new-gemdale/record/todo/edit/' = ProxyTypeEnum.NEW_GEMDALE,
  '/agile-xingshun/record/todo/edit/' = ProxyTypeEnum.AGILE_XINGSHUN,
  '/agile-hz/record/todo/edit/' = ProxyTypeEnum.AGILE_HZ,
  '/xn-gemdale/record/todo/edit/' = ProxyTypeEnum.XN_GEMDALE,
  '/zs-gemdale/record/todo/edit/' = ProxyTypeEnum.ZS_GEMDALE,
  '/xnvanke/record/todo/edit/' = ProxyTypeEnum.XNVANKE,
  '/xnlogan/record/todo/edit/' = ProxyTypeEnum.XNLOGAN,
  '/pslogan/record/todo/edit/' = ProxyTypeEnum.PSLOGAN,
}
enum ViewflowSet {
  '/console/record/todo/view/' = ProxyTypeEnum.CONSOLE,
  '/console/record/avenger/todo/view/' = ProxyTypeEnum.AVENGER,
  '/logan/record/todo/view/' = ProxyTypeEnum.VANKE_LOGAN,
  '/country-graden/record/todo/view/' = ProxyTypeEnum.COUNTRY_GRADEN,
  '/new-gemdale/record/todo/view/' = ProxyTypeEnum.NEW_GEMDALE,
  '/agile-xingshun/record/todo/view/' = ProxyTypeEnum.AGILE_XINGSHUN,
  '/agile-hz/record/todo/view/' = ProxyTypeEnum.AGILE_HZ,
  '/xn-gemdale/record/todo/view/' = ProxyTypeEnum.XN_GEMDALE,
  '/zs-gemdale/record/todo/view/' = ProxyTypeEnum.ZS_GEMDALE,
  '/xnvanke/record/todo/view/' = ProxyTypeEnum.XNVANKE,
  '/xnlogan/record/todo/view/' = ProxyTypeEnum.XNLOGAN,
  '/pslogan/record/todo/view/' = ProxyTypeEnum.PSLOGAN,
}

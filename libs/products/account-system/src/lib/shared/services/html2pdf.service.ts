/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\services\html2pdf.service.ts
* @summary：html页面转pdf文件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-12-13
***************************************************************************/
import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Injectable({ providedIn: 'root' })
export class Html2PdfService {

  constructor() { }

  /**
   * 将html页面导出为pdf文件---html2canvas+jspdf
   * @param elementId 截图区域元素
   * @param fileName 导出文件名
   * @returns
   */
  html2pdf(elementId: string, fileName: string) {
    return new Promise((resolve) => {
      if (!elementId) {
        console.error('未找到截图区域元素');
        resolve(null);
      } else {
        const element = document.getElementById(elementId);
        html2canvas(element, {
          logging: false     //一开始canvas设置不渲染页面
        }).then((canvas: any) => {
          const pdf: any = new jspdf('p', 'mm', 'a4') //纵向，单位mm，A4纸张大小
          const ctx: any = canvas.getContext('2d'); //预设2维画布
          //设置显示内容的大小，A4大小：210*297；最后显示在A4内部区域大小为：190*360
          const a4w: number = 190;
          const a4h: number = 260;
          //按A4显示比例换算一页图像的像素高度
          const imgHeight: number = Math.floor(a4h * canvas.width / a4w);
          let renderedHeight: number = 0;

          while (renderedHeight < canvas.height) {//判断页面有内容时
            let page: any = document.createElement('canvas'); //创建画布
            page.width = canvas.width; //设置画布宽高等于内容宽高
            page.height = Math.min(imgHeight, canvas.height - renderedHeight); //画布的高等于内容的最小的高度（不足一页）
            //用getImageData裁剪指定区域，并绘制到前面创建的canvas对象中
            let a: any = page.getContext('2d');
            a.putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0);
            pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height / page.width)); //添加图片到页面，保留10mm边距

            renderedHeight += imgHeight;
            if (renderedHeight < canvas.height) {
              pdf.addPage();
            }
          }
          pdf.save(fileName);
          resolve(pdf);
        });
      }
    })

  }
}

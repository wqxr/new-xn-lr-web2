/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：PdfViewService
 * @summary：浏览器预览pdf,多张可切换、缩放、旋转, 图片旋转、的缩放
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          查看pdf         2019-03-25
 * **********************************************************************
 */

import { Injectable } from '@angular/core';
import 'pdfjs-dist/build/pdf.js';

PDFJS.workerSrc = 'assets/pdfjs/_pdf.worker.js';
PDFJS.cMapUrl = 'assets/pdfjs/cmaps/';
PDFJS.cMapPacked = true;

PDFJS.verbosity = (PDFJS as any).VERBOSITY_LEVELS.errors;

declare var PDFJS: any;
declare let $: any;

let loadingTasks = [];

@Injectable({ providedIn: 'root' })
export class DragonPdfViewService {
    public m_init = false;
    private pdfDoc: any = null;
    private pageNum: number;
    private pageRendering: boolean;
    private pageNumPending: any;
    private scale: number;
    private rotate: number;
    public totalNum: number;
    public getTopage: any;

    // 图片初始大小
    public m_scaleValue = 0.6;

    /**
     * pdf转成canvas
     */
    public pdfToCanvas(url: string): void {
        this.pageRendering = false;
        this.pageNumPending = null;
        this.scale = 1.6;
        this.pageNum = 1;
        this.rotate = 0;

        const self = this;
        /**
         * Get page info from document, resize canvas accordingly, and render page.
         * @param num Page number.
         */
        const renderPage = (num) => {
            const canvas = document.getElementById('thisCanvas') as HTMLCanvasElement;
            if (!canvas) {
                return;
            }
            const ctx = canvas.getContext('2d');
            self.pageRendering = true;
            self.pdfDoc.getPage(num).then((page) => {
                const viewport = page.getViewport(self.scale, self.rotate);
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                const renderContext = {
                    canvasContext: ctx,
                    viewport
                };

                const renderTask = page.render(renderContext);
                renderTask.promise.then(() => {
                    self.pageRendering = false;
                    if (self.pageNumPending !== null) {
                        renderPage(self.pageNumPending);
                        self.pageNumPending = null;
                    }
                });
            });
            try {
                // document.getElementById('page_num').textContent = self.pageNum.toString();
            } catch (e) {
            }
        };

        /**
         * If another page rendering in progress, waits until the rendering is
         * finised. Otherwise, executes rendering immediately.
         */
        const queueRenderPage = (num) => {
            if (self.pageRendering) {
                self.pageNumPending = num;
            } else {
                renderPage(num);
            }
        };
        const goPage = () => {
            const currentPage = (document.getElementById('getpageNum') as HTMLInputElement).value;
            if (self.pageRendering === true || Number(currentPage) < 1 || Number(currentPage) > self.pdfDoc.numPages) {
                return;
            } else {
                self.pageNum = Number(currentPage);
                queueRenderPage(self.pageNum);

            }
        };

        /**
         * 上一页
         */
        const onPrevPage = () => {
            if (self.pageRendering === true || self.pageNum <= 1) {
                return;
            }
            self.pageNum--;
            queueRenderPage(self.pageNum);
        };


        /**
         * 下一页
         */
        const onNextPage = () => {
            if (self.pageRendering === true || self.pageNum >= self.pdfDoc.numPages) {
                return;
            }
            self.pageNum++;
            queueRenderPage(self.pageNum);
        };

        /**
         *  放大，缩小
         */
        const scaleLarge = () => {
            if (self.pageRendering === true) { // 当有canvas 有渲染是，直接跳过。防止多次调用
                return;
            }
            self.scale += 0.2;
            queueRenderPage(self.pageNum);
        };

        const scaleSmall = () => {
            if (self.pageRendering === true) {
                return;
            }
            if (self.scale < 0.5) {
                return;
            }
            self.scale -= 0.2;
            queueRenderPage(self.pageNum);
        };

        this.getTopage = (pageNum) => {
            self.pageNum = pageNum;
            queueRenderPage(pageNum);
        };

        /**
         *  旋转
         */
        const rotateLeft = () => {
            if (self.pageRendering === true) {
                return;
            }
            self.rotate -= 90;
            queueRenderPage(self.pageNum);
        };

        const rotateRight = () => {
            if (self.pageRendering === true) {
                return;
            }
            self.rotate += 90;
            queueRenderPage(self.pageNum);
        };

        if (!this.m_init) {
            document.getElementById('large').removeEventListener('click', scaleLarge);
            document.getElementById('large').addEventListener('click', scaleLarge);
            document.getElementById('small').removeEventListener('click', scaleSmall);
            document.getElementById('small').addEventListener('click', scaleSmall);
            document.getElementById('left').removeEventListener('click', rotateLeft);
            document.getElementById('left').addEventListener('click', rotateLeft);
            document.getElementById('right').removeEventListener('click', rotateRight);
            document.getElementById('right').addEventListener('click', rotateRight);
            this.m_init = true;
        }


        /**
         * 异步下载pdf
         */
         const loadingTask = PDFJS.getDocument({ url, withCredentials: true });
         loadingTasks.push(loadingTask);
         loadingTask.then((pdfDoc_) => {
            self.pdfDoc = pdfDoc_;
            // document.getElementById('page_count').textContent = self.pdfDoc.numPages;
            this.totalNum = self.pdfDoc.numPages;
            renderPage(self.pageNum);
        });
    }

    /**
     * 图片缩放
     * @param params 操作行为 large,small,最大1.5 最小0.3
     * @param innerImg
     * @param outerImg
     * @param imgContainer
     */
    public scaleImg(params: string, innerImg: any, outerImg: any, imgContainer: any): number {
        const num = params === 'large' ? 1 : -1;
        if (params === 'small' && this.m_scaleValue > 0.3 || params === 'large' && this.m_scaleValue < 1.5) {
            this.m_scaleValue = parseFloat((this.m_scaleValue + num * .1).toFixed(1));
        }
        const $innerImg = $(innerImg);
        $innerImg.css({ width: `${this.m_scaleValue * 100}%` });
        const degree = this.getRotationDegrees($innerImg);
        const p = this.m_scaleValue >= 0.6 ? 1 : -1; // 放大向右移，缩小向左移
        const marginLeft = Math.abs(degree) % 180 !== 0 && $innerImg.width() < $innerImg.height()
            ? ($innerImg.width() * this.m_scaleValue * p)
            : 0;
        const marginTop = Math.abs(degree) % 180 !== 0 && $innerImg.width() > $innerImg.height()
            ? ($innerImg.height() * this.m_scaleValue * p)
            : 0;
        $innerImg.animate({
            marginLeft : `${marginLeft}px`,
            marginTop: `${marginTop / 2}px`
        });

        return this.m_scaleValue;
    }

    /**
     * 图片的旋转
     * @param direction 旋转方向 left ,right
     * @param degree 旋转角度
     * @param innerImg
     * @param outerImg
     * @param imgContainer
     * @param scaleValue
     */
    public rotateImg(direction: any,
                     degree: number = 0,
                     innerImg: any,
                     outerImg: any,
                     imgContainer: any,
                     scaleValue?: number): number {
        let scale = 0.6;
        if (direction === 'left') {
            degree = degree - 90;
        } else if (direction === 'right') {
            degree = degree + 90;
        }
        // 没有缩放大小，默认为.6
        if (!!scaleValue) {
            scale = scaleValue;
        }

        const $innerImg = $(innerImg);
        $innerImg.css({ transform: 'rotate(' + degree + 'deg)', 'transform-origin': 'center center' });

        const margin = Math.abs(degree) % 180 !== 0 && $innerImg.width() < $innerImg.height()
        ? ($innerImg.height() - $innerImg.width()) / 2
        : ($innerImg.width() > $innerImg.height() ? ($innerImg.width() - $innerImg.height()) / 2 : 0);
        $innerImg.animate({
            marginLeft: margin,
            marginTop: Math.abs(degree) % 180 !== 0 && $innerImg.width() > $innerImg.height() ? margin : 0
        });

        const $imgContainer = $(imgContainer);
        $imgContainer.scrollLeft((innerImg.width - $(outerImg).width()) / 2);
        // 开启硬件加速
        // $(outerImg).css({ 'transform': 'rotate(' + degree + 'deg)' });

        // let inner_Img = $(innerImg);
        // let translateXpxTemp: number = 0;
        // // 图片宽度大于高度，旋转时下移
        // if (inner_Img.width() > inner_Img.height()) {
        //     translateXpxTemp = Number((inner_Img.width() - inner_Img.height()) / 2);
        // }
        // if (Math.abs(degree) % 180 === 0) {
        //     translateXpxTemp = 0;
        // } else {
        //     translateXpxTemp = translateXpxTemp * degree / Math.abs(degree);
        //     if ((Math.abs(degree) % 360) % 270 === 0) {
        //         translateXpxTemp = -translateXpxTemp;
        //     }
        // }
        // $(innerImg).css({ 'width': `${scale * 100}%`, 'transform': `translateX(${translateXpxTemp}px)` });
        return degree;
    }

    /**
     * 修改成员值
     * @param key
     * @param value
     */
    public setMemberValue(key: string, value: boolean | number): void {
        this[key] = value;
    }

    public onDestroy() {
      console.log('on destroy >>', loadingTasks);
      loadingTasks.forEach(item => {
        item.destroy()
      });
      loadingTasks = [];
    };

    /**
     * 获取节点旋转角度
     * @param obj 节点对象
     */
    private getRotationDegrees(obj) {
        const matrix = obj.css('-webkit-transform') ||
        obj.css('-moz-transform')    ||
        obj.css('-ms-transform')     ||
        obj.css('-o-transform')      ||
        obj.css('transform');
        let angle = 0;
        if (matrix !== 'none') {
            const values = matrix.split('(')[1].split(')')[0].split(',');
            const a = values[0];
            const b = values[1];
            angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        }
        return (angle < 0) ? angle + 360 : angle;
    }
}
interface SquareConfig {
    pageNum: number;
}

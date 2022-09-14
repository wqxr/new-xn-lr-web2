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
import { Subject } from 'rxjs';
PDFJS.workerSrc = 'assets/pdfjs/_pdf.worker.js';
PDFJS.cMapUrl = 'assets/pdfjs/cmaps/';
PDFJS.cMapPacked = true;

PDFJS.verbosity = (PDFJS as any).VERBOSITY_LEVELS.errors;

declare var PDFJS: any;
declare let $: any;

let loadingTasks = [];

@Injectable()
export class PdfViewService {
  public m_init = false;
  private pdfDoc: any = null;
  private pageNum: number;
  private pageRendering: boolean;
  private pageNumPending: any;
  private scale: number;
  private rotate: number;
  // 用基于服务的订阅来更新pdf加载状态
  private pdfLoading = new Subject<boolean>();
  pdfLoading$ = this.pdfLoading.asObservable();

  // 图片初始大小
  public m_scaleValue = 0.6;

  /**
   * pdf转成canvas
   */
  public pdfToCanvas(url, type?: string): void {
    this.pageRendering = false;
    this.pageNumPending = null;
    this.scale = 1;
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
          viewport,
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
        document.getElementById('page_num').textContent =
          self.pageNum.toString();
      } catch (e) {}
    };

    const pdfStreamRenderPage = (num) => {
      // 一串pdf64位的流的放大缩小旋转
      if (self.pageRendering) {
        self.pageNumPending = num;
      } else {
        const container = document
          .getElementById('thisCanvas1')
          .getElementsByTagName('canvas');
        for (let i = 1; i <= container.length; i++) {
          self.pageRendering = true;
          self.pdfDoc.getPage(i).then((page) => {
            const viewport = page.getViewport(self.scale, self.rotate);
            container[i - 1].height = viewport.height;
            container[i - 1].width = viewport.width;
            const ctx = container[i - 1].getContext('2d');
            const renderContext = {
              canvasContext: ctx,
              viewport,
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
        }
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
      const currentPage = (
        document.getElementById('getpageNum') as HTMLInputElement
      ).value;
      if (
        self.pageRendering === true ||
        Number(currentPage) < 1 ||
        Number(currentPage) > self.pdfDoc.numPages
      ) {
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
      if (self.pageRendering === true) {
        // 当有canvas 有渲染是，直接跳过。防止多次调用
        return;
      }
      self.scale += 0.2;
      if (type && (type === 'cfca' || type === 'urlallPdf')) {
        pdfStreamRenderPage(self.pageNum);
      } else {
        queueRenderPage(self.pageNum);
      }
    };

    const scaleSmall = () => {
      if (self.pageRendering === true) {
        return;
      }
      if (self.scale < 0.5) {
        return;
      }
      self.scale -= 0.2;
      if (type && (type === 'cfca' || type === 'urlallPdf')) {
        pdfStreamRenderPage(self.pageNum);
      } else {
        queueRenderPage(self.pageNum);
      }
    };

    /**
     *  旋转
     */
    const rotateLeft = () => {
      if (self.pageRendering === true) {
        return;
      }
      self.rotate -= 90;
      if (type && (type === 'cfca' || type === 'urlallPdf')) {
        pdfStreamRenderPage(self.pageNum);
      } else {
        queueRenderPage(self.pageNum);
      }
    };

    const showAll = (self, context, numtotal) => {
      const loadingTask = PDFJS.getDocument(context);
      loadingTasks.push(loadingTask);
      loadingTask.then(function getPdfHelloWorld(pdf) {
        let promise = Promise.resolve();
        const container = document.getElementById('thisCanvas1');
        if ($('#thisCanvas1').children().length > 0) {
          $('#thisCanvas1').children().remove();
        }
        for (let i = 1; i <= numtotal; i++) {
          promise = promise.then(
            function (id) {
              return pdf.getPage(id).then(function getPageHelloWorld(page) {
                const viewport = page.getViewport(self.scale, self.rotate);
                const canvas = document.createElement('canvas');
                canvas.id = i + 'canvas';
                const contexts = canvas.getContext('2d');
                // const radio = self.getPixelRatio(contexts);
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                // 这里拿body当pdf容器
                container.appendChild(canvas);
                page.render({ canvasContext: contexts, viewport });
              });
            }.bind(null, i)
          );
        }
        return promise;
      });
    };
    const showPdf = (self, context) => {
      const loadingTask = PDFJS.getDocument(context);
      loadingTasks.push(loadingTask);
      loadingTask.then(function getPdfHelloWorld(pdf) {
        const canvas1 = document.getElementById(
          'thisCanvas'
        ) as HTMLCanvasElement;
        if (canvas1 !== null) {
          canvas1.remove();
        }
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'thisCanvas');
        const container = document.getElementById('pdfcontainer');
        return pdf.getPage(self.pageNum).then(function getPageHelloWorld(page) {
          const scale = 1.4;
          const viewport = page.getViewport(scale);
          const contexts = canvas.getContext('2d');
          // const radio = self.getPixelRatio(contexts);
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          container.appendChild(canvas);
          // 这里拿body当pdf容器
          page.render({ canvasContext: contexts, viewport });
        });
      });
    };
    const rotateRight = () => {
      if (self.pageRendering === true) {
        return;
      }
      self.rotate += 90;
      if (type && (type === 'cfca' || type === 'urlallPdf')) {
        pdfStreamRenderPage(self.pageNum);
      } else {
        queueRenderPage(self.pageNum);
      }
    };

    if (!this.m_init) {
      if (!!document.getElementById('prev')) {
        document
          .getElementById('prev')
          .removeEventListener('click', onPrevPage);
        document.getElementById('prev').addEventListener('click', onPrevPage);
      }
      if (!!document.getElementById('next')) {
        document
          .getElementById('next')
          .removeEventListener('click', onNextPage);
        document.getElementById('next').addEventListener('click', onNextPage);
      }
      if (!!document.getElementById('large')) {
        document
          .getElementById('large')
          .removeEventListener('click', scaleLarge);
        document.getElementById('large').addEventListener('click', scaleLarge);
      }
      if (!!document.getElementById('small')) {
        document
          .getElementById('small')
          .removeEventListener('click', scaleSmall);
        document.getElementById('small').addEventListener('click', scaleSmall);
      }
      if (!!document.getElementById('left')) {
        document
          .getElementById('left')
          .removeEventListener('click', rotateLeft);
        document.getElementById('left').addEventListener('click', rotateLeft);
      }
      if (!!document.getElementById('right')) {
        document
          .getElementById('right')
          .removeEventListener('click', rotateRight);
        document.getElementById('right').addEventListener('click', rotateRight);
      }

      if (document.getElementById('gotoPage') !== null) {
        document
          .getElementById('gotoPage')
          .removeEventListener('click', goPage);
        document.getElementById('gotoPage').addEventListener('click', goPage);
      }

      this.m_init = true;
    }
    if (type && type === 'cfca') {
      // 后台返回一串base64的PDF流 并且PDF在一页全部展示
      this.signContract(url, self, showAll);
    } else if (type && type === 'showpdf') {
      // 后台返回一串base64的PDF流 并且分页展示
      this.signContract(url, self, showPdf);
    } else if (type && type === 'urlallPdf') {
      this.viewpdfContract(url, self); // 后台返回的文件地址，pdf文件在一页展示
    } else {
      this.viewContract(url, self, renderPage); // 后台返回的文件地址，分页展示
    }
  }
  /**
   * 异步下载pdf
   *
   */
  viewContract(url, self, renderPage) {
    this.pdfLoading.next(true);
    const loadingTask = PDFJS.getDocument({ url, withCredentials: true });
    loadingTasks.push(loadingTask);
    loadingTask.then(
      (pdfDoc) => {
        self.pdfDoc = pdfDoc;
        document.getElementById('page_count').textContent =
          self.pdfDoc.numPages;
        renderPage(self.pageNum);
        this.pdfLoading.next(false);
      },
      (reject) => {
        this.pdfLoading.next(false);
        console.log('错误信息', reject);
      }
    );
  }
  // pdf展示所有页码
  viewpdfContract(url, self) {
    const loadingTask = PDFJS.getDocument({ url, withCredentials: true });
    loadingTasks.push(loadingTask);
    loadingTask.then((pdfDoc) => {
      self.pdfDoc = pdfDoc;
      const container = document.getElementById('thisCanvas1');
      let promise = Promise.resolve();
      $(container).empty();
      for (let i = 1; i <= self.pdfDoc.numPages; i++) {
        // tslint:disable-next-line: only-arrow-functions
        promise = promise.then(
          function (id) {
            const canvas = document.createElement('canvas');
            const contexts = canvas.getContext('2d');
            // self.pageRendering = true;
            return self.pdfDoc.getPage(id).then((page) => {
              const viewport = page.getViewport(self.scale, self.rotate);
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              const renderContext = {
                canvasContext: contexts,
                viewport,
              };
              container.appendChild(canvas);
              page.render(renderContext);
            });
          }.bind(null, i)
        );
      }
      return promise;
    });
  }

  signContract(url, self, showAll) {
    const container = document.getElementById(
      'thisCanvas'
    ) as HTMLCanvasElement;
    $(container).empty();
    const fileContent = this.converData(url);
    $('#container').show();
    $('#pop').empty();
    const loadingTask = PDFJS.getDocument(fileContent);
    loadingTasks.push(loadingTask);
    loadingTask.then(function getPdfHelloWorld(pdf) {
      self.pdfDoc = pdf;
      showAll(self, fileContent, self.pdfDoc.numPages);
    });
  }

  getPixelRatio(context) {
    const backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    return (window.devicePixelRatio || 1) / backingStore;
  }

  /**
   * 图片缩放
   * @param params 操作行为 large,small,最大1.5 最小0.3
   * @param innerImg
   * @param outerImg
   * @param imgContainer
   */
  public scaleImg(
    params: string,
    innerImg: any,
    outerImg: any,
    imgContainer: any
  ): number {
    const num = params === 'large' ? 1 : -1;
    if (
      (params === 'small' && this.m_scaleValue > 0.3) ||
      (params === 'large' && this.m_scaleValue < 1.5)
    ) {
      this.m_scaleValue = parseFloat(
        (this.m_scaleValue + num * 0.1).toFixed(1)
      );
    }
    const $innerImg = $(innerImg);
    $innerImg.css({ width: `${this.m_scaleValue * 100}%` });
    const degree = this.getRotationDegrees($innerImg);
    const p = this.m_scaleValue >= 0.6 ? 1 : -1; // 放大向右移，缩小向左移
    const marginLeft =
      Math.abs(degree) % 180 !== 0 && $innerImg.width() < $innerImg.height()
        ? $innerImg.width() * this.m_scaleValue * p
        : 0;
    const marginTop =
      Math.abs(degree) % 180 !== 0 && $innerImg.width() > $innerImg.height()
        ? $innerImg.height() * this.m_scaleValue * p
        : 0;
    $innerImg.animate({
      marginLeft: `${marginLeft}px`,
      marginTop: `${marginTop / 2}px`,
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
  public rotateImg(
    direction: any,
    degree: number = 0,
    innerImg: any,
    outerImg: any,
    imgContainer: any,
    scaleValue?: number
  ): number {
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
    $innerImg.css({
      transform: 'rotate(' + degree + 'deg)',
      'transform-origin': 'center center',
    });

    const margin =
      Math.abs(degree) % 180 !== 0 && $innerImg.width() < $innerImg.height()
        ? ($innerImg.height() - $innerImg.width()) / 2
        : $innerImg.width() > $innerImg.height()
        ? ($innerImg.width() - $innerImg.height()) / 2
        : 0;
    $innerImg.animate({
      marginLeft: margin,
      marginTop:
        Math.abs(degree) % 180 !== 0 && $innerImg.width() > $innerImg.height()
          ? margin
          : 0,
    });

    const $imgContainer = $(imgContainer);
    $imgContainer.scrollLeft((innerImg.width - $(outerImg).width()) / 2);

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
  /**
   * 获取节点旋转角度
   * @param obj 节点对象
   */
  private getRotationDegrees(obj) {
    const matrix =
      obj.css('-webkit-transform') ||
      obj.css('-moz-transform') ||
      obj.css('-ms-transform') ||
      obj.css('-o-transform') ||
      obj.css('transform');
    let angle = 0;
    if (matrix !== 'none') {
      const values = matrix.split('(')[1].split(')')[0].split(',');
      const a = values[0];
      const b = values[1];
      angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }
    return angle < 0 ? angle + 360 : angle;
  }

  converData(data) {
    // 对base64文件流解码
    data = data.replace(/[\n\r]/g, '');
    const raw = window.atob(data);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
  // /*将解码后的值传给PDFJS.getDocument(),交给pdf.js处理*/
  // showPdfFile(data) {
  //     const fileContent = this.converData(data);
  //     $('#container').show();
  //     $('#pop').empty();
  //     PDFJS.getDocument(fileContent).then(function getPdfHelloWorld(pdf) {
  //         //  pdf.numPages;
  //         console.log(pdf.numPages);
  //         // renderPage(pdf.numPages)
  //         // for (var i = 1; i < pdf.numPages; i++) {
  //         //     var id = 'page-id' + i;
  //         //     $('#pop').append('<canvas id="' + id + '"></canvas>');
  //         //     this.showAll(url, i, id)
  //         // }
  //     });
  // }
  /**
   * 上一页
   */
  public onPrevPage = () => {
    if (this.pageRendering === true || this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    // queueRenderPage(this.pageNum);
  };

  /**
   * 下一页
   */
  public onNextPage = () => {
    if (this.pageRendering === true || this.pageNum >= this.pdfDoc.numPages) {
      return;
    }
    this.pageNum++;
    // queueRenderPage(this.pageNum);
  };

  public onDestroy = () => {
    console.log('on destroy >>', loadingTasks);
    loadingTasks.forEach(item => {
      item.destroy()
    });
    loadingTasks = [];
  };
}

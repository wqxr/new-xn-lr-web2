/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\_components\carousel.component.ts
 * @summary：init carousel.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-17
 ***************************************************************************/
import { Component, AfterViewInit, ViewChild, Input } from '@angular/core';
import { StoreService } from '../shared/services/store.service';

@Component({
  selector: 'carousel',
  template: `
  <div [ngClass]="[store.isPhone ? 'h5-carousel' : 'carousel']" #carousel>
  <div class="item" *ngFor="let img of imgList;">
    <div class="title">{{img.title}}</div>
    <img [src]="store.isPhone ? img.h5Src : img.src" [alt]="img.alt" />
    <div class="tip">以上为部分企业，随机排序</div>
  </div>
</div>
  `,
  styleUrls: ['./styles.less'],
})
export class CarouselComponent implements AfterViewInit {
  @Input() imgList: any[] = [];
  @ViewChild('carousel') carousel: any;
  private current = 0;
  private timer: any = null; // 定时器
  private autoTime = 3000; // 设置定时器时间
  constructor(public store: StoreService) { }
  setImageStyle(imgDomList: any[]) {
    const len = imgDomList.length;
    const arr = Array.from({ length: len }, (v, i) => i);
    const setStyleArr = [];
    let leftImgIndex = 0;
    let rightImgIndex = 0;
    for (let i = 0; i < 2; i++) {
      leftImgIndex = len + this.current - i - 1;   // 左边： 6 + 0 - 0 - 1 = 5  6 + 0 - 1 - 1 = 4
      rightImgIndex = this.current + i + 1;     // 右边： 0 + 1 = 1    0 + 1 + 1 = 2
      // 头尾衔接循环
      if (leftImgIndex >= len) {
        leftImgIndex -= len;
      }
      // 尾不在当前显示
      if (rightImgIndex >= len) {
        rightImgIndex -= len;
      }
      setStyleArr.push(leftImgIndex);
      setStyleArr.push(rightImgIndex);
      imgDomList[leftImgIndex].style.transform = `scale(${1 - 0.1 * (i + 1)}, ${1 - 0.1 * (i + 1)})`;
      imgDomList[leftImgIndex].style.zIndex = `${100 - 10 * (i + 1)}`;
      imgDomList[leftImgIndex].style.marginLeft = this.store.isPhone ? `${((-(305 / 2 / 75) + 0.8) - 3 * (i + 1))}rem` : `${-460 - 120 * (i + 1)}px`;
      imgDomList[rightImgIndex].style.transform = `scale(${1 - 0.1 * (i + 1)}, ${1 - 0.1 * (i + 1)})`;
      imgDomList[rightImgIndex].style.zIndex = `${100 - 10 * (i + 1)}`;
      imgDomList[rightImgIndex].style.marginLeft = this.store.isPhone ? `${((-(305 / 2 / 75) + 0.5) + 2 * (i + 1))}rem` : `${-460 + 120 * (i + 1)}px`;
    }
    setStyleArr.push(this.current);
    imgDomList[this.current].style.transform = `scale(1, 1)`;
    imgDomList[this.current].style.zIndex = `100`;
    imgDomList[this.current].style.marginLeft = this.store.isPhone ? `${-(305 / 2 / 75)}rem` : `-460px`;
    const unSetStyleArr = arr.filter(v => setStyleArr.every(d => v !== d));
    unSetStyleArr.forEach(v => {
      imgDomList[v].style.transform = `scale(0.5, 0.5)`;
      imgDomList[v].style.zIndex = `10`;
      imgDomList[v].style.marginLeft = this.store.isPhone ? `${-(305 / 2 / 75)}rem` : `-460px`;
    });
  }
  setImageRun(imgDomList: any[]) {
    Array.from(imgDomList).forEach((c: any, i: number) => {
      if (this.store.isPhone) {
        let [startX, startY, moveX, moveY, endX, endY] = [0, 0, 0, 0, 0, 0];
        // touch-start
        c.ontouchstart = (s) => {
          const startTouch = s.touches[0];
          endX = 0;
          endY = 0;
          startX = startTouch.pageX;
          startY = startTouch.pageY;
          clearInterval(this.timer);
        };
        // touch-move
        c.ontouchmove = (m) => {
          m.stopPropagation();
          const moveTouch = m.touches[0];
          moveX = moveTouch.pageX;
          moveY = moveTouch.pageY;
          endX = moveX - startX;
          endY = moveY - startY;
          if (Math.abs(endX) > Math.abs(endY)) {
            m.preventDefault();
          }
          clearInterval(this.timer);
        };
        // touch-end
        c.ontouchend = (e) => {
          if (Math.abs(endX) > Math.abs(endY)) {
            if (endX > 10) {
              // 右移
              if (this.current > 0) {
                this.current--;
              } else {
                this.current = imgDomList.length - 1;
              }
            } else if (endX < -10) {
              // 左移
              if (this.current < imgDomList.length - 1) {
                this.current++;
              } else {
                this.current = 0;
              }
            }
          }
          this.setImageStyle(imgDomList);
          this.handleAutoplay(imgDomList);
        };
        // c.onclick = (e: any) => {
        //   this.current = i;
        //   this.setImageStyle(imgDomList);
        // };
      } else {
        // 点击切换
        c.onclick = (e: any) => {
          this.current = i;
          this.setImageStyle(imgDomList);
        };
        // 鼠标进入时移除定时器
        c.onmouseenter = (e: any) => {
          clearInterval(this.timer);
        };
        // 鼠标离开时启动定时器
        c.onmouseleave = (e: any) => {
          this.handleAutoplay(imgDomList);
        };
      }
    });
  }
  // 自动切换图片定时器
  handleAutoplay(imgDomList: any[]) {
    const len = imgDomList.length;
    this.timer = setInterval(() => {
      if (this.current >= len - 1) {
        this.current = 0;
      } else {
        this.current++;
      }
      this.setImageStyle(imgDomList);
    }, this.autoTime);
  }
  ngAfterViewInit() {
    const imgDomList: any[] = this.carousel.nativeElement.children;
    this.setImageStyle(imgDomList);
    this.setImageRun(imgDomList);
    this.handleAutoplay(imgDomList);
  }
}

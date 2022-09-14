/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：ElementDragDirective
 * @summary：元素拖动
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-18
 * **********************************************************************
 */

import {Directive, ElementRef, HostListener, OnInit} from '@angular/core';

@Directive({selector: '[elementDragDirective]'})
export class ElementDragDirective implements OnInit {
    constructor(public el: ElementRef) {
    }

    public isDown = false; // 判断该元素是否被点击了
    public disX: number; // 记录鼠标点击事件的位置 X
    public disY: number; // 记录鼠标点击事件的位置 Y
    private totalOffsetX = 0; // 记录总偏移量 X轴
    private totalOffsetY = 0; // 记录总偏移量 Y轴

    private defaultX = 30; // 初始偏移量 X轴
    private defaultY = 30; // 初始偏移量 Y轴

    private clientHeight = document.body.clientHeight; // 浏览器视图高
    private clientWidth = document.body.clientWidth; // 浏览器视图宽

    /**
     * 点击事件,记录鼠标点击即元素初始位置
     * @param event
     */
    @HostListener('mousedown', ['$event']) onMousedown(event) {
        this.isDown = true;
        this.disX = event.clientX;
        this.disY = event.clientY;
    }

    /**
     * 监听document移动事件
     * @param event
     */
    @HostListener('document:mousemove', ['$event']) onMousemove(event) {
        if (this.isDown) {
            const x = this.totalOffsetX + this.disX - event.clientX + this.defaultX;
            const y = this.totalOffsetY + this.disY - event.clientY + this.defaultY;
            if (x > 0 && x < this.clientWidth && y > 0 && y < this.clientHeight) {
                this.el.nativeElement.style.right = x + 'px';
                this.el.nativeElement.style.bottom = y + 'px';
            }
        }
    }

    /**
     * 监听document离开事件,只用当元素移动过了，离开函数体才会触发。
     * @param event
     */
    @HostListener('document:mouseup', ['$event']) onMouseup(event) {
        if (this.isDown) {
            this.totalOffsetX += this.disX - event.clientX;
            this.totalOffsetY += this.disY - event.clientY;
            this.isDown = false;
        }
    }

    ngOnInit() {
    }
}

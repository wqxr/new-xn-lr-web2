/*************************************************************************
 * Copyright (c) 2017 - 2020 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\file-sign\file-sign.component.ts
 * @summary：init file-sign.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  yutianbao        init             2020-09-09
 ***************************************************************************/
import { Component, Input, OnInit, ViewChild, ElementRef, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { NgxViewerDirective } from 'ngx-viewer';
import { FileInfo } from './interface';

@Component({
  selector: 'xn-file-sign',
  templateUrl: './file-sign.component.html',
  styleUrls: ['./file-sign.component.less'],
})
export class FileSignComponent implements OnInit, OnChanges {
  @Input() files: FileInfo[];
  @Input() current: any;

  @ViewChild(NgxViewerDirective) tplViewer: NgxViewerDirective;
  @ViewChild('content') picContainer: ElementRef;

  index = 0;
  zoom = 1;
  rotation = 0;
  loading = true;

  viewerOptions = {
    navbar: false,
    inline: true,
    loop: false,
    backdrop: false,
    toolbar: false,
    button: false,
    container: null,
  };

  private readonly zoomRatio = 0.2;

  private readonly rotateAngle = 90;

  get url() {
    return this.files && this.index > -1 && this.files[this.index] ? this.files[this.index].url : '';
  }

  get fileName() {
    return this.files && this.index > -1 && this.files[this.index] ? this.files[this.index].fileName : '';
  }

  get isPdf() {
    return this.url.endsWith('pdf');
  }

  constructor() {
    this.viewerOptions.container = this.picContainer;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.files){
      this.index = 0;
    }
  }

  ngOnInit() {
    this.index = this.current
      ? this.files.findIndex((x) => x.url === this.current.url)
      : 0;
  }

  onPrev() {
    this.showLoading();
    if (this.index === 0) {
      this.index = this.files.length - 1;
    } else {
      this.index -= 1;
    }
    this.viewerUpdate();
  }

  onNext() {
    this.showLoading();
    if (this.index < this.files.length - 1) {
      this.index += 1;
    } else {
      this.index = 0;
    }
    this.viewerUpdate();
  }

  onZoomIn() {
    this.zoom += this.zoomRatio;
    this.viewerZoom();
  }

  onZoomOut() {
    this.zoom -= this.zoomRatio;
    this.viewerZoom();
  }

  onRotationLeft() {
    this.rotation -= this.rotateAngle;
    this.viewerRotation();
  }

  onRotationRight() {
    this.rotation += this.rotateAngle;
    this.viewerRotation();
  }

  onViewerViewed() {
    this.zoom = 1;
    this.viewerZoom();
  }

  closeLoading() {
    this.loading = false;
  }

  showLoading() {
    this.loading = true;
  }

  private viewerUpdate() {
    if (!this.isPdf) {
      setTimeout(() => {
        this.tplViewer?.instance?.update();
        this.closeLoading();
      }, 200);
    }
  }

  private viewerZoom() {
    if (!this.isPdf) {
      this.tplViewer.instance.zoomTo(this.zoom);
    }
  }

  private viewerRotation() {
    if (!this.isPdf) {
      this.tplViewer.instance.rotateTo(this.rotation);
    }
  }
}

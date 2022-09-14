/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\file-viewer\file-viewer.component.ts
* @summary：init file-viewer.component.ts
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-01
***************************************************************************/
import { Component, Input, OnInit, ViewChild, ElementRef, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { NgxViewerDirective } from 'ngx-viewer';
import { ScrollEvent } from '../../directives';
import { FileInfo } from './interface';

@Component({
  selector: 'xn-protocol-file-viewer',
  templateUrl: './protocol-file-viewer.component.html',
  styleUrls: ['./protocol-file-viewer.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ProtocolFileViewerComponent implements OnInit {
  @Input() files: FileInfo[] = [];
  @Input() current!: FileInfo;
  @Input() showTools = true;
  @Input() viewerHeight = 400;
  @Input() originalSize = false;
  @Output() onSrcollEvent = new EventEmitter<ScrollEvent>();
  @Input() bottomOffset = 50;
  @Input() topOffset = 50;

  @ViewChild(NgxViewerDirective) tplViewer!: NgxViewerDirective;
  @ViewChild('content') picContainer!: ElementRef;

  index = 0;
  zoom = 0.85;
  rotation = 0;
  loading = true;

  viewerOptions = {
    navbar: false,
    inline: true,
    loop: false,
    backdrop: false,
    toolbar: false,
    button: false,
    container: this.picContainer,
  };

  private readonly zoomRatio = 0.15;

  private readonly rotateAngle = 90;

  get url() {
    return this.files && this.index > -1 ? this.files[this.index].url : '';
  }

  get isPdf() {
    // return this.url.endsWith('pdf');
    return true;
  }

  get isImage() {
    return this.url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }

  constructor() { }

  ngOnInit() {
    this.index = this.current
      ? this.files.findIndex((x) => x.url === this.current.url)
      : 0;
  }

  checkSrc(src: any) {
    return src !== '/' && src !== null && src !== '';
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
    this.zoom = 0.7;
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

  handleScroll(event: ScrollEvent) {
    this.onSrcollEvent.emit(event);
  }
}

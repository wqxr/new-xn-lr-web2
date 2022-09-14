/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\mfile-viewer\mfile-viewer.component.ts
 * @summary：init mfile-viewer.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 yutianabo        init             2020-09-09
 ***************************************************************************/
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgxViewerDirective } from 'ngx-viewer';
import { FileInfo } from './interface';

@Component({
  selector: 'xn-mfile-viewer',
  templateUrl: './mfile-viewer.component.html',
  styleUrls: ['./mfile-viewer.component.less'],
})
export class MFileViewerComponent implements OnInit {
  @Input() files: FileInfo[];
  @Input() current: FileInfo;
  @Input() showTools = true;
  @Input() width = '100%';
  @Input() height = '450px';

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

  get isImage() {
    return this.url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }

  constructor() {
    this.viewerOptions.container = this.picContainer;
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

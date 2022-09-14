import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  selector: 'zd-mfiles',
  templateUrl: './zd-mfile-component.html',
  styleUrls: ['./zd-change-new-component.less'],
})
export class InvoiceFileViewlComponent implements OnInit, OnDestroy {
  @Input() registerNo: string;
  public fileType: string = '';
  public fileSrc: string[] = [];
  public fSrc: string = '';
  public total: number;
  public pageSize = 1;
  private observer: any;
  public mainForm: FormGroup;
  public degree = 0;
  public params: any;
  pageTitle = '';
  public currentScale = 0.6;
  public shows: any[] = [];
  baseType: string;
  @ViewChild('innerImg') innerImg: ElementRef;
  @ViewChild('outerImg') outerImg: ElementRef;
  @ViewChild('imgContainer') imgContainer: ElementRef;

  public constructor(
    private xn: XnService,
    private pdfViewService: PdfViewService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  public ngOnInit() {
    this.xn.api
      .post('/custom/zhongdeng/zd/attachment_preview', {
        registerNo: this.registerNo,
      })
      .subscribe((x) => {
        // this.paramFile = x.data.attachmentList;
        this.params = x.data.attachment;
        this.onPage(1);
        this.total = 1;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.pdfViewService.onDestroy();
  }

  /**
   *  翻页查看文件
   * @param e 当先文件所在页码
   * this.pdfViewService.m_init = false; 将类的m_init值设置为false
   */
  public onPage(e) {
    if (typeof e !== 'number') {
      return;
    }
    this.pdfViewService.m_init = false;
    this.fileType = 'pdf';
    setTimeout(() => {
      this.pdfViewService.pdfToCanvas(this.params, 'cfca');
    });
  }

  /**
   *  文件旋转
   * @param val 旋转方向 left:左转，right:右转
   */
  public rotateImg(val) {
    if (
      this.innerImg &&
      this.innerImg.nativeElement &&
      this.outerImg &&
      this.outerImg.nativeElement &&
      this.imgContainer &&
      this.imgContainer.nativeElement
    ) {
      this.degree = this.pdfViewService.rotateImg(
        val,
        this.degree,
        this.innerImg.nativeElement,
        this.outerImg.nativeElement,
        this.imgContainer.nativeElement,
        this.currentScale
      );
    }
  }

  /**
   *  文件缩放
   * @param params 放大缩小  large:放大，small:缩小
   */
  public scaleImg(params: string) {
    if (
      this.innerImg &&
      this.innerImg.nativeElement &&
      this.outerImg &&
      this.outerImg.nativeElement &&
      this.imgContainer &&
      this.imgContainer.nativeElement
    ) {
      // 缩放图片
      this.currentScale = this.pdfViewService.scaleImg(
        params,
        this.innerImg.nativeElement,
        this.outerImg.nativeElement,
        this.imgContainer.nativeElement
      );
    }
  }
}

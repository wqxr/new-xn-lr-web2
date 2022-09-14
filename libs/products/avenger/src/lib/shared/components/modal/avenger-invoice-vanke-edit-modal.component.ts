import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { setTimeout } from 'core-js/library/web/timers';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/ng2-bs3-modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { InvoiceUtils } from 'libs/shared/src/lib/common/invoice-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

/**
 * 补充发票信息的模态框
 */
@Component({
  templateUrl: './avenger-invoice-vanke-edit-modal.component.html',
  styleUrls: [`./avenger-invoice-view-modal.component.css`],
  providers: [
    PdfViewService
  ]
})
export class AvengerInvoiceVankeEditModalComponent implements OnInit {

  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('dateInput') dateInput: ElementRef;

  @ViewChild('innerImg') innerImg: ElementRef;
  @ViewChild('outerImg') outerImg: ElementRef;
  @ViewChild('imgContainer') imgContainer: ElementRef;
  // 按钮状态控制
  disabled: boolean;
  errorMsg = '';
  dateCheckTemp = false;
  dateAlert: any;
  isProduction = true;
  // 默认存在发票
  isInvoice = true;
  fileImg: any; // 发票图像
  degree = 0;
  params: any;
  status: any;
  fileSrc: string;
  // 流程
  fileId: string; // 传过来的发票图像信息fileId
  private observer: any;
  private observable: any;
  private processing: boolean;
  private fpdm: any; // 发票代码
  private fphm: any; // 发票号码
  private kprq: any; // 开票日期
  private kpje: any; // 开票金额及其他可能的校验信息
  private sdje: any; // 手动输入金额
  private hsje: any; // 含税金额

  private kpjeLable: any; //
  private kpjeMemo: any;

  // 没有图片id 不可以进行图片验证
  public imgVerStatus = true;
  public hsMoneyShow = false;
  // 万科下没有不显示图片按钮
  public hiddenBtn = true;
  // 人工输入按钮控制
  public handleVerBool = false;
  private currentScale = .6;

  constructor(private xn: XnService, private pdfViewService: PdfViewService) {
    this.isProduction = this.xn.user.env === 'production';

  }

  ngOnInit() {
    this.isInvoice = parseInt(this.xn.user.isInvoice, 10) === 1;
    // 获取页面dom元素
    this.fpdm = $('input[name="fpdm"]', this.modal.element.nativeElement);
    this.fphm = $('input[name="fphm"]', this.modal.element.nativeElement);
    this.kprq = $('input[name="kprq"]', this.modal.element.nativeElement);
    this.hsje = $('input[name="hsje"]', this.modal.element.nativeElement);
    this.fileImg = $('.this-img', this.modal.element.nativeElement);

    this.observable = Observable.create(observer => {
      this.observer = observer;
    });
  }

  /**
   * 打开验证窗口
   * @param params
   * @returns {any}
   */
  open(params: any): Observable<any> {
    this.params = params;
    // 万科，金地，定向 弹框不显示图片验证
    this.hiddenBtn = params.flowId === 'financing6' || params.flowId === 'financing13' || params.flowId === 'financing14'
      || params.flowId === 'supplier_sign_501' || params.flowId === 'financing_500' || params.flowId === 'financing_501';
    this.fileId = params.fileId;
    if (!!this.fileId) {
      this.imgVerStatus = false;
    }

    this.fpdm.val(params.invoiceCode || '');
    this.fphm.val(params.invoiceNum || '');
    this.kprq.val(params.invoiceDate || '');
    this.disabled = true;
    this.processing = false;
    // 如果发票代码不为空
    if (this.fpdm.val !== '') {
      this.onFpdmChange();
    }

    // 如果是批量上传的excel，则不能编辑
    this.disableExcelData(params);
    // 发票地址
    this.fileSrc = params.fileId !== '' ? this.xn.file.view(params) : '';

    this.modal.open(ModalSize.XLarge);
    return this.observable;
  }

  disableExcelData(params) {
    if (params.invoiceCode && params.invoiceNum && params.invoiceDate && params.invoicePretaxAmount
      && params.invoicePosttaxAmount && params.invoiceTypeString) {
      this.fpdm.attr('disabled', true);
      this.fphm.attr('disabled', true);
      this.kprq.attr('disabled', true);
    } else if (params.flowId === 'financing13' || params.flowId === 'financing_invoice_replace13' && params.status === 5) {
      // 定向-发票控件-EXCEL上传的发票，不能编辑
      this.fpdm.attr('disabled', true);
      this.fphm.attr('disabled', true);
      this.kprq.attr('disabled', true);
    }
  }

  /**
   * 计算并显示附加检查项
   */
  private showAdditionalValidator() {
    const validator = InvoiceUtils.getAdditionalValidator(this.fpdm.val());
    this.kpjeLable.html('<span class="required-label">*</span>' + validator.title);
    this.kpjeMemo.html(validator.memo);
    switch (validator.number) {
      case '00':
        this.kpje.val(this.params.invoicePosttaxAmount || '');
        break;  // 发票开具金额(税后)
      case '01':
        this.kpje.val(this.params.invoicePretaxAmount || '');
        break; // 发票开具金额(税前)
      case '02':
        this.kpje.val(this.params.invoicePosttaxAmount || '');
        break; // 发票开具金额(税后)
      case '03':
        this.kpje.val(this.params.invoicePretaxAmount || '');
        break; // 发票开具金额(税前)
      case '11':
        this.kpje.val(this.params.invoiceTypeString || '');
        break; // 发票校验码
      default:
        this.kpje.val('');
        break;
    }
    if (this.kpje.val() !== '') {
      this.kpje.attr('disabled', true);
    }
  }

  /**
   * 发票代码有变化时
   */
  onFpdmChange() {
    if (!this.isInvoice) {
      this.sdje = $('input[name="sdje"]', this.modal.element.nativeElement);
      return;
    }

    this.onInputChange();
    if (InvoiceUtils.isValidInvoiceCode(this.fpdm.val())) {
      setTimeout(() => {
        this.kpje = $('input[name="kpje"]', this.modal.element.nativeElement);

        this.kpjeLable = $('.kpje-label', this.modal.element.nativeElement);
        this.kpjeMemo = $('.kpje-memo', this.modal.element.nativeElement);

        this.showAdditionalValidator();
      }, 0);
    }
  }

  // 输入改变时
  onInputChange() {
    this.errorMsg = '';
    if (!this.isInvoice) {
      this.personCalcDisabled();
    } else {
      this.calcDisabled();
    }
  }

  // 按钮状态改变
  private calcDisabled() {
    this.disabled = !(this.processing
      || InvoiceUtils.isValidInvoiceCode(this.fpdm && this.fpdm.val())
      && (this.fphm && this.fphm.val() && this.fphm.val().length !== 0)
      && (this.kprq && this.kprq.val() && this.kprq.val().length !== 0)
      && (this.kpje && this.kpje.val() && this.kpje.val().length !== 0));
  }

  // 人工审核状态
  private personCalcDisabled() {
    this.disabled = !(this.processing
      || InvoiceUtils.isValidInvoiceCode(this.fpdm && this.fpdm.val())
      && (this.fphm && this.fphm.val() && this.fphm.val().length !== 0)
      && (this.kprq && this.kprq.val() && this.kprq.val().length !== 0)
      && (this.sdje && this.sdje.val() && this.sdje.val().length !== 0));
  }

  private close(value) {
    this.modal.close();
    this.pdfViewService.onDestroy();
    this.observer.next(value);
    this.observer.complete();
  }

  onOk() {
    this.processing = true;
    this.calcDisabled();

    // 检查重复发票号码
    const repeatChecked = this.repeatCheck(this.fphm.val(), this.params);
    if (!repeatChecked) {
      return;
    }
    // 判断是金额或校验码
    const valid = InvoiceUtils.getAdditionalValidator(this.fpdm.val());
    // 调接口去验证
    let params: any;
    let retVerify: boolean;
    if (valid.number === '11') {
      params = {
        invoiceCode: this.fpdm.val(), // 发票代码
        invoiceNum: this.fphm.val(), // 发票号码
        invoiceDate: this.kprq.val(), // 发票日期 YYYYMMDD
        invoiceTypeString: this.kpje.val() && this.kpje.val().replace(/\s/g, ''), // 根据type选定的字符串，开具金额，校验码后6位等
        invoiceAmount: '',
      };
      // 先自己检查下，避免无谓的错误使税务局网站封我们IP
      retVerify = InvoiceUtils.verifyAdditionalValidator(params.invoiceCode,
        params && params.invoiceTypeString && params.invoiceTypeString.replace(/\s/g, ''));
    } else {
      params = {
        invoiceCode: this.fpdm.val(), // 发票代码
        invoiceNum: this.fphm.val(), // 发票号码
        invoiceDate: this.kprq.val(), // 发票日期 YYYYMMDD
        invoiceAmount: this.kpje.val() && this.kpje.val().replace(/\s/g, ''), // 根据type选定的字符串，开具金额，校验码后6位等
      };
      retVerify = InvoiceUtils.verifyAdditionalValidator(params.invoiceCode,
        params && params.invoiceAmount && params.invoiceAmount.replace(/\s/g, ''));
    }
    if (!retVerify) {
      const validator = InvoiceUtils.getAdditionalValidator(params.invoiceCode);
      this.processing = false;
      this.errorMsg = validator.error;
    } else {
      this.errorMsg = '';

      this.processing = false;
      // 发票验证
      params.mainFlowId = this.params.mainFlowId;

      this.xn.avenger.postMap('/file/invoice_check', params).subscribe(json => {
        if (json.ret === 0) {
          // 老发票验证
          if (json.data.type === 'single') {
            const invoiceResult = InvoiceUtils.handleInvoideResponse(json.data.data);
            this.xn.msgBox.open(false, '发票验证成功', () => {
              this.xn.avenger.post('/file/invoice_status',
                { invoiceNum: params.invoiceNum, invoiceCode: params.invoiceCode }
              ).subscribe(x => {
                this.close({
                  action: 'ok',
                  invoiceCode: params.invoiceCode,
                  invoiceNum: params.invoiceNum,
                  invoiceDate: params.invoiceDate,
                  invoiceAmount: invoiceResult?.invoiceAmount || null,
                  // invoiceScreenshot: json.data.data.invoiceScreenshot || null,
                  status: x.data.status || 1,
                  fileId: this.fileId,
                });
              });
            });
                     // 金蝶验证
          } else if (json.data.type === 'jindie') {
            this.xn.msgBox.open(false, '发票验证成功', () => {
              this.close({
                action: 'ok',
                invoiceCode: json.data.data.invoiceCode,
                invoiceNum: json.data.data.invoiceNum,
                invoiceDate: json.data.data.invoiceDate,
                invoiceAmount: json.data.data.invoiceAmount,
                invoiceScreenshot: json.data.data?.invoiceScreenshot || '',
                status: json.data.data.status, // 1表示验证成功
                fileId: this.fileId,
              });
            });
          }

        } else {
          // selectedItems // 只做金蝶
          this.status = 2;
          const html = `
            <dl>
              <!--<dt>${json.msg}</dt>-->
              <dt>录入的发票信息可能有误，请检查所录入的发票信息是否正确：</dt>
              <dd>1、正确，输入“含税金额”后点击“确认人工录入”。</dd>
              <dd>2、错误，修正录入的信息后，再次点击“去验证发票”进行验证。</dd>
            </dl>
          `;
          this.xn.msgBox.open(false, [html], () => {
            this.hsMoneyShow = true;
            this.disabled = true;
          });
        }
      });
    }
  }

  imageVerification() {
    const params = {
      fileId: this.fileId, mainFlowId: this.params.mainFlowId
    };
    this.xn.avenger.postMap('/file/invoice_checkocr', params).subscribe(x => {
      if (x.ret === 0) {
        this.xn.msgBox.open(false, '发票验证成功', () => {
          this.close({
            action: 'ok',
            invoiceCode: x.data.data.invoiceCode,
            invoiceNum: x.data.data.invoiceNum,
            invoiceDate: x.data.data.invoiceDate,
            invoiceAmount: x.data.data.invoiceAmount,
            invoiceScreenshot: x.data.data?.invoiceScreenshot || '',
            invoiceType: x.data.data?.invoiceType || '',
            status: x.data.data.status, // 1表示验证成功
            fileId: this.fileId,
          });
        });
      } else {
        // 验证失败
        this.xn.msgBox.open(false, x.msg, () => {
          this.status = 2;
          this.hsMoneyShow = true;
        });
        // return;
      }
    });
  }

  // 取消验证
  onCancel() {
    console.log('cancel: ', this.status);

    if (this.status === 2) {
      this.hsje = $('input[name="hsje"]', this.modal.element.nativeElement);
    }
    this.xn.avenger.post('/file/invoice_status', { invoiceNum: this.fphm.val(), invoiceCode: this.fpdm.val() }).subscribe(x => {
      this.close({
        invoiceNum: this.fphm.val(),
        invoiceCode: this.fpdm.val(),
        invoiceDate: this.kprq.val(),
        invoiceAmount: this.hsje.val(),
        status: x.data.status || 1,
        action: 'ok',
        tag: x.data && x.data.status && x.data.status === 1 ? 'artificial' : '', // 人工验证标记  如果重复则显示重复，无则显示人工验证
      });
    });

  }

  onclose() {
    this.close('cancel');
  }

  onTest() {
    // 检查重复发票号码
    const repeatChecked = this.repeatCheck(this.fphm.val(), this.params);
    if (!repeatChecked) {
      return;
    }
    this.xn.avenger.post('/file/invoice_status', { invoiceNum: this.fphm.val(), invoiceCode: this.fpdm.val() })
      .subscribe(x => {
        this.close({
          action: 'ok',
          status: x.data.status || 1,
          tag: x.data && x.data.status && x.data.status === 1 ? 'artificial' : '', // 人工验证标记  如果重复则显示重复，无则显示人工验证
          invoiceCode: this.fpdm.val(), // 发票代码
          invoiceNum: this.fphm.val(), // 发票号码
          invoiceDate: this.kprq.val(), // 发票日期 YYYYMMDD
          invoiceAmount: this.sdje.val(), // params.invoiceAmount,  // test
          fileId: this.fileId,
        });
      });
  }

  // 日期输入格式验证
  onDateInput() {
    this.dateCheck(this.kprq.val());
  }

  dateCheck(date) {
    if (!date) {
      return;
    }
    this.dateCheckTemp = XnUtils.toDateFromString(date);
    if (!this.dateCheckTemp) {
      $(this.dateInput.nativeElement).addClass('not-invalid');
      this.disabled = true;
      this.dateAlert = '很抱歉，您需要输入格式为20170731的日期';
    } else {
      $(this.dateInput.nativeElement).removeClass('not-invalid');
      this.dateAlert = '';
    }
  }


  /**
   *  文件旋转
   * @param val 旋转方向 left:左转，right:右转
   */
  public rotateImg(val) {
    if (this.innerImg && this.innerImg.nativeElement
      && this.outerImg && this.outerImg.nativeElement
      && this.imgContainer && this.imgContainer.nativeElement
    ) {
      this.degree = this.pdfViewService.rotateImg(val, this.degree,
        this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement, this.currentScale);
    }
  }


  /**
   *  文件缩放
   * @param params 放大缩小  large:放大，small:缩小
   */
  public scaleImg(params: string) {
    if (this.innerImg && this.innerImg.nativeElement
      && this.outerImg && this.outerImg.nativeElement
      && this.imgContainer && this.imgContainer.nativeElement
    ) {
      // 缩放图片
      this.currentScale = this.pdfViewService.scaleImg(params,
        this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement);
    }
  }

  // 检查发票代码
  repeatCheck(fphm, params): boolean {

    for (const temp of params.temps) {
      if (Number(temp.invoiceNum) === Number(fphm)) {
        this.xn.msgBox.open(false, `发票号码(${temp.invoiceNum})重复了，请您检查`);
        return false;
      }
    }
    return true;
  }
}

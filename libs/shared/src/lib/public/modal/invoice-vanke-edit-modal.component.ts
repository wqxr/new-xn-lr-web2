import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { Observable } from 'rxjs';
import { XnService } from '../../services/xn.service';
import { InvoiceUtils } from '../../common/invoice-utils';
import { XnUtils } from '../../common/xn-utils';
import { setTimeout } from 'core-js/library/web/timers';
import { PdfViewService } from '../../services/pdf-view.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
/**
 * 补充发票信息的模态框
 */
@Component({
    templateUrl: './invoice-vanke-edit-modal.component.html',
    styleUrls: [`./invoice-view-modal.component.less`],
    providers: [
        PdfViewService
    ]
})
export class InvoiceVankeEditModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('dateInput') dateInput: ElementRef;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;
    // 按钮状态控制
    errorMsg = '';
    degree = 0;
    params: any;
    status: any = null;
    fileSrc: string;
    // 流程
    fileId: string; // 传过来的发票图像信息fileId
    form: FormGroup;
    imageVerificationLoading = false;  // 图片验证按钮加载状态
    isVerify = false;
    jindieDetail: any;
    private observer: any;
    private observable: any;
    private processing: boolean;
    public validator: any;
    // 万科下没有不显示图片按钮
    public hiddenBtn = true;
    // 人工输入按钮控制
    private currentScale = .6;
    moneyRegExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    // 发票代码-表单控件
    get invoiceType() {
      return this.form.get('invoiceType');
    }
    // 发票代码-表单控件
    get invoiceCode() {
      return this.form.get('invoiceCode');
    }
    // 发票号码-表单控件
    get invoiceNum() {
      return this.form.get('invoiceNum');
    }
    // 发票日期-表单控件
    get invoiceDate() {
      return this.form.get('invoiceDate');
    }
    get invoiceAmount() {
      return this.form.get('invoiceAmount');
    }
    get amount2() {
      return this.form.get('amount2');
    }
    get amount() {
      return this.form.get('amount');
    }
    // 表单禁用状态
    get disabled(): boolean {
      return !(this.processing || this.form.valid);
    }
    get invoiceLabel(): string {
      return InvoiceUtils.getInvoiceTypeValidator(this.invoiceType.value).title;
    }
    // 图片验证按钮-禁用状态
    get imgVerifyDisabled() {
      return !this.fileId || this.imageVerificationLoading;
    }
    get isSpecialInvoice() {
      return this.invoiceType.value === InvoiceUtils.invoiceType.VAT_SPECIAL;
    }
    constructor(private xn: XnService, private pdfViewService: PdfViewService, private fb: FormBuilder) {}
    ngOnInit() {
      this.initForm();
      this.observable = Observable.create(observer => {
        this.observer = observer;
      });
    }
    // 初始化表单
    initForm() {
      this.form = this.fb.group({
        invoiceType: [InvoiceUtils.invoiceType.VAT_SPECIAL],  // 发票类型 1：增值税专用发票 2：普通增值税发票
        invoiceCode: ['', [Validators.required, this.codeValidator()]],   // 发票代码
        invoiceNum: ['', [Validators.required, this.numValidator()]],    // 发票号码
        invoiceDate: ['', [Validators.required, this.dateValidator()]],   // 发票日期
        invoiceAmount: [''],        // 含税金额
        amount2: [''],  // 附加：不含税金额
        amount: ['', [Validators.required], this.moneyAsyncValidator()], // 不含税金额
      });
    }
    // 发票类型变化时，重置表单
    onChangeInvoiceType(invoiceType) {
    // this.form.reset();
    if (this.status === 2) {
      if (!this.isSpecialInvoice) {
        this.form.get('amount2').setValidators([Validators.required, this.moneyValidator()]);
      } else {
        this.form.get('amount2').clearValidators();
      }
      this.form.get('invoiceAmount').setValidators([Validators.required, this.moneyValidator()]);
      this.form.updateValueAndValidity({ emitEvent: false, onlySelf: true });
    }
    this.form.patchValue({ invoiceType, amount: '' });
  }
    // 防止输入空格
    onKeyUp(prop) {
      this.form.patchValue({[prop]: this[prop].value.replace(/\s/g, '')});
    }
    // 打开窗口
    open(params: any): Observable<any> {
      this.params = params;
      // 万科，金地，定向 弹框不显示图片验证
      this.hiddenBtn = [
        'financing6', 'financing13', 'financing14', 'supplier_sign_501', 'financing_500', 'financing_501'
      ].includes(params.flowId);
      console.log('雅居乐params', params);
      this.processing = false;
      this.fileId = params.fileId;
      // 如果是批量上传的excel，则不能编辑
      this.disableExcelData(params);
      // 发票地址
      console.log('this.fileId', this.fileId);
      this.fileSrc = params.fileId ? this.xn.file.view(params) : '';
      this.modal.open(ModalSize.XLarge);
      return this.observable;
    }
    disableExcelData(params) {
      if ((params && params.invoiceCode && params.invoiceNum && params.invoiceDate) || (params.flowId === 'financing13' || params.flowId === 'financing_invoice_replace13' && params.status === 5)) {
        this.invoiceCode.disable();
        this.invoiceNum.disable();
        this.invoiceDate.disable();
      }
    }
    // 去验证发票
    onVerify() {
      const { invoiceType, invoiceCode, invoiceNum, invoiceDate, invoiceAmount, amount, amount2 } = this.form.value;
      const { fileId } = this.params;
      this.processing = true;
      // 检查重复发票号码
      const repeatChecked = this.repeatCheck(invoiceCode, invoiceNum, this.params);
      if (!repeatChecked) {
        return;
      }
      // 调接口去验证
      const params: any = {
        invoiceType,
        invoiceCode,
        invoiceNum,
        invoiceDate,
        mainFlowId: this.params.mainFlowId,
      };
      if (this.isVerify) {
        if (this.isSpecialInvoice) {
          params.amount = amount;
          params.invoiceAmount = invoiceAmount;
        } else {
          params.invoiceAmount = invoiceAmount;
          params.invoiceCheckCode = amount;
          params.amount = amount2;
        }
      } else {
        if (this.isSpecialInvoice) {
          params.amount = amount;
          params.invoiceAmount = 0;
        } else {
          params.invoiceCheckCode = amount;
        }
      }
      // 先自己检查下，避免无谓的错误使税务局网站封我们IP
      const retVerify = InvoiceUtils.verifyAdditionalValidator2(invoiceType, amount);
      if (!retVerify) {
        const validator = InvoiceUtils.getInvoiceTypeValidator(invoiceType);
        this.processing = false;
        this.errorMsg = validator.error;
      } else {
        this.errorMsg = '';
        this.processing = false;
        // 发票验证
        this.xn.loading.open();
        this.xn.api.postMap('/ljx/invoice/invoice_check', params).subscribe(json => {
          console.log('json', json);
          this.xn.loading.close();
          if (json.ret === 0) {
            if (json.data.type === 'single') {  // 老发票验证
              const invoiceResult = InvoiceUtils.handleInvoideResponse(json.data.data);
              this.xn.msgBox.open(false, '发票验证成功', () => {
                this.xn.api.post('/custom/invoice/invoice/invoice_check', { invoiceNum, invoiceCode }).subscribe(x => {
                  this.close({
                    action: 'ok',
                    invoiceCode,
                    invoiceNum,
                    invoiceDate,
                    invoiceAmount: invoiceResult.invoiceAmount,
                    status: x.data.status || 1,
                    invoiceCheckCode: params.invoiceCheckCode || '',
                    fileId,
                  });
                });
              });
            } else if (json.data.type === 'jindie') { // 金蝶验证
              const responseData = json.data.data;
              this.xn.msgBox.open(false, '发票验证成功', () => {
                this.close({
                  action: 'ok',
                  invoiceCode: responseData.invoiceCode,
                  invoiceNum: responseData.invoiceNum,
                  invoiceDate: responseData.invoiceDate,
                  amount: responseData.amount || 0,
                  invoiceAmount: responseData.invoiceAmount,
                  status: responseData.status, // 1表示验证成功
                  invoiceCheckCode: params.invoiceCheckCode || '',
                  fileId,
                });
              });
            }
          } else {
            // 验证失败 // 只做金蝶
            this.status = 2;
            const html = `
                              <dl>
                                <dt>录入的发票信息可能有误，请检查<b>发票类型</b>和所录入的<b>发票信息</b>是否正确：</dt>
                                <dd>1、正确，开启人工审核</dd>
                                <dd>2、错误，修正录入的信息后，再次点击“去验证发票”进行验证。</dd>
                              </dl>
                          `;
            this.xn.msgBox.open(false, [html], () => {});
            this.isVerify = true;
            if (!this.isSpecialInvoice) {
              this.form.get('amount2').setValidators([Validators.required, this.moneyValidator()]);
            }
            this.form.get('invoiceAmount').setValidators([Validators.required, this.moneyValidator()]);
            this.form.updateValueAndValidity({ emitEvent: false, onlySelf: true });
          }
        });
      }
    }
    // 图片验证
    imageVerification() {
      if (this.imageVerificationLoading) {
        return false;
      }
      this.imageVerificationLoading = true;
      const { fileId, mainFlowId } = this.params;
      this.xn.api.post('/ljx/invoice/invoice_checkocr', { fileId, mainFlowId }).subscribe(x => {
        this.imageVerificationLoading = false;
        if (x.ret === 0) {
          this.xn.msgBox.open(false, '发票验证成功', () => {
            this.close({
              action: 'ok',
              invoiceCode: x.data.data.invoiceCode,
              invoiceNum: x.data.data.invoiceNum,
              invoiceDate: x.data.data.invoiceDate,
              invoiceAmount: x.data.data.invoiceAmount,
              status: x.data.data.status, // 1表示验证成功
              invoiceCheckCode: x.data.data.invoiceCheckCode || '',
              fileId,
            });
          });
        } else {
          // 验证失败
          this.status = 2;
          this.xn.msgBox.open(false, '发票验证失败');
          return;
        }
      });
    }
    // 关闭弹窗
    onCancel() {
      console.log('cancel: ', this.status);
      const { invoiceNum, invoiceCode } = this.form.value;
      this.xn.api.post('/custom/invoice/invoice/invoice_check', {invoiceNum, invoiceCode})
        .subscribe(x => {
          this.close({
            invoiceNum,
            status: x.data.status || 1,
            action: 'cancel'
          });
        });
    }
    // 发票代码长度验证
    codeValidator(): ValidatorFn {
      return (control: AbstractControl): null | { [key: string]: any } => {
        const validator = control.value && control.value.length && [10, 12].includes(control.value.length);
        return validator ? null : { lengthError: '请输入长度为10或12位的发票代码' };
      };
    }
    // 发票号码长度验证
    numValidator(): ValidatorFn {
      return (control: AbstractControl): null | { [key: string]: any } => {
        const validator = control.value && control.value.length && control.value.length === 8;
        return validator ? null : { lengthError: '请输入长度为8位的发票号码' };
      };
    }
    // 日期输入格式验证
    dateValidator(): ValidatorFn {
      return (control: AbstractControl): null | { [key: string]: any } => {
        const validator = XnUtils.toDateFromString(control.value);
        return validator ? null : { dateError: '很抱歉，您需要输入格式为"20170731"的日期' };
      };
    }
    // 金额输入格式验证 异步
    moneyAsyncValidator(): AsyncValidatorFn {
      return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<Validators | null> => {
        return new Promise(resolve => {
          setTimeout(() => {
            // 专用发票需要验证金额格式
            const validator = !this.isSpecialInvoice || this.isSpecialInvoice && this.moneyRegExp.test(control.value);
            if (validator) {
              resolve(null);
            } else {
              resolve({ moneyError: '请输入正确金额' });
            }
          }, 0);
        });
      };
    }
    // 金额输入格式验证 同步
    moneyValidator(): ValidatorFn {
      return (control: AbstractControl): null | { [key: string]: any } => {
        return this.moneyRegExp.test(control.value) ? null : { moneyError: '请输入正确金额' };
      };
    }
    // 检查发票代码
    repeatCheck(invoiceCode, invoiceNum, params): boolean {
      for (const temp of params.temps) {
        if (Number(temp.invoiceCode) === Number(invoiceCode) && Number(temp.invoiceNum) === Number(invoiceNum)) {
          this.xn.msgBox.open(false, `发票号码(${temp.invoiceNum})、发票代码(${temp.invoiceCode})重复了，请您检查`);
          return false;
        }
      }
      return true;
    }
    /**
     * 人工审核-添加人工审核状态
     */
    onManualEntry() {
      const { invoiceType, invoiceCode, invoiceNum, invoiceDate, invoiceAmount, amount, amount2 } = this.form.value;
      // 检查重复发票号码
      const repeatChecked = this.repeatCheck(invoiceCode, invoiceNum, this.params);
      if (!repeatChecked) {
        return;
      }
      this.xn.api.post('/custom/invoice/invoice/invoice_check', {invoiceNum, invoiceCode})
        .subscribe(x => {
          this.close({
            invoiceType,
            invoiceNum,
            invoiceCode,
            invoiceDate,
            invoiceAmount,
            amount: this.isSpecialInvoice ? amount : amount2,
            invoiceCheckCode: this.isSpecialInvoice ? '' : amount,
            status: x.data.status || 1,
            action: 'ok',
            tag: x.data && x.data.status && [1, 3].includes(x.data.status) ? 'artificial' : '', // 人工验证标记  如果重复则显示重复，无则显示人工验证
            fileId: this.params.fileId,
          });
        });
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
    private close(value) {
    this.modal.close();
    this.pdfViewService.onDestroy();
    this.observer.next(value);
    this.observer.complete();
  }
}

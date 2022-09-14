import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { fromEvent } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { XnUtils } from '../../common/xn-utils';
import { CalendarData } from '../../config/calendar';
import { apiRoot } from '../../config/config';
import { SelectOptions } from '../../config/select-options';
import TableHeadConfig from '../../config/table-head-config';
import { HwModeService } from '../../services/hw-mode.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { PublicCommunicateService } from '../../services/public-communicate.service';
import { XnService } from '../../services/xn.service';
import { ApprovalReadModalComponent } from '../modal/approval-read-modal.component';
import { BillViewModalComponent } from '../modal/bill-view-modal.component';
import { BusinessDetailComponent } from '../modal/businessLicense-view-modal.component';
import { ContractFilesViewModalComponent } from '../modal/contract-files-view-modal.component';
import { ContractVankeEditModalComponent } from '../modal/contract-vanke-edit-modal.component';
import { VankeViewContractModalComponent } from '../modal/contract-vanke-mfile-detail.modal';
import { ContractViewModalComponent } from '../modal/contract-view-modal.component';
import { ContractView1ModalComponent } from '../modal/contract-view1-modal.component';
import { FileViewModalComponent } from '../modal/file-view-modal.component';
import { GroupViewModalComponent } from '../modal/group-view-modal.component';
import { HonourViewModalComponent } from '../modal/honour-view-modal.component';
import { InvoiceDataViewModalComponent } from '../modal/invoice-data-view-modal.component';
import { InvoiceDirectionViewModalComponent } from '../modal/invoice-direction-view-modal.component';
import { InvoiceViewModalComponent } from '../modal/invoice-view-modal.component';
import { PdfSignModalComponent } from '../modal/pdf-sign-modal.component';
import { ShowViewModalComponent } from '../modal/show-view-modal.component';
import { SupervisorViewModalComponent } from '../modal/supervisor-view-modal.component';
import { BankContractViewModalComponent } from './bank/contract-view-modal.component';
import { BankHonourViewModalComponent } from './bank/honour-view-modal.component';
import { BankInvoiceViewModalComponent } from './bank/invoice-view-modal.component';
import { FileEditInput1ModalComponent } from './hw-mode/modal/file-edit-input1-modal.component';
import { SupplementFileModalComponent } from './hw-mode/modal/supplement-file.modal.component';


@Component({
  selector: 'xn-show-input',
  templateUrl: './show-input.component.html',
  styleUrls: [`./show-input.component.css`]
})
export class ShowInputComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() row: any;
  @Input() form: FormGroup;
  @Input() memo: string;
  @Input() svrConfig: any;
  @Input() newSvrconfig?: any;
  @ViewChild('fileGroup', { static: true }) fileGroup: ElementRef;
  subResize: any;
  holidayAlert = '';
  label: any;
  type: string;
  url: string;
  items: any[]; // mfile / invoice
  item: any;
  billShow = false;
  amountAll = 0;
  transferAll = 0;
  preAmount = 0;
  enterprise = '';
  showCondition = false;
  factoringDate = '';
  businessType = '';
  vankeType = '';
  moneyChannelOptions = SelectOptions.get('moneyChannel');
  // 表格匹配字段-万科模式
  public enterpriseName = { vankeMode: '', gemdaleMode: '' };

  // 表格字段对应
  heads = {
    万科: TableHeadConfig.getConfig('万科提单').万科.headText,
    雅居乐地产控股有限公司: TableHeadConfig.getConfig('万科提单').雅居乐地产控股有限公司.headText,
    深圳市龙光控股有限公司: TableHeadConfig.getConfig('万科提单').深圳市龙光控股有限公司.headText,
    '金地（集团）股份有限公司': TableHeadConfig.getConfig('金地提单')['金地（集团）股份有限公司'].headText,
    pay_confirmation: TableHeadConfig.getConfig('上传付款确认书').headText,
    orderInfo: TableHeadConfig.getConfig('定向支付提单').华为.headText,
    雅居乐集团控股有限公司: TableHeadConfig.getConfig('万科提单').雅居乐集团控股有限公司.headText,
  };
  public orgType: number = this.xn.user.orgType;
  // 左移动距离
  public headLeft = 0;

  constructor(private xn: XnService,
    private publicCommunicateService: PublicCommunicateService,
    private vcr: ViewContainerRef,
    private localStorageService: LocalStorageService,
    private bankManagementService: BankManagementService,
    public hwModeService: HwModeService) {
  }

  ngOnInit() {
    if (!isNullOrUndefined(this.memo)) {
      this.type = 'textarea';
      this.label = this.memo;
    } else if (isNullOrUndefined(this.row) || isNullOrUndefined(this.row.data)) {
      this.type = this.row && this.row.type || 'text';
      this.label = '未填写';
    } else {
      this.type = this.row.type;
      const data = this.row.data;

      if (this.row.type === 'radio') {
        if (data === '0' || data === 'false') {
          this.label = '否';
        } else if (data === '1' || data === 'true') {
          this.label = '是';
        } else if (this.row.options && this.row.options.ref) { // 兼容radio
          this.label = SelectOptions.getConfLabel(this.row.options.ref, data.toString()) || data;
        } else {
          this.label = data;
        }
      } else if (this.row.type === 'radio-billingType') {
        if (this.row.options && this.row.options.ref) { // 兼容radio
          this.label = SelectOptions.getConfLabel(this.row.options.ref, data.toString()) || data;
        } else {
          this.label = data;
        }
      } else if (this.row.type === 'mselect' || this.row.type === 'bank-select') {
        if (this.row.checkerId === 'caApply' || this.row.checkerId === 'cfcaApply') {
          this.label = SelectOptions.getLabel(this.row.selectOptions, parseInt(this.row.data.toString(), 0));
        } else {
          this.label = SelectOptions.getLabel(this.row.selectOptions, this.row.data);
        }
        this.localStorageService.setCacheValue('enterprise', this.row.data);
        //
        if (this.label && this.label.length === 0) {
          this.label = this.getShowText(data);
        }
      } else if (this.row.type === 'select') {
        if (this.row.checkerId === 'caApply' || this.row.checkerId === 'cfcaApply') {
          this.label = SelectOptions.getLabel(this.row.selectOptions, parseInt(this.row.data.toString(), 0));
        } else {
          if (!XnUtils.isEmpty(this.row.selectOptions)) {
            this.label = SelectOptions.getLabel(this.row.selectOptions, this.row.data);
          } else {
            this.label = XnUtils.jsonTostring(this.row.data).label;
          }
        }
        this.localStorageService.setCacheValue('enterprise', this.row.data);
        if (this.label && this.label.length === 0) {
          this.label = this.getShowText(data);
        }
      } else if (this.row.type === 'vanke-select') {
        if (this.row.data.includes('}')) {
          this.businessType = SelectOptions.getLabel(this.row.selectOptions, JSON.parse(this.row.data).enterprise);
          const secondSelect = SelectOptions.get('enterprise_dc').filter((x: any) => x.value === JSON.parse(this.row.data).enterprise);
          this.vankeType = secondSelect[0].children.filter(x => String(x.value) === String(JSON.parse(this.row.data).wkType))[0].label;
          this.localStorageService.setCacheValue('enterprise', '万科');

        } else {
          this.businessType = SelectOptions.getLabel(this.row.selectOptions, this.row.data);
          this.localStorageService.setCacheValue('enterprise', this.row.data);

        }

      } else if (this.row.type === 'dcheckbox') {
        if (!data) {
          return;
        }
        const arrays = JSON.parse(data);
        const labels = [];
        for (const array of arrays) {
          if (array.checked === true) {
            labels.push(array.label);
            if (array.data && array.data.length) {
              labels.push(`【 公司性质：${array.data.filter((x: any) => x.checked === true).map(y => y.label).join(',')}】`);
            }
          }
        }
        this.label = labels.join(', ');
        // console.log('..................', this.label);
      } else if (this.row.type === 'dselect' || this.row.type === 'label-select') {
        const json = JSON.parse(data);
        this.label = `${json.first}, ${json.second}`;
      } else if (this.row.type === 'linkage-select') {
        if (!!this.row.data) {
          let reason = JSON.parse(this.row.data);
          this.label = this.fnTransform({ proxy: Number(reason.type), status: Number(reason.selectBank) || '' },
            'productType_Jd');
        }
      } else if (this.row.type === 'wselect') {
        const json = JSON.parse(data);
        this.label = json;
      } else if (this.row.type === 'picker') { // data picker
        try {
          const json = JSON.parse(data.replace(/\s+/g, ''));
          if (json.label) {
            this.label = json.label;
          } else {
            this.label = data;
          }
        } catch (error) {
          this.label = data;
        }
      } else if (this.row.type === 'mfile' || this.row.type === 'mViewfile' || this.row.type === 'backfile' ||
        this.row.type === 'excel' || this.row.type === 'file-edit') { // upload
        if (data === '') {
          this.label = '';
        } else {
          const json = JSON.parse(data);
          this.items = [];
          for (const item of json) {
            if (item.secret) {
              this.items.push(item);
            } else {
              this.items.push({
                url: `${apiRoot}/attachment/view?key=${item.fileId}`,
                label: item.fileName
              });
            }
          }
        }
      } else if (this.row.type === 'file') { // upload
        if (data === '') {
          this.label = '';
        } else {
          const json = JSON.parse(data);
          this.items = [];
          this.items.push({
            url: `${apiRoot}/attachment/view?key=${json.fileId}`,
            label: json.fileName
          });
        }
      } else if (this.row.type === 'password') {
        this.label = '********'; // 密码不显示
      } else if (this.row.type === 'date') {
        if ((typeof data) === 'string') {
          if (data.length === 0 || data.indexOf('-') >= 0) {
            this.label = data;
          } else if (XnUtils.toDateFromString(data)) {
            this.label = XnUtils.formatDate(XnUtils.toDate(data));
          } else {
            this.label = XnUtils.formatDate(parseInt(data, 10));
          }
        } else {
          this.label = XnUtils.formatDate(data);
        }
      } else if (this.row.type === 'datetime') {
        if ((typeof data) === 'string') {
          if (data.length === 0 || data.indexOf('-') >= 0) {
            this.label = data;
          } else {
            this.label = XnUtils.formatDatetime(parseInt(data, 10));
          }
        } else {
          this.label = XnUtils.formatDatetime(data);
        }
      } else if (this.row.type === 'invoice' || this.row.type === 'honour' ||
        this.row.type === 'bank-invoice' || this.row.type === 'bank-honour' ||
        this.row.type === 'bank-contract' || this.row.type === 'contract' || this.row.type === 'supervisor' ||
        this.row.type === 'check' || this.row.type === 'group' || this.row.type === 'group5'
        || this.row.type === 'order' || this.row.type === 'order5') {
        if (data.length === 0) {
          this.items = [];
        } else {
          this.items = JSON.parse(data);
        }
        if (this.row.type === 'invoice' || this.row.type === 'bank-invoice') {
          // this.amountAll = this.computeSum(this.items.filter(v => v && v.invoiceAmount).
          //     map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
          if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
            this.amountAll = this.computeSum(this.items.filter(v => v && v.invoiceAmount)
              .map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
          }

        }
        if (this.row.type === 'group5') {
          this.items.forEach(item => {
            item.payFiles = JSON.parse(item.payFiles);
          });
        }
      } else if (this.row.type === 'number' || this.row.type === 'depositHonour') {
        if (data.length === 0) {
          this.items = [];
        } else {
          this.items = JSON.parse(data);
        }
      } else if (this.row.type === 'bill') {
        let billshow = false; // 是否显示发票这个checker
        if ((data === '')) {
          for (const key in this.item) {
            if (this.item.hasOwnProperty(key)) {
              delete this.item[key];
            }
          }
          billshow = false;
        } else {
          this.item = JSON.parse(data);
          billshow = true;
        }
        this.billShow = billshow;
      } else if (this.row.type === 'conditions') {
        if (!data) {
          this.showCondition = false;
          return;
        }
        const obj = JSON.parse(data);
        this.enterprise = obj.label || '';
        if (!obj.conditions) { // 首次不存在
          this.showCondition = false;
          return;
        }

        if (obj.conditions.length === 0) {
          this.items = [];
        } else {
          this.items = $.extend(true, [], obj.conditions).filter(v => v.checked === true);
        }
        this.showCondition = this.items.length > 0;
      } else if (this.row.type === 'date1') {
        if ((typeof data) === 'string') {
          if (data.length === 0 || data.indexOf('-') >= 0) {
            this.label = data;
          } else {
            this.label = XnUtils.formatDate(parseInt(data, 10));
          }
        } else {
          this.label = XnUtils.formatDate(data);
        }
        this.factoringDate = this.label.replace(/-/g, '');
        XnUtils.computeDay(this, CalendarData);
      } else if (this.row.type === 'fixedfile') {
        if ((data !== '')) {
          this.item = JSON.parse(data);
        }

      } else if (this.row.type === 'toarray' || this.row.type === 'fixedfile1') {
        if ((data !== '')) {
          this.items = JSON.parse(data);
        }
      } else if (this.row.type === 'data-content' || this.row.type === 'data-content1' || this.row.type === 'data-content3') {
        this.enterpriseName.vankeMode = this.localStorageService.caCheMap.get('enterprise');
        this.enterpriseName.gemdaleMode = this.localStorageService.caCheMap.get('enterprise');
        if (!!data) {
          this.items = JSON.parse(data);
        }

      } else if (this.row.type === 'pre-invoice') {
        if (!!data) {
          this.item = JSON.parse(data);
          // this.items = data;
        }
      } else if (this.row.type === 'contract-vanke'
        || this.row.type === 'contract-vanke1'
        || this.row.type === 'multiple-picker'
        || this.row.type === 'upload-payment') {
        if (!!data) {
          this.items = JSON.parse(data);
        }
      } else if (this.row.type === 'invoice-vanke') {
        if (!!data) {
          this.items = JSON.parse(data);
          if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
            this.amountAll = this.computeSum(this.items.filter(v => v && v.invoiceAmount)
              .map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
          }
          if (this.items.filter(v => v && v.amount).length > 0) {
            this.preAmount = this.computeSum(this.items.filter(v => v && v.amount)
              .map(v => Number(v.amount))).toFixed(2) || 0;
          }
        }

      } else if (this.row.type === 'invoice-transfer') {
        if (!!data) {
          this.items = JSON.parse(data);
          if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
            this.amountAll = this.computeSum(this.items.filter(v => v && v.invoiceAmount)
              .map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
          }
          if (this.items.filter(v => v && v.transferMoney).length > 0) {
            this.transferAll = this.computeSum(this.items.filter(v => v && v.transferMoney)
              .map(v => Number(v.transferMoney))).toFixed(2) || 0;
          }
        }


      } else if (this.row.type === 'assignor-info') {
        if (!!data) {
          this.items = JSON.parse(data);

        }
      } else if (this.row.type === 'contract-office'
        || this.row.type === 'contract-hw'
        || this.row.type === 'receivable'
        || this.row.type === 'receivable1') {
        if (!!data) {
          this.items = JSON.parse(data);
        }
      } else if (this.row.type === 'bank-input'
        || this.row.type === 'bank-single'
        || this.row.type === 'bank-single1'
        || this.row.type === 'linkage'
        || this.row.type === 'linkage1') {
        if (!!data) {

          this.item = JSON.parse(data);

        }
      } else if (this.type === 'item-change') {
        if (!!data) {
          this.item = JSON.parse(data);
        }
      } else if (this.type === 'performance') {
        if (!!data) {
          this.items = JSON.parse(data);
        }
      } else if (this.type === 'file-edit1') {
        if (!!data) {
          this.item = JSON.parse(data);
        }
      } else if (this.row.type === 'file-table') {
        if (!!data) {
          this.items = JSON.parse(data);
        }
      } else if (this.row.type === 'upload-pay-order') {
        if (!!data) {
          this.items = JSON.parse(data);
          //  发票号字段要整理
          // 整理发票号字段
          this.items.forEach(c => {
            const invoiceArr =
              c.realInvoiceNum && c.realInvoiceNum !== ''
                ? JSON.parse(c.realInvoiceNum)
                : [];
            c.invoiceNumLocal = invoiceArr;
            if (invoiceArr.length > 2) {
              c.invoiceNumLocal = `${invoiceArr[0]};${invoiceArr[1]}等`;
            } else if (invoiceArr.length === 1) {
              c.invoiceNumLocal = `${invoiceArr[0]}`;
            }
            if (invoiceArr.length === 2) {
              c.invoiceNumLocal = `${invoiceArr[0]};${invoiceArr[1]}`;
            }
            c.invoiceLength = invoiceArr.length;
          });
        }
      } else if (this.row.type === 'invoice-replace-info') {
        if (!!data) {
          this.items = JSON.parse(data);
          if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
            this.amountAll = this.computeSum(this.items.filter(v => v && v.invoiceAmount)
              .map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
          }
          if (this.items.filter(v => v && v.amount).length > 0) {
            this.preAmount = this.computeSum(this.items.filter(v => v && v.amount)
              .map(v => Number(v.amount))).toFixed(2) || 0;
          }
        }
      } else if (this.row.type === 'assets' || this.row.type === 'cash' || this.row.type === 'profit') {
        if (!!data) {
          this.item = JSON.parse(data);
        }
      } else if (this.row.type === 'text') {
        this.label = this.getShowText(data);
      } else if (this.row.type === 'opponentForm' || this.row.type === 'earningForm') {
        this.items = JSON.parse(data);


      } else if (this.row.type === 'orgList') {
        this.items = JSON.parse(data);
      } else if (this.row.type === 'companyUpload') {
        this.items = JSON.parse(data);

      } else {
        this.label = data;
      }
    }
    this.subResize = fromEvent(window, 'resize').subscribe((event) => {
      this.formResize();
    });
  }
  ngAfterViewInit() {
    this.formResize();
  }

  ngOnDestroy() {
    // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
    if (this.subResize) {
      this.subResize.unsubscribe();
    }
  }
  /**
   *
   * @param e 浏览器放缩动态改变组件样式
   */
  formResize() {
    if (this.fileGroup && this.fileGroup.nativeElement) {
      const $parentForm = $(this.fileGroup.nativeElement).closest('.form-group');
      // 获取父元素宽度
      const parentWidth = $parentForm.outerWidth();
      const col2Width = $parentForm.children('.xn-control-label').outerWidth(true);
      const col8Left = ($parentForm.children('.col-sm-6').outerWidth(true) - $parentForm.children('.col-sm-6').width()) / 2;
      // 设置当前元素样式
      // console.log("---",parentWidth,col2Width,col8Left);
      $(this.fileGroup.nativeElement).css({
        width: `${parentWidth}`,
        position: 'relative',
        left: `${-(col2Width + col8Left)}px`
      });
    }

  }
  /**
   *  查看更多信息
   * @param item 长字符串    122，3213，12313，
   */
  public viewMoreDetailInfo(item) {
    item = item.toString().split(',');
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      InvoiceDataViewModalComponent,
      item
    ).subscribe(() => {
    });
  }

  /**
   *  查看文件信息
   * @param item 文件详情
   */
  public viewContract(item: any) {
    const params = {
      value: item,
      title: '查看文件信息'
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractFilesViewModalComponent, params).subscribe(() => {
    });
  }
  viewPerformance(item: any) {
    const debtUnits = this.newSvrconfig.checkers.filter((x: any) => x.checkerId === 'debtUnit');
    const paybables = this.newSvrconfig.checkers.filter((x: any) => x.checkerId === 'payables');
    const projectCompanys = this.newSvrconfig.checkers.filter((x: any) => x.checkerId === 'projectCompany');
    const infos = this.newSvrconfig.checkers.filter((x: any) => x.checkerId === 'contractFile');

    const debtUnit = debtUnits && debtUnits.length ? debtUnits[0].data : '';
    const projectCompany = projectCompanys && projectCompanys.length ? projectCompanys[0].data : '';
    const paybable = paybables && paybables.length ? paybables[0] : '';
    const info = infos && infos.length ? infos[0].data : '';
    const checkers = [
      {
        title: '合同名称',
        checkerId: 'contractName',
        required: false,
        type: 'text',
        options: { readonly: true },
        value: JSON.parse(info)[0].files.contractName || '',
        number: 3
      },
      {
        title: '合同编号',
        checkerId: 'contractNum',
        type: 'text',
        required: false,
        options: { readonly: true },
        value: JSON.parse(info)[0].files.contractNum,
        number: 2
      },
      {
        title: '合同金额',
        checkerId: 'contractAmount',
        type: 'money',
        required: false,
        options: { readonly: true },
        value: JSON.parse(info)[0].files.contractAmount,
        number: 6
      },
      {
        title: '付款比例',
        checkerId: 'payRate',
        type: 'text',
        required: false,
        options: { readonly: true },
        value: JSON.parse(info)[0].files.payRate,
        number: 6
      },
      {
        title: '合同类型',
        checkerId: 'contractType',
        type: 'select',
        required: false,
        options: { ref: 'contractType_jban' },
        value: JSON.parse(info)[0].files.contractType,
        number: 6
      },
      {
        title: '合同签订时间',
        checkerId: 'contractSignTime',
        required: false,
        type: 'date-null',
        value: JSON.parse(info)[0].files.contractSignTime || '',
        placeholder: '',
        options: { readonly: true },
        number: 7
      },
      {
        title: '基础合同甲方名称',
        checkerId: 'contractJia',
        type: 'text',
        required: false,
        options: { readonly: true },
        value: JSON.parse(info)[0].files.contractJia,
        number: 6
      },
      {
        title: '基础合同乙方名称',
        checkerId: 'contractYi',
        type: 'text',
        required: false,
        options: { readonly: true },
        value: JSON.parse(info)[0].files.contractYi,
        number: 6
      },
      {
        title: '累积确认产值',
        checkerId: 'cumulativelyOutputValue',
        type: 'money',
        required: false,
        options: { readonly: true },
        value: item.files.cumulativelyOutputValue,
        number: 1
      },
      {
        title: '本次产值金额',
        checkerId: 'percentOutputValue',
        type: 'money',
        required: false,
        options: { readonly: true },
        value: JSON.parse(info)[0].files.percentOutputValue,
        number: 6
      },
      {
        title: '本次付款性质',
        checkerId: 'payType',
        type: 'select',
        required: false,
        options: { ref: 'payType' },
        value: JSON.parse(info)[0].files.payType,
        number: 6
      },
      {
        title: '收款单位',
        checkerId: 'debtUnit',
        required: false,
        type: 'text',
        options: { readonly: true },
        value: JSON.parse(info)[0].files.debtUnit || debtUnit,
        number: 4
      },
      {
        title: '申请付款单位',
        checkerId: 'projectCompany',
        required: false,
        type: 'text',
        options: { readonly: true },
        value: JSON.parse(info)[0].files.projectCompany || projectCompany,
        number: 5
      },
      {
        title: '应付账款金额',
        checkerId: 'payables',
        required: false,
        type: 'money',
        options: { readonly: true },
        value: paybable.data,
        number: 8
      },
    ];
    const params = {
      checkers,
      value: item,
      title: '补充履约证明信息',
      isShow: true,
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeViewContractModalComponent
      , params).subscribe((v: any) => {
      });
  }
  // 万科查看文件修改
  public viewFileCon(item: any) {
    const headquarters = this.localStorageService.caCheMap.get('headquarters');
    // 合同编号
    const debtUnits = this.newSvrconfig.checkers.filter((x: any) => x.checkerId === 'debtUnit');
    const paybables = this.newSvrconfig.checkers.filter((x: any) => x.checkerId === 'payables');
    const projectCompanys = this.newSvrconfig.checkers.filter((x: any) => x.checkerId === 'projectCompany');

    const debtUnit = debtUnits && debtUnits.length ? debtUnits[0].data : '';
    const paybable = paybables && paybables.length ? paybables[0] : '';
    const projectCompany = projectCompanys && projectCompanys.length ? projectCompanys[0].data : '';

    const checkers = [
      {
        title: '合同名称',
        checkerId: 'contractName',
        required: false,
        type: 'text',
        options: { readonly: true },
        value: item.files.contractName || '',
        number: 3
      },
      {
        title: '合同编号',
        checkerId: 'contractNum',
        type: 'text',
        required: false,
        options: { readonly: true },
        value: item.files.contractNum,
        number: 2
      },
      {
        title: '合同金额',
        checkerId: 'contractAmount',
        type: 'money',
        required: false,
        options: { readonly: true },
        value: item.files.contractAmount,
        number: 6
      },
      {
        title: '付款比例',
        checkerId: 'payRate',
        type: 'text',
        required: false,
        options: { readonly: true },
        value: item.files.payRate,
        number: 6
      },
      {
        title: '合同类型',
        checkerId: 'contractType',
        type: 'select',
        required: false,
        options: { ref: 'contractType_jban' },
        value: item.files.contractType,
        number: 6
      },
      {
        title: '合同签订时间',
        checkerId: 'contractSignTime',
        required: false,
        type: 'date-null',
        value: item.files.contractSignTime || '',
        placeholder: '',
        options: { readonly: true },
        number: 7
      },
      {
        title: '基础合同甲方名称',
        checkerId: 'contractJia',
        type: 'text',
        required: false,
        options: { readonly: true },
        value: item.files.contractJia,
        number: 6
      },
      {
        title: '基础合同乙方名称',
        checkerId: 'contractYi',
        type: 'text',
        required: false,
        options: { readonly: true },
        value: item.files.contractYi,
        number: 6
      },
      {
        title: '累积确认产值',
        checkerId: 'cumulativelyOutputValue',
        type: 'money',
        required: false,
        options: { readonly: true },
        value: item.files.cumulativelyOutputValue,
        number: 1
      },
      {
        title: '本次产值金额',
        checkerId: 'percentOutputValue',
        type: 'money',
        required: false,
        options: { readonly: true },
        value: item.files.percentOutputValue,
        number: 6
      },
      {
        title: '本次付款性质',
        checkerId: 'payType',
        type: 'select',
        options: { ref: 'payType' },
        value: item.files.payType,
        number: 6
      },
      {
        title: '收款单位',
        checkerId: 'debtUnit',
        required: false,
        type: 'text',
        options: { readonly: true },
        value: item.files.debtUnit || debtUnit,
        number: 4
      },
      {
        title: '申请付款单位',
        checkerId: 'projectCompany',
        required: false,
        type: 'text',
        options: { readonly: true },
        value: item.files.projectCompany || projectCompany,
        number: 5
      },
      {
        title: '应付账款金额',
        checkerId: 'payables',
        required: false,
        type: 'money',
        options: { readonly: true },
        value: paybable.data,
        number: 8
      }];

    const params = {
      checkers,
      value: item,
      title: '补充合同信息',
      isShow: true,
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeViewContractModalComponent
      , params).subscribe((v: any) => {

      });
  }

  public onViewInvoice(item: any) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceViewModalComponent, item).subscribe(() => {
    });
  }

  public viewInvoicesDetail(item: any, i?: string) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceDirectionViewModalComponent, item).subscribe(() => {
    });
  }

  // 检查资产负债表数据
  public checkBalanceData(paramItems: any, paramIndex: number): boolean {
    // 如果paramItems或paramItems.data未定义
    if (paramItems === undefined || paramItems === null
      || paramItems.data === undefined || paramItems.data === null) {
      return false;
    }
    // 如果下标越界
    if (!Array.isArray(paramItems.data) || paramItems.data.length <= paramIndex) {
      return false;
    }
    const d = paramItems.data[paramIndex];
    if (d === undefined || d === null) {
      return false;
    }
    if (d.initValue === undefined || d.initValue === null) {
      return false;
    }

    if (d.finalValue === undefined || d.finalValue === null) {
      return false;
    }

    return true;
  }
  // 检查现金流量表，和利润表
  public checkData(parmaItems: any, paramIndex: number): boolean {
    if (parmaItems === undefined || parmaItems === null || parmaItems.data === undefined || parmaItems.data === null) {
      return false;
    }
    if (!Array.isArray(parmaItems.data) || parmaItems.data.length <= paramIndex) {
      return false;
    }
    const d = parmaItems.data[paramIndex];
    if (d === undefined || d === null) {
      return false;
    }
    if (parmaItems.startDates === undefined || parmaItems.startDates === null) {

      return false;

    }
    if (d.values === undefined || d.values === null || d.values.length < parmaItems.startDates.length) {
      return false;
    }

    return true;





  }

  // 查看应收账款证明
  public onViewReceivable(item: any, view: string) {
    const params = {
      title: '补录应收账款证明',
      checker: [
        {
          title: '委托付款日',
          checkerId: 'factoringDueDate',
          flowId: 'financing13',
          type: 'date3',
          required: true,
          value: item.factoringDueDate,
          options: { readonly: true }
        },
        {
          title: '保理融资到期日',
          checkerId: 'factoringDueDate',
          type: 'date',
          required: true,
          memo: '预计到期日+1天，遇假期顺延',
          value: item.factoringEndDate,
          options: { readonly: true }
        }, {
          title: '本批次金额',
          checkerId: 'currentAmount',
          type: 'money',
          required: true,
          value: item.currentAmount,
          options: { readonly: true }
        }, {
          title: '宽限日期',
          checkerId: 'graceDate',
          type: 'text',
          required: true,
          memo: '保理融资到期日+30天自然日',
          value: item.graceDate,
          options: { readonly: true }
        },
      ],
      data: item,
      operating: view
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, SupplementFileModalComponent, params).subscribe();
  }

  // 下载应收账款证明
  public downLoadReceivable() {
    const data = this.items.map(item => item.files).reduce((pre: any, next: any) => {
      pre = [...pre, ...next];
      return pre;
    }, []);
    if (!(data && data.length > 0)) {
      return this.xn.msgBox.open(false, '无可下载项');
    }
    this.xn.loading.open();
    this.xn.api
      .download('/file/down_capital_file', { files: data })
      .subscribe((x: any) => {
        this.xn.api.save(x._body, '应收账款证明.zip');
        this.xn.loading.close();
      });
  }

  /**
   *  下载应收账款金额
   *  paramFiles
   */
  public downLoadReceivableFiles(paramFiles: { url: string, label: string }[]) {
    const data = paramFiles.map((item: { url: string, label: string }) => {
      return {
        fileId: item.url.substring(item.url.lastIndexOf('=') + 1),
        fileName: item.label
      };
    });
    this.xn.loading.open();
    this.xn.api
      .download('/file/down_capital_file', { files: data })
      .subscribe((x: any) => {
        this.xn.api.save(x._body, '应收账款证明.zip');
        this.xn.loading.close();
      });
  }

  public onViewBankInvoice(item: any) {
    // 仅在平台初审时 preview 为 false
    item.preview = item.preview = this.svrConfig
      ? !(this.svrConfig.procedure.flowId === 'financing_platform7' && this.svrConfig.procedure.procedureId === 'operate')
      : true;
    XnModalUtils.openInViewContainer(this.xn, this.vcr, BankInvoiceViewModalComponent, item).subscribe((v) => {
      item.consistent = v.consistent;
      const params = {
        type: 'invoice',
        consistent: this.items.every((x: any) => x.consistent)
      };
      this.publicCommunicateService.change.emit(params);
    });
  }

  public onViewHonour(item: any) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, HonourViewModalComponent, item).subscribe(() => {
    });
  }

  public onViewBankHonour(item: any) {
    // 仅在平台初审时 preview 为 false
    item.preview = item.preview = this.svrConfig
      ? !(this.svrConfig.procedure.flowId === 'financing_platform7' && this.svrConfig.procedure.procedureId === 'operate')
      : true;
    XnModalUtils.openInViewContainer(this.xn, this.vcr, BankHonourViewModalComponent, item).subscribe((v) => {
      item.consistent = v.consistent;
      const params = {
        type: 'honour',
        consistent: this.items.every((x: any) => x.consistent)
      };
      this.publicCommunicateService.change.emit(params);
    });
  }

  // 如果两票一合同（基础模式financing_platform、financing_factoring、financing_supplier
  // 委托模式financing_platform2、financing_factoring2、financing_supplier2
  // 回购模式financing_platform1、financing_factoring1、financing_supplier1
  // 平台审核，补录合同（flowId），则 ContractView1ModalComponent
  public onViewContract(item: any) {
    if (this.localStorageService.caCheValue.flowId === 'financing_platform'
      || this.localStorageService.caCheValue.flowId === 'financing_platform1'
      || this.localStorageService.caCheValue.flowId === 'financing_platform2'
      || this.localStorageService.caCheValue.flowId === 'financing_factoring'
      || this.localStorageService.caCheValue.flowId === 'financing_factoring1'
      || this.localStorageService.caCheValue.flowId === 'financing_factoring2'
      || this.localStorageService.caCheValue.flowId === 'financing_supplier'
      || this.localStorageService.caCheValue.flowId === 'financing_supplier1'
      || this.localStorageService.caCheValue.flowId === 'financing_supplier2'
    ) {
      XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractView1ModalComponent, item).subscribe(() => {
      });
    } else {
      XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractViewModalComponent, item).subscribe(() => {
      });
    }

  }

  public onViewBankContract(item: any) {
    // 仅在平台初审时 preview 为 false
    item.preview = this.svrConfig
      ? !(this.svrConfig.procedure.flowId === 'financing_platform7' && this.svrConfig.procedure.procedureId === 'operate')
      : true;
    XnModalUtils.openInViewContainer(this.xn, this.vcr, BankContractViewModalComponent, item).subscribe((v) => {
      item.consistent = v.consistent;
      const params = {
        type: 'contract',
        consistent: this.items.every((x: any) => x.consistent)
      };
      this.publicCommunicateService.change.emit(params);
    });
  }

  public onApplyView(item?: any) {
    const params = {
      items: item.files,
      accountName: item.bank.remitName,
      bankName: item.bank.remitBank,
      accountNumber: item.bank.remitAccount,
      edit: { accountNameBool: false, bankNameBool: false, accountNumberBool: false, canSave: false, operating: 'view' },
      title: { accountNameTitle: '汇款账户名称', bankNameTitle: '汇款开户行名称', accountNumberTitle: '汇款账号' }
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, FileEditInput1ModalComponent, params).subscribe(() => {
    });
  }

  /**
   *  查看文件信息
   * @param item
   */
  public onView(item: any) {
    const recordId = this.svrConfig.record.recordId || ''
    // 平台审核注册流程-《授权确认函》文件需要展示企业信息、法人信息、管理员信息、CA数字证书管理员信息
    if (this.row?.checkerId === "authConfirmationFile") {
      // 额外携带流程Id参数 获取展示信息
      item.recordId = recordId
    }
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShowViewModalComponent, item).subscribe(() => {
    });
  }

  public onViewBill(item: any) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, BillViewModalComponent, item).subscribe(() => {
    });
  }

  public onViewRead(item: any) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ApprovalReadModalComponent, item).subscribe(v => {
    });
  }

  public onViewSupervior(item: any) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, SupervisorViewModalComponent, item).subscribe(() => {
    });
  }

  public onViewGroup(item: any) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, GroupViewModalComponent, item).subscribe(() => {
    });
  }

  public showContract(id: string, secret: string, label: string) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
      id,
      secret,
      label,
      readonly: true
    }).subscribe(() => {
    });
  }

  /**
   *  地产abs 查看合同信息
   * @param item
   * @param mode vanke 万科,gemdale 金地
   */
  public contractOnView(item: any, mode: string) {
    let checkers = [];
    if (mode === 'vanke') {
      checkers = [
        {
          title: '合同编号', checkerId: 'contractNum', type: 'text',
          required: false, options: { readonly: true }, value: item.files.contractNum || ''
        },
        {
          title: '合同金额', checkerId: 'contractAmount', type: 'money',
          required: false, options: { readonly: true }, value: item.files.contractAmount || ''
        },
        {
          title: '合同名称', checkerId: 'contractAmount', type: 'text',
          required: false, options: { readonly: true }, value: item.files.contractName || ''
        }];
    } else if (mode === 'gemdale') {
      checkers = [
        {
          title: '合同编号', checkerId: 'contractNum', type: 'text',
          required: false, options: { readonly: true }, value: item.files.contractNum || ''
        },
        {
          title: '合同金额', checkerId: 'contractAmount', type: 'money',
          required: false, options: { readonly: true }, value: item.files.contractAmount || ''
        }];
    }

    const params = {
      checkers,
      title: '查看合同信息',
      value: item,
      isShow: true,
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractVankeEditModalComponent, params).subscribe(() => {
    });
  }

  public onScroll($event) {
    this.headLeft = $event.srcElement.scrollLeft * -1;
  }

  public onViewFile(item: any) {
    // console.log(item,this.svrConfig);
    if (item.businessLicenseFile) {
      const orgName = this.newSvrconfig.checkers.filter((x: any) => x.checkerId === 'orgName')[0].data;
      const item1 = Object.assign({}, item, { orgName });
      XnModalUtils.openInViewContainer(this.xn, this.vcr, BusinessDetailComponent, item1).subscribe(() => {
      });
    } else {
      XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, item).subscribe(() => {


      });
    }
  }

  // 查看所有发票
  public viewAllInvoice(e) {
    if (e.invoiceLength <= 2) {
      return;
    }
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      InvoiceDataViewModalComponent,
      JSON.parse(e.realInvoiceNum)
    ).subscribe(() => {
    });
  }

  // 下载文件 {url: "/api/attachment/view?key=10001_1533711254270_receiveAccount.xlsx", label: "历史交易明细模板.xlsx"}
  public downLoad(item: any) {
    if (!!item) {
      const index = item.url.indexOf('=');
      const key = item.url.substr(index + 1);
      this.xn.api.download('/attachment/download/index', {
        key
      }).subscribe((v: any) => {
        this.xn.api.save(v._body, item.label);
      });
    }
  }

  // 预览excel
  public onExcelView(item: any) {
    // `https://view.officeapps.live.com/op/view.aspx?src=
    // http://dev.lrscft.com:8362/attachment/view?key=10001_1532573059339_receiveAccount.xls`
    const src = item.url;
    const a = document.createElement('a');
    a.href = `https://view.officeapps.live.com/op/view.aspx?src=${src}`;

    // a.click();
  }

  // 查看流程
  public viewProcess(item) {
    this.bankManagementService.viewProcess(item.mainFlowId);
  }

  // todo: 类型使用不正确，需要特殊处理
  private getShowText(data: any) {
    try {
      const d = JSON.parse(data);
      if (typeof d === 'number') {
        return data;
      }
      if (this.row.checkerId === 'factoringApp' || this.row.checkerId === 'financingBank') {
        return `${d[0].value}-${d[0].label}`;
      } else {
        // "[{"label":"深圳市柏霖汇商业保理有限公司","value":"100003"}]"
        return d instanceof Array
          ? (d[0].hasOwnProperty('label') ? d[0].label : d[0])
          : d.hasOwnProperty('label') ? d.label : d;
      }
    } catch {
      return data;
    }
  }

  /**
* 点击下载Excel文件
* @param paramData
*/
  public downFile(paramData: any) {
    this.xn.api
      .download('/attachment/download/upload_file_down', {
        key: JSON.parse(paramData).fileId
      })
      .subscribe((v: any) => {
        this.xn.api.save(v._body, JSON.parse(paramData).fileName);
      });
  }

  // 具体到单个数组的求和
  private computeSum(array) {
    if (array.length <= 0) {
      return;
    }
    return array.reduce((prev, curr, idx, arr) => {
      return prev + curr;
    });
  }
  /**
* 将 [{label:'是',value:'1',children:[{...}]}]枚举转换根据value 值显示label 标签
* 或者 string : ref 键值对在select-options 中的配置属性名
* @param value
* @param param
*/
  public fnTransform(value: { proxy: any, status: any }, param: string): string {
    if (!param || !value) {
      return '';
    }
    let obj = $.extend(true, {}, value);
    let hasChildren = SelectOptions.get(param).filter((pro) => pro.children && pro.children.length).map((y) => Number(y.value));
    if (hasChildren.includes(obj.proxy)) {
      let children = SelectOptions.get(param).find((pro) => Number(pro.value) === Number(obj.proxy)).children;
      if (children.length > 0) {
        let firstChildren = SelectOptions.get(param).find((pro) => Number(pro.value) === Number(obj.proxy)).label;
        let secondLabel = children.find((child) => Number(child.value) === Number(obj.status)).label;
        return `${firstChildren}-${secondLabel}`;
      }

    } else {
      let label = SelectOptions.get(param).filter((pro) => Number(pro.value) === Number(obj.proxy))[0].label;
      return label;
    }
  }

}

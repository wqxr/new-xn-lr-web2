import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import TableHeadConfig from '../../../../../config/table-head-config';
import { XnService } from '../../../../../services/xn.service';
import { PublicCommunicateService } from '../../../../../services/public-communicate.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { InvoiceDataViewModalComponent } from '../../../../modal/invoice-data-view-modal.component';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { ActivatedRoute } from '@angular/router';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';
import { IsPreTrade } from 'libs/shared/src/lib/config/enum';
/**
 *  保理预录入-应收账款保理计划表(新万科)
 */
@Component({
  selector: 'data-content2-input',
  templateUrl: './data-content2-input.component.html',
  styles: [
    `
      .table-display tr td {
        width: 200px;
        vertical-align: middle;
        background: #fff;
      }
      .tables {
        overflow-x: hidden;
      }
      .table {
        table-layout: fixed;
        border-collapse: separate;
        border-spacing: 0;
      }
      .table-height {
        max-height: 600px;
        overflow: scroll;
      }
      .head-height {
        position: relative;
        overflow: hidden;
      }
      .table-display {
        margin: 0;
      }
      .relative {
        position: relative;
      }
      .red {
        color: #f20000;
      }
      .table tbody tr td:nth-child(5) {
        word-wrap: break-word;
      }
    `,
  ],
})
@DynamicForm({ type: 'data-content2', formModule: 'dragon-input' })
export class VankeDataContentNewComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup; // 获取的上传的excel文件内容
  @Input() svrConfig?: any;
  public ctrl: AbstractControl;
  private xnOptions: XnInputOptions;
  // 表格匹配字段
  heads = TableHeadConfig.getConfig('龙光提单').万科企业股份有限公司;
  // 应收账款保理计划表数据
  items: DebtOutputModel[] = [];
  alert = '';
  headLeft = 0;
  // 使用提单表格类型,默认''
  type = '';
  uploadCtr = true;
  // 固定第一列
  scroll_x = 0;
  hasPreTrade: boolean = false;
  constructor(
    private xn: XnService,
    private route: ActivatedRoute,
    private er: ElementRef,
    private publicCommunicateService: PublicCommunicateService,
    private localStorageService: LocalStorageService,
    private vcr: ViewContainerRef,
    public hwModeService: HwModeService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (this.svrConfig && this.svrConfig.flowId === 'bgy_financing_pre') {
        this.heads =
          TableHeadConfig.getConfig('龙光提单').碧桂园地产集团有限公司;
      } else {
        this.heads = TableHeadConfig.getConfig('龙光提单').万科企业股份有限公司;
        if (
          +params.factoringAppId ===
          applyFactoringTtype['深圳市柏霖汇商业保理有限公司']
        ) {
          const headText = JSON.parse(JSON.stringify(this.heads.headText));
          headText.splice(1, 0, {
            label: '标识',
            value: 'isPreTrade',
            options: { type: 'text1' },
          });
          this.heads.headText = this.uniqueArr(headText, 'label');
        }
      }

      this.ctrl = this.form.get(this.row.name);
      // 暂存的总部公司
      this.fromValue();
      this.xnOptions = new XnInputOptions(
        this.row,
        this.form,
        this.ctrl,
        this.er
      );
    });
  }

  uniqueArr(arr: any, prop: string) {
    return arr.reduce((pre: any, cur: any) => {
      if (!pre.some((c: any) => c[prop] === cur[prop])) {
        pre.push(cur);
      }
      return pre;
    }, []);
  }

  // 查看更多
  viewMore(item) {
    item = item.toString().split(',');
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      InvoiceDataViewModalComponent,
      item
    ).subscribe(() => {});
  }

  // 水平滚动表头 水平滚动固定第一列
  onScroll($event) {
    this.headLeft = $event.srcElement.scrollLeft * -1;
    // console.log(this.headLeft);
    const fixedColumn = $('.tables').find(
      '.head-height tr td:nth-child(1),.table-height tr td:nth-child(1)'
    );
    if ($event.srcElement.scrollLeft !== this.scroll_x) {
      this.scroll_x = $event.srcElement.scrollLeft;
      fixedColumn.each((index, col: any) => {
        col.style.transform = 'translateX(' + this.scroll_x + 'px)';
      });
    }
  }
  private fromValue() {
    this.items = XnUtils.parseObject(this.ctrl.value, []);
    this.hasPreTrade = this.items.some(
      (c: any) => c.isPreTrade === IsPreTrade.YES
    );
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
}

// 字段模型
export class DebtOutputModel {
  public index?: string; // 应收账款序号
  public headquarters: string; // 总部公司;长度[1;100]
  public projectCompany: string; // 申请付款单位;长度[1;100]
  public projectName: string; // 项目名称
  public payConfirmId: string; // 付款确认书编号
  public contractId: string; // 合同编号
  public contractName: string; // 合同名称
  public preInvoiceNum: string; // 预录入发票号码
  public preInvoiceAmount: string; // 预录入发票金额
  public receive: number; // 应收账款金额
  public debtUnit: string; // 收款单位;长度[1;100]
  public debtUnitAccount: string; // 收款单位账号
  public debtUnitBank: string; // 收款单位开户行
  public linkMan: string; // 联系人，人名
  public linkPhone: string; // 联系电话
  public factoringOrgName: string; // 应收账款受让方;长度[1;100]
  public discountRate: string; // 资产转让折扣率
  public qrsProvideTime: string; // 确认书出具日期
  public factoringEndDate: string; // 保理融资到期日
  public operatorName: string; // 运营部对接人 ;人名
  public operatorPhone: string; // 运营部对接人手机号
  public marketName: string; // 市场部对接人 ;人名
  public marketPhone: string; // 市场部对接人手机号
  public projectCity: string; // 申请付款单位归属城市
  public projectProvince: string; // 申请付款单位省份
  public isRegisterSupplier: string; // 收款单位是否注册:0表示未注册 1表示已注册
  public depositBank: string; // 托管行
  public headPreDate: string; // 总部提单日期
}

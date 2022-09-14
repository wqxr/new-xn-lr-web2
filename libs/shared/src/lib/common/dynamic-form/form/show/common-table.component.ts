import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import VankeFactorTabConfig from '../../common/table.config';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { DynamicForm } from '../../dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CertifyFileEntryModal } from 'libs/shared/src/lib/public/dragon-vanke/modal/certify-file-entry-modal.component';
import { OperateCertifyEnum } from 'libs/shared/src/lib/config/enum';
@Component({
  selector: 'common-table-share',
  templateUrl: './common-plat-contract.component.html',
  styles: [
    `
      .table-head table,
      .table-body table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0px;
      }
      .table-head {
        background-color: white;
      }
      .table-body {
        width: 100%;
        max-height: 600px;
        overflow-y: auto;
        min-height: 50px;
      }
      table thead,
      tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;
        word-wrap: break-word;
        word-break: break-all;
      }
      .table-body table tr td {
        border: 1px solid #cccccc30;
        text-align: center;
        max-width: 70px;
        word-wrap: break-word;
      }
      .table-head table tr th {
        border: 1px solid #cccccc30;
        text-align: center;
      }
      .specialTable {
        border: none !important;
      }
      .td-link > span {
        color: #1890ff;
        cursor: pointer;
      }
    `,
  ],
})
@DynamicForm({
  type: 'common-table-share',
  formModule: 'default-show',
})
export class CommonTableShareShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig?: any;
  memo: any;
  tabConfig: any;
  items: any[] = [];
  heads: any[] = [];

  constructor(
    public hwModeService: HwModeService,
    private vcr: ViewContainerRef,
    private xn: XnService,
    private er: ElementRef
  ) {}

  ngOnInit() {
    this.tabConfig = VankeFactorTabConfig.flowtableInfo.filter(
      (x) =>
        x.flowId.includes(this.row.flowId) && x.checkerId === this.row.checkerId
    );
    this.heads = this.tabConfig[0].heads;
    if (!!this.row.data) {
      this.items=JSON.parse(this.row.data);
    }
  }
  /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
  public calcAttrColspan(): number {
    return this.heads.length;
  }
  public viewFile(paramFiles) {
    const file = [XnUtils.parseObject(paramFiles)];
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      file
    ).subscribe(() => {});
  }
  // 查看录入信息
  enterCertiFiles(paramIndex: number, paramFiles) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, CertifyFileEntryModal, {...this.items[paramIndex],type:OperateCertifyEnum.VIEW}).subscribe();
  }
}

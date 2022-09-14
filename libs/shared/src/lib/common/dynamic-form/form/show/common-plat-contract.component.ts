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
@Component({
  selector: 'commom-table',
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
  type: 'common-plat-contract',
  formModule: 'default-show',
})
export class CommonFlowTableShowComponent implements OnInit {
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
      // FIXED: 在这里做表格数据的处理, 避免在模板中使用管道处理复杂格式的数据
      const value = JSON.parse(this.row.data);
      /**
       * indeItemList
       * manualApprovalList
       */
      this.items = value.map((i) => {
        i.classifyResultList.map((j) => {
          j.filePath = JSON.parse(j.file_info).filePath;
          j.fileName = JSON.parse(j.file_info).fileName;
        });
        return i;
      });
    } else {
      this.items = this.tabConfig[0].datas;
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
}

import { Component, OnInit, ElementRef, Input, AfterViewInit, OnDestroy, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import CommonTableConfig from '../../bean/common-table-config';
import { ButtonConfigModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ShangHaiMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { FileAdapterService } from 'libs/shared/src/lib/services/file-adapter.service';
import { RelationSOName } from 'libs/shared/src/lib/config/enum';

@Component({
  selector: 'lib-common-single-list-show',
  templateUrl: './common-single-list.component.html',
  styleUrls: ['./common-single-list.component.css']
})
@DynamicForm({ type: ['single-list', 'businessRef', 'baseFile'], formModule: 'dragon-show' })
export class CommonSingleListComponent implements OnInit, OnInit, AfterViewInit, OnDestroy {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  @ViewChild('tableHead') tableHead: ElementRef;

  lists: any[] = [];
  selectedItems: any[] = [];
  tableListConfig: any = {};
  myClass = '';
  alert = '';
  subResize: any;
  headTip: {
    updateTime: number | string,
    isUpdate: string
  } = {
    updateTime: 0,
    isUpdate: '无更新'
  };

  constructor(private er: ElementRef, private xn: XnService, private render2: Renderer2, private loading: LoadingService,
              private vcr: ViewContainerRef, public hwModeService: HwModeService, private fileAdapter: FileAdapterService) { }

  ngOnInit(): void {
    this.initTip();
    this.initList();
    this.subResize = fromEvent(window, 'resize').pipe(debounceTime(300)).subscribe(() => {
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

  formResize() {
      const scrollContainer = $(`<div class="custom-scrollbar" style="box-sizing: border-box;
          position: absolute;height: 100px;width: 100px;top: -3000px;left: -3000px;
          overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($('body'));
      const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
          height: 200px;"></div>`).appendTo(scrollContainer);
      // 滚动条的宽度
      const scrollBarWidth1 = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
      scrollContainer.remove();
      this.render2.setStyle(this.tableHead.nativeElement, 'width', `calc(100% - ${scrollBarWidth1}px`);
  }

  initTip() {
    const params = {};
    if (['baseFile'].includes(this.row.checkerId)){
      params['appId'] = this.svrConfig?.debtUnitId;
      this.xn.dragon.post(`/shanghai_bank/${this.svrConfig.record.flowId?.substring(0, 2)}_supplier/getSupplierUpdateFlag`, params).subscribe({
        next: x => {
          if (x && x.ret === 0 && x.data) {
            this.headTip = {
              updateTime: x.data.updateFlagTime,
              isUpdate: AllStatus[x.data.updateFlag],
            };
          }
        },
        error: errors => {
          console.log('error', errors);
        },
        complete: () => {}
      });
    }
  }

  initList() {
    // 配置
    this.tableListConfig = CommonTableConfig.getConfig(this.row.checkerId) || new TabListOutputModel();
    if (!!this.tableListConfig.post_url){
      const params = {
        appId: this.svrConfig?.debtUnitId,
        kw: JSON.stringify([RelationSOName[this.svrConfig.record.flowId.substring(0, 2).toLocaleUpperCase()], '上海银行'])
      };
      this.xn.dragon.post(this.tableListConfig.post_url, params).subscribe({
        next: x => {
          if (x && x.ret === 0 && x.data) {
            this.lists = XnUtils.parseObject(x.data, []) || [];
          }
        },
        error: errors => {
          console.log('error', errors);
        },
        complete: () => {
          this.calcAlertClass();
        }
      });
    } else {
      this.lists = XnUtils.parseObject(this.row.data, []);
      this.calcAlertClass();
    }
  }

  getFielsName(key: string): string {
    return FilesName[key] || '';
  }

  /**
   * 行按钮组事件
   * @param paramItem 当前行数据
   * @param btn 按钮操作配置
   * @param i 下标
   */
  public handleHeadClick(btn: ButtonConfigModel) {
    if (btn.operate === 'download_all') {
      const param = {
        appId: this.svrConfig?.debtUnitId
      };
      XnUtils.checkLoading(this);
      this.xn.dragon.download(`/shanghai_bank/${this.svrConfig.record.flowId?.substring(0, 2)}_supplier/shBaseFileAllDown`, param).subscribe((v: any) => {
        this.loading.close();
        this.xn.api.save(v._body, `${this.svrConfig?.debtUnit}-准入资料.zip`);
      });
    }
  }

  /**
   * 行按钮组事件
   * @param item 当前行数据
   * @param btn 按钮操作配置
   * @param i 下标
   */
  public handleRowClick(item: any, btn: ButtonConfigModel, i: number) {
    if (btn.operate === 'view') {
      this.viewFiles(item.fileInfo, false);
    } else if (btn.operate === 'download') {
      if (item.fileInfo && item.fileInfo.length === 1){
        this.fileAdapter.saveFile(item.fileInfo[0], `${FilesName[item.fileType]}-${item.fileInfo[0]?.fileName}`, 'dragon');
      } else {
        XnUtils.checkLoading(this);
        const param = {
          appId: this.svrConfig?.debtUnitId,
          fileType: item.fileType
        };
        this.xn.dragon.download(`/shanghai_bank/${this.svrConfig.record.flowId?.substring(0, 2)}_supplier/shBaseFileDown`, param).subscribe((v: any) => {
          this.loading.close();
          this.xn.api.save(v._body, `${this.svrConfig?.debtUnit}-${FilesName[item.fileType]}.zip`);
        });
      }
    }
  }

  // 查看文件
  viewFiles(files: any[], isAvenger: boolean) {
    files.map((x: any) => {
      x.isAvenger = isAvenger;
    });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiMfilesViewModalComponent, files).subscribe(v => {
      if (v.action === 'cancel') {
        return;
      } else {
      }
    });
  }

  /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
  public calcAttrColspan(): number {
    let nums: number = this.tableListConfig.list.headText.length + 1;
    const boolArray = [this.tableListConfig.list.canChecked,
    this.tableListConfig.list.edit && this.tableListConfig.list.edit.rowButtons && this.tableListConfig.list.edit.rowButtons.length > 0];
    nums += boolArray.filter(arr => arr === true).length;
    return nums;
  }

  private calcAlertClass() {
    if (this.row.checkerId === 'businessRef') {
      // 提示
      const isLimit = this.lists.some((x: any) => x.grade.toString() === '4');
      const tipStr = XnUtils.distinctArray(this.lists.map((x: any) => x.kw));
      this.alert = isLimit ? `${this.alert ? ',' : ''}该企业已达4级查询上限，请手动核查关联级别为4的企业与${tipStr.join('、')}关联关系` : this.alert;
    }
  }

}

export enum AllStatus {
  '有更新' = 1,
  '无更新' = 0,
}

enum FilesName {
  businessLicenseFile = '营业执照',
  orgLegalCardFile = '法定代表人身份证',
  orgLegalCertFile = '法人证明书',
  profitsRecognitionFile = '受益所有人识别表',
  profitsCardFile	= '受益所有人身份证',
  companyDecisionFile	= '公司章程',
  authorizeLetterFile	= '征信授权书',
  financeFile = '财务报表',
}

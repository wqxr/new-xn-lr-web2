import { Component, OnInit, ElementRef, Input, AfterViewInit, OnDestroy, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import CommonTableConfig from '../../bean/common-table-config';
import { ButtonConfigModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ShangHaiMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { FileAdapterService } from 'libs/shared/src/lib/services/file-adapter.service';
import { RelationSOName } from 'libs/shared/src/lib/config/enum';

@Component({
  selector: 'lib-common-single-list',
  templateUrl: './common-single-list.component.html',
  styleUrls: ['./common-single-list.component.css']
})
@DynamicForm({ type: ['single-list', 'businessRef', 'baseFile'], formModule: 'dragon-input' })
export class CommonSingleListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  @ViewChild('tableHead') tableHead: ElementRef;

  lists: any[] = [];
  selectedItems: any[] = [];
  tableListConfig: any = {};
  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;
  subResize: any;
  headTip: {
    updateTime: number | string,
    isUpdate: string
  } = {
    updateTime: 0,
    isUpdate: '无更新'
  };
  constructor(private er: ElementRef, private xn: XnService, private render2: Renderer2, private fileAdapter: FileAdapterService,
              private vcr: ViewContainerRef, private loading: LoadingService, public hwModeService: HwModeService) { }

  ngOnInit(): void {
    this.ctrl = this.form.get(this.row.name);
    this.initTip();
    this.initList();
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
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
      const params = {};
      if (['businessRef'].includes(this.row.checkerId)){
        params['appId'] = this.svrConfig?.debtUnitId;
        params['kw'] = JSON.stringify([RelationSOName[this.svrConfig.record.flowId.substring(0, 2).toLocaleUpperCase()], '上海银行'])
      }
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
          this.toValue();
          this.calcAlertClass();
        }
      });
    } else {
      if (['baseFile'].includes(this.row.checkerId) && ['sh_vanke_platform_verify', 'so_platform_verify'].includes(this.row.flowId)){
        const resList = XnUtils.parseObject(this.row.value, []) || [];
        const keys = XnUtils.distinctArray(resList.map((v: any) => v.fileType));
        this.lists = keys.map((key: string) => {
          const fileInfo = resList.filter((res: any) => key === res.fileType).map((z: any) => XnUtils.parseObject(z.fileInfo, {}));
          return {
            fileType: key,
            fileInfo,
            operatorUserId: resList.find((res: any) => key === res.fileType)?.operatorUserId || ''
          };
        });
      } else {
        this.lists = XnUtils.parseObject(this.row.value, []);
      }
      this.toValue();
      this.calcAlertClass();
    }
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
        const param = {
          appId: this.svrConfig?.debtUnitId,
          fileType: item.fileType
        };
        XnUtils.checkLoading(this);
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

  getFielsName(key: string): string {
    return FilesName[key] || '';
  }

  /**
   *  判读列表项是否全部选中
   */
  public isAllChecked(): boolean {
    return !(this.lists.some(x => !x.checked || x.checked && x.checked === false) || !this.lists.length);
  }

  /**
   *  全选
   */
  public checkAll() {
    if (!this.isAllChecked()) {
      this.lists.forEach(item => item.checked = true);
      if (!!this.tableListConfig.list.value) {
        this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.lists], this.tableListConfig.list.value);
      } else {
        this.selectedItems = XnUtils.distinctArray([...this.selectedItems, ...this.lists]);
      }
    } else {
      this.lists.forEach(item => item.checked = false);
      this.selectedItems = [];
    }
  }

  /**
   * 单选
   * @param paramItem
   * @param index
   */
  public singleChecked(paramItem: any, index: number) {
    if (paramItem.checked && paramItem.checked === true) {
      paramItem.checked = false;
      if (!!this.tableListConfig.list.value) {
        this.selectedItems = this.selectedItems
        .filter((x: any) => x[this.tableListConfig.list.value] !== paramItem[this.tableListConfig.list.value]);
      } else {
        this.selectedItems = this.selectedItems.filter((x: any, indexs: number) => indexs !== index);
      }
    } else {
      paramItem.checked = true;
      this.selectedItems.push(paramItem);
      if (!!this.tableListConfig.list.value) {
        this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.lists], this.tableListConfig.list.value);
      } else {
        this.selectedItems = XnUtils.distinctArray([...this.selectedItems, ...this.lists]);
      }
    }
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

  public onBlur() {
    this.calcAlertClass();
  }

  private calcAlertClass() {
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    if (this.row.checkerId === 'businessRef') {
      // 提示
      const isLimit = this.lists.some((x: any) => x.grade.toString() === '4');
      const tipStr = XnUtils.distinctArray(this.lists.map((x: any) => x.kw));
      this.alert = isLimit ? `${this.alert ? ',' : ''}该企业已达4级查询上限，请手动核查关联级别为4的企业与${tipStr.join('、')}关联关系` : this.alert;
    }
  }

  private toValue() {
    if (!this.lists.length) {
      this.ctrl.setValue('');
    } else {
      this.ctrl.setValue(JSON.stringify(this.lists));
    }
    this.ctrl.markAsTouched();
    this.calcAlertClass();
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
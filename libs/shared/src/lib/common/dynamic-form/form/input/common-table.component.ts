import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import VankeFactorTabConfig from '../../common/table.config';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { DynamicForm } from '../../dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from '../../../xn-form-utils';
import { CertifyFileEntryModal } from 'libs/shared/src/lib/public/dragon-vanke/modal/certify-file-entry-modal.component';
import * as moment from 'moment';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
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
        padding-top:5px;
      }
      .table-body {
        width: 100%;
        max-height: 600px;
        overflow-y: auto;
        min-height: 50px;
      }
      .headstyle tr th {
        border: 1px solid #cccccc30;
        text-align: center;
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
      .td-link > span {
        color: #1890ff;
        cursor: pointer;
      }
    `,
  ],
})
@DynamicForm({
  type: 'common-table-share',
  formModule: 'default-input',
})
export class CommonTableShareComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig?: any;
  public fileType: string;
  public fileSrc: string[] = [];
  public fSrc: string;
  public total: number;
  public pageSize = 1;
  memo: any;
  tabConfig: any;
  items: any[] = [];
  heads: any[] = [];
  operatesButton: any[] = [];
  allItems: any[] = [];
  public fileUpload = [
    {
      name: '',
      checkerId: 'contractUpload',
      type: 'dragonMfile',
      required: 1,
      stepId: '',
      value: '',
      options:
        '{"filename": "资质文件","fileext": "jpg, jpeg, png,pdf", "picSize": "500"}',
    },
  ];
  public ctrl: AbstractControl;
  public xnOptions: XnInputOptions;
  mainForm: FormGroup;
  public rowButtons: Array<{ label: string, value: string, click: any }> = [];

  constructor(
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private er: ElementRef,
    private vcr: ViewContainerRef,
    private xn: XnService,
    public publicCommunicateService: PublicCommunicateService,
    public localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    this.tabConfig = VankeFactorTabConfig.flowtableInfo.filter(
      (x) =>
        x.flowId.includes(this.row.flowId) && x.checkerId === this.row.checkerId
    );
    this.heads = this.tabConfig[0].heads;
    this.operatesButton = this.tabConfig[0].headOperate;
    this.rowButtons = this.tabConfig[0].rowButtons;
    XnFormUtils.convertChecker(this.fileUpload[0]);
    this.mainForm = XnFormUtils.buildFormGroup(this.fileUpload);
    if (!!this.row.value) {
      if (XnUtils.isArray(this.row.value)) {
        this.items = this.row.value;
      } else {
        this.items = JSON.parse(this.row.value);
      }
    }
    if (!!this.form.get('appName')) {
      this.publicCommunicateService.change.subscribe(x => {
        this.items = [];
        this.allItems = x.certifyfileList;
        const checkItems = x.certifyfileList.filter(x => x.checked === true);
        if (checkItems.length > 0) {
          for (let i = 0; i < checkItems.length; i++) {
            this.items.push({ certify_file: JSON.stringify([checkItems[i]]), appName: this.form.get('appName').value, id: 0, certify_app_name: this.form.get('appName').value, certify_code: '', certify_date: '', certify_indate: '', certifyClasseList: [] });
          }
        }
        this.formValue();
      })
      this.cdr.markForCheck();
    }

    this.formValue();
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
    this.mainForm.valueChanges.subscribe((x) => {
      const files = JSON.parse(x.contractUpload);
      for (let i = 0; i < files.length; i++) {
        this.items.push({ certify_file: JSON.stringify(files[i]), appName: '', id: 0, certify_code: '', certify_date: '', certify_indate: '', certifyClasseList: [] });
      }
    });
  }
  formValue() {
    if (this.items.length > 0) {
      try {
        this.ctrl.setValue(JSON.stringify(this.items));
      } catch (error) {
        console.log('error', error);
      }
    } else {
      this.ctrl.setValue('');
    }


  }
  viewFile(paramFiles) {
    let file;
    if (XnUtils.isArray((XnUtils.parseObject(paramFiles)))) {
      file = XnUtils.parseObject(paramFiles);
    } else {
      file = [XnUtils.parseObject(paramFiles)];
    }
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      file
    ).subscribe(() => { });
  }
  // 录入信息
  enterCertiFiles(paramIndex: number, paramFiles) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, CertifyFileEntryModal, { ...this.items[paramIndex], type: OperateCertifyEnum.ENTER, flowId: this.row.flowId })
      .subscribe(x => {
        if (!!x) {
          this.items[paramIndex] = x.value;
          this.formValue();
        }
      });
  }
  deleteCertiFiles(paramIndex: number, paramFiles) {
    let fileId = JSON.parse(paramFiles)[0].fileId;
    this.allItems.forEach(x => {
      if (x.fileId === fileId) {
        x.checked = false
      }
    });
    this.localStorageService.setCacheValue('certifyfileList', this.allItems);
    this.items.splice(paramIndex, 1);
    this.formValue();
  }
  /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
  public calcAttrColspan(): number {
    return this.heads.length;
  }
  rowBtnClick(btn) {

  }
}

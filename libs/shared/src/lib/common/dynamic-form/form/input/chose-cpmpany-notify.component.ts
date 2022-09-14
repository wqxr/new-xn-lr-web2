import {
  Component,
  OnInit,
  ElementRef,
  Input,
  ChangeDetectionStrategy,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from '../../dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { isNullOrUndefined } from 'util';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

@Component({
  template: `
    <div [formGroup]="form">
      <div style="margin-bottom:10px">
        <label
          class="xn-input-font"
          style="margin-right: 20px;"
          *ngFor="let option of selectType"
        >
          <ng-container>
            <input
              (click)="GetRadioValue(option.value)"
              [checked]="checkedValue === option.value"
              name="getcompany"
              type="radio"
              value="{{ option.value }}"
              [disabled]="readOnly"
              class="flat-red"
            />&nbsp;&nbsp;{{ option.label }}
          </ng-container>
        </label>
      </div>
      <ng-container *ngIf="checkedValue === 1 && !readOnly">
        <div
          class="btn btn-default btn-file xn-table-upload"
          style="float:left"
        >
          <span class="hidden-xs xn-input-font">上传Excel</span>
          <input
            type="file"
            (change)="uploadExcel($event)"
            (click)="beforeUpload($event)"
          />
        </div>
        <a
          style="line-height: 30px;
    height: 40px; margin-left:20px;"
          href="javaScript:void(0)"
          (click)="downloadTp02()"
          >下载模板</a
        >
      </ng-container>
      <p
        *ngIf="selectedItems.length !== 0 && checkedValue === 1"
        class="company-detail"
      >
        上传公司总数{{ totalCompany }}
        <span>&nbsp;&nbsp;&nbsp;其中成功{{ successCompany.length }}</span
        >&nbsp;&nbsp;&nbsp;失败
        <span style="color:red">{{ selectedItems.length }}</span>
      </p>
      <div style="clear:both;display:flex">
        <div
          *ngIf="selectedItems.length !== 0 && checkedValue === 1"
          style="width:50%"
        >
          <p style="text-align:center">失败企业</p>
          <div class="fail-company">
            <p *ngFor="let head of selectedItems" style="padding-left:10px">
              <a>{{ head.appName }}</a>
            </p>
          </div>
        </div>

        <div
          *ngIf="successCompany.length !== 0 && checkedValue === 1"
          style="width:50%"
        >
          <p style="text-align:center">成功企业</p>

          <div class="fail-company">
            <p *ngFor="let head of successCompany" style="padding-left:10px">
              <a>{{ head.appName }}</a>
            </p>
          </div>
        </div>
      </div>

      <div>
        <span class="xn-input-alert">{{ alert }}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .company-detail {
        float: left;
        margin-left: 20px;
        height: 30px;
        line-height: 30px;
      }

      .fail-company {
        height: 100px;
        border: 1px solid #ccc;
        overflow: auto;
        border-radius: 5px;
      }
    `,
  ],
})
// 查看二维码checker项
@DynamicForm({ type: 'special-click', formModule: 'default-input' })
export class ChoseCompanyNotifyComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  public myClass = ''; // 控件样式
  public alert = ''; // 错误提示
  public moneyAlert = ''; // 金额提示
  public ctrl: AbstractControl;
  public xnOptions: XnInputOptions;
  checkedValue = 0;
  public ctrlWith = false; // 特殊属性
  selectType = [
    { label: '部分企业', value: 1 },
    { label: '全部企业', value: 2 },
  ];
  selectedItems: any[] = [];
  totalCompany: number;
  successCompany: any[] = [];
  readOnly = false;
  constructor(
    private er: ElementRef,
    private xn: XnService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    if (!!this.row.value) {
      const value = JSON.parse(this.row.value);
      if (value.sendType === 'part') {
        this.checkedValue = 1;
        this.readOnly = true;
        this.successCompany = value.partAppIds.map((x) => ({ appName: x }));
        this.ctrl.setValue('');
      } else {
        this.checkedValue = 2;
      }
    }
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
    this.calcAlertClass();
  }

  public downloadTp02() {
    const a = document.createElement('a');
    a.href = '/assets/lr/doc/公司.xlsx';
    a.click();
  }
  GetRadioValue(value: string) {
    this.checkedValue = Number(value);
    if (this.checkedValue === 2) {
      this.ctrl.setValue({ sendType: 'all' });
    }
  }
  beforeUpload() {}

  calcAlertClass(): void {
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
  // 验证是否是excel
  private validateExcelExt(s: string): string {
    if (isNullOrUndefined(this.row.options)) {
      return '';
    }
    if ('excelext' in this.row.options) {
      const exts = this.row.options.excelext
        .replace(/,/g, '|')
        .replace(/\s+/g, ''); // 删除所有空格
      if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
        return '';
      } else {
        return `只支持以下文件格式: ${this.row.options.excelext}`;
      }
    } else {
      return '';
    }
  }
  // 上传excel
  uploadExcel(e) {
    if (e.target.files.length === 0) {
      return;
    }

    const err = this.validateExcelExt(e.target.files[0].name);
    if (!XnUtils.isEmpty(err)) {
      this.alert = err;
      $(e.target).val('');
      return;
    }

    const fd = new FormData();
    fd.append('file_data', e.target.files[0], e.target.files[0].name);
    /**
     *  应收款保理计划表上传
     */
    this.xn.api.dragon
      .upload('/message_notice/upload_excel', fd)
      .subscribe((json) => {
        if (json.type === 'complete') {
          if (json.data.ret === 0) {
            this.selectedItems = json.data.data.fail;
            this.totalCompany =
              this.selectedItems.length + json.data.data.success.length;
            this.successCompany = json.data.data.success;
            const list = this.successCompany.map((x: any) => x.appId);
            this.ctrl.setValue({ sendType: 'part', partAppIds: list });
            this.cdr.markForCheck();
          }
        }

        $(e.target).val('');
        this.ctrl.markAsDirty();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
      });
  }
  // openChoseCompany() {
  //     XnModalUtils.openInViewContainer(this.xn, this.vcr, CustomerAddCompanyModalComponent, { type: 2 }).subscribe(x => {
  //         console.info('company==>', x);
  //         if (!!x) {
  //             this.selectedItems = x;
  //             const list = this.selectedItems.map((x: any) => x.appId);
  //             this.ctrl.setValue(list);
  //             this.cdr.markForCheck();
  //         }
  //     });

  // }
}

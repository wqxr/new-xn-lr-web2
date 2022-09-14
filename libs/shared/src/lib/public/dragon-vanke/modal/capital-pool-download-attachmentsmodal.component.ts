import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from '../../../common/modal/ng2-bs3-modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';
import {
  DragonContentType,
  SelectRange,
  DownloadType,
  CapitalType,
} from '../../../common/dragon-vanke/emus';
import { XnUtils } from '../../../common/xn-utils';

/**
 *  资产池下载附件
 */
@Component({
  templateUrl: './capital-pool-download-attachments-modal.component.html',
})
export class CapitalPoolDownloadAttachmentsModalComponent implements OnInit {
  public params: any;
  public form: FormGroup;
  @ViewChild('modal')
  modal: ModalComponent;
  private observer: any;
  public shows: any[] = [];
  private selectItem: any;
  public formModule = 'dragon-input';
  public dragonFileList = [
    {
      value: 'certificateFile',
      label: '《资质证明文件》',
    },
    {
      value: 'performanceFile',
      label: '《履约证明文件》',
    },
    {
      value: 'otherFile',
      label: '《供应商其他文件》',
    },
    {
      value: 'factoringOtherFile',
      label: '《保理商其他文件》',
    },
    {
      value: 'contractFile',
      label: '《基础交易合同文件》',
    },
    {
      value: 'statementFile',
      label: '《形象进度表/结算单》',
    },
    {
      value: 'pdfProjectFiles',
      label: '《付款确认书》',
    },
    {
      value: 'backUpFiles',
      label: '后补资料',
    },
    {
      value: 'disposeFiles',
      label: '特殊资产处置文件',
    },
    {
      value: 'registerFile',
      label: '登记证明文件',
    },
    {
      value: 'assetFile',
      label: '查询证明文件',
    },
    {
      value: 'invoiceFile',
      label: '发票文件',
    },
    {
      value: 'commonCaSignFile',
      label: '通用签章文件',
    },
    {
      value: 'firstContractFile',
      label: '一次转让合同文件',
    },
    {
      value: 'secondContractFile',
      label: '资产池相关文件',
    },
    {
      value: 'lawSurveyFiles',
      label: '律所尽调文件',
    },
    {
      value: 'managerSurveyFiles',
      label: '管理人尽调文件',
    },
    {
      value: 'factorAddLawFiles',
      label: '保理商补充律所尽调文件',
    },
    {
      value: 'factorManagerLawFiles',
      label: '保理商补充管理人尽调文件',
    },
    {
      value: 'vankeBuyerFile',
      label: '买方确认函（万科线上）',
    },
    { label: '放款回单', value: 'loanReturn' },
  ];

  public constructor(private xn: XnService) {}

  open(params: any): Observable<string> {
    this.params = params;
    if (this.params.capitalType === 1) {
      this.shows = [
        {
          checkerId: 'scope',
          name: 'scope',
          required: true,
          type: 'radio',
          title: '下载范围',
          selectOptions: [
            { value: SelectRange.All, label: '当前资产池下的所有交易' },
            { value: SelectRange.Select, label: '勾选交易' },
          ],
        },
        {
          checkerId: 'downloadType',
          name: 'downloadType',
          required: true,
          type: 'radio',
          title: '下载附件方式',
          value: 'true',
          selectOptions: [
            { value: true, label: '分不同文件夹' },
            { value: false, label: '放在同一文件夹' },
          ],
        },
        {
          checkerId: 'isSample',
          name: 'isSample',
          required: false,
          type: 'radio',
          title: '是否是抽样业务',
          selectOptions: [
            { value: 0, label: '抽样业务' },
            { value: 1, label: '非抽样业务' },
          ],
        },
        {
          checkerId: 'contentType',
          name: 'contentType',
          required: true,
          type: 'checkbox',
          title: '下载内容',
          selectOptions: [],
        },
      ];
    } else {
      this.shows = [
        {
          checkerId: 'scope',
          name: 'scope',
          required: true,
          type: 'radio',
          title: '下载范围',
          selectOptions: [
            { value: SelectRange.All, label: '当前资产池下的所有交易' },
            { value: SelectRange.Select, label: '勾选交易' },
          ],
        },
        {
          checkerId: 'downloadType',
          name: 'downloadType',
          required: true,
          type: 'radio',
          title: '下载附件方式',
          value: 'true',
          selectOptions: [
            { value: true, label: '分不同文件夹' },
            { value: false, label: '放在同一文件夹' },
          ],
        },
        {
          checkerId: 'contentType',
          name: 'contentType',
          required: true,
          type: 'checkbox',
          title: '下载内容',
          selectOptions: [],
        },
      ];
    }
    this.shows.find((obj) => obj.checkerId === 'contentType').selectOptions =
      this.dragonFileList;
    // 根据 this.shows 中 selectOptions 配置
    if (!params.hasSelect) {
      this.shows
        .find((obj) => obj.checkerId === 'scope')
        .selectOptions.filter(
          (x) => x.value !== SelectRange.All && x.value !== SelectRange.Sample
        )
        .forEach((v) => (v.disable = true));
    }
    this.form = XnFormUtils.buildFormGroup(this.shows);
    this.modal.open(ModalSize.Large);
    return Observable.create((observer) => {
      this.observer = observer;
    });
  }

  public ngOnInit() {}

  public onSubmit() {
    const newFormValue = XnUtils.deepClone(this.form.value);
    newFormValue.scope = Number(newFormValue.scope);
    newFormValue.downloadType =
      newFormValue.downloadType === 'true' ? true : false;
    if (!!newFormValue.isSample) {
      newFormValue.isSample = newFormValue.isSample === '0' ? 0 : 1;
    }
    this.close(newFormValue);
  }

  public onCancel() {
    this.close('');
  }

  private close(value) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }
}

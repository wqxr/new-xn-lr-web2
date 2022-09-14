/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\download-modal\download-modal.component.ts
 * @summary：download-modal.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-15
 ***************************************************************************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from '../../../../../../../apps/xn-lr-web/src/app/pages/portal/shared/utils';
import { DownloadRange } from 'libs/shared/src/lib/config/enum/abs-gj.enum';

@Component({
  templateUrl: './download-modal.component.html',
})
export class GjDownloadModalComponent implements OnInit {
  public params: any;
  public form: FormGroup;
  @ViewChild('modal')
  modal: ModalComponent;
  private observer: any;
  public shows: any;
  public oldShows: any;
  public newShows: any;
  public formModule = 'dragon-input';

  constructor() {}

  open(params: any): Observable<string> {
    this.params = params;

    this.shows = [
      {
        checkerId: 'downloadRange',
        name: 'downloadRange',
        required: true,
        type: 'radio',
        title: '下载范围',
        selectOptions: [
          {
            value: DownloadRange.All,
            label: '当前页下的所有交易',
          },
          {
            value: DownloadRange.Selected,
            label: '勾选交易',
          },
        ],
      },
      {
        checkerId: 'isClassify',
        name: 'isClassify',
        required: true,
        type: 'radio',
        title: '下载附件方式',
        selectOptions: [
          {value: true, label: '分不同文件夹'},
          {value: false, label: '放在同一文件夹'},
        ],
        value: 'true',
      },
      {
        checkerId: 'chooseFile',
        name: 'chooseFile',
        required: true,
        type: 'checkbox',
        title: '下载内容',
        selectOptions: [
          {
            value: 'certificateFile',
            label: '《资质证明文件》',
          },
          {
            value: 'otherFile',
            label: '《供应商其他文件》',
          },
          {
            value: 'invoiceFile',
            label: '《发票文件》',
          },
          {
            value: 'statementFile',
            label: '《形象进度表/结算单》',
          },
          {
            value: 'contractFile',
            label: '《基础交易合同文件》',
          },
          {
            value: 'performanceFile',
            label: '《履约证明文件》',
          },
          {
            value: 'factoringOtherFile',
            label: '《保理商其他文件》',
          },
          {
            value: 'pdfProjectFiles',
            label: '《付款确认书》',
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
            value: 'registerFile',
            label: '《登记证明文件》',
          },
          {
            value: 'assetFile',
            label: '《查询证明文件》',
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
            value: 'loanReturn',
            label: '《放款回单》'
          },
          {
            value: 'commonCaSignFile',
            label: '《通用签章文件》',
          },
        ],
      },
    ];

    // 是否有勾选列表中某行
    if (!params.hasSelect) {
      this.shows[0].selectOptions[1].disable = true;
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
    if (!!newFormValue.isClassify) {
      newFormValue.isClassify =
        newFormValue.isClassify === 'true';
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

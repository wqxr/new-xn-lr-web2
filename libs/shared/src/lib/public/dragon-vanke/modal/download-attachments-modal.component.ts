import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import {
  ModalComponent,
  ModalSize,
} from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { XnUtils } from '../../../common/xn-utils';

/**
 *  台账下载附件
 */
@Component({
  templateUrl: './download-attachments-modal.component.html',
})
export class DownloadAttachmentsModalComponent implements OnInit {
  public params: any;
  public form: FormGroup;
  @ViewChild('modal')
  modal: ModalComponent;
  private observer: any;
  public shows: any;
  public oldShows: any;
  public newShows: any;
  private selectItem: any;
  private oldSelectItem: any;
  public formModule = 'dragon-input';

  public constructor(private xn: XnService) {}

  open(params: any): Observable<string> {
    /**
         '基础模式' = 0,'回购' = 1,'委托' = 2,'万科' = 6,'定向' = 13,'金地' = 14,
         '采购融资' = 50,'协议' = 51,'龙光' = 52,'新万科' = 53,'碧桂园' = 54,
         '新金地' = 56,'雅居乐-星顺' = 57
        */
    this.params = params;
    const hasOldInList = params.listInfo.some(
      (y: any) => [50, 52, 53, 54, 55, 56, 57].indexOf(y.isProxy) === -1
    ); // 列表是否有老业务
    const hasNewInList = params.listInfo.some(
      (z: any) => [50, 52, 53, 54, 55, 56, 57].indexOf(z.isProxy) > -1
    ); // 列表是否有新业务
    const hasOldInSel = params.selectedItems.some(
      (x: any) => [50, 52, 53, 54, 55, 56, 57].indexOf(x.isProxy) === -1
    ); // 勾选的中是否有老业务

    const isAllOldInList = !hasNewInList; // 列表是否全是老业务
    const isAllNewInList = !hasOldInList; // 列表是否全是新业务

    this.shows = [
      {
        checkerId: 'downloadRange',
        name: 'downloadRange',
        required: true,
        type: 'radio',
        title: '下载范围',
        selectOptions: [
          {
            value: 'all',
            label: '当前页下的所有交易',
          },
          {
            value: 'selected',
            label: '勾选交易',
          },
        ],
      },
    ];

    this.newShows = [
      {
        checkerId: 'isClassify',
        name: 'isClassify',
        required: true,
        type: 'radio',
        title: '下载附件方式',
        selectOptions: [
          { value: true, label: '分不同文件夹' },
          { value: false, label: '放在同一文件夹' },
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
        ],
      },
    ];
    this.oldShows = [
      {
        checkerId: 'oldchooseFile',
        name: 'oldchooseFile',
        required: true,
        type: 'checkbox',
        title: '老ABS业务下载内容',
        selectOptions: [
          {
            value: 'capitalPoolContract01',
            label: '《致总部公司通知书（二次转让）》',
          },
          {
            value: 'capitalPoolContract02',
            label: '《致项目公司通知书（二次转让）》',
          },
          {
            value: 'capitalPoolContract03',
            label: '《总部公司回执（二次转让）》',
          },
          {
            value: 'capitalPoolContract04',
            label: '《项目公司回执（二次转让）》',
          },
          {
            value: 'headquartersReceipt',
            label: '《总部公司回执（一次转让）》',
          },
          {
            value: 'projectReceipt',
            label: '《项目公司回执（一次转让）》',
          },
          {
            value: 'pdfProjectFiles',
            label: '《付款确认书（总部致保理商）》',
          },
          {
            value: 'projectQrs',
            label: '《付款确认书（项目公司致供应商）》',
          },
          {
            value: 'tradersQrs',
            label: '《付款确认书（总部致券商）》',
          },
          {
            value: 'pdfProjectFiles',
            label: '《付款确认书（总部致供应商）》',
          },
          {
            value: 'confirmFile',
            label: '《确认函》',
          },
          { label: '放款回单', value: 'loanReturn' },
        ],
      },
    ];
    // 是否有勾选列表中某行
    if (!params.hasSelect) {
      this.shows[0].selectOptions[1].disable = true;
      if (hasNewInList) {
        this.shows.push(...this.newShows);
      }
      if (hasOldInList) {
        this.shows.push(...this.oldShows);
      }
    } else {
      if (isAllNewInList) {
        this.shows.push(...this.newShows);
      } else if (isAllOldInList) {
        this.shows.push(...this.oldShows);
      } else {
        this.shows.push(...this.newShows, ...this.oldShows);
      }
    }
    if (hasOldInList || hasOldInSel) {
      // 老ABS业务根据 this.shows 中 selectOptions 的顺序，从0开始,包含即disable
      this.oldSelectItem = {
        万科: [2, 4, 5, 7, 8, 9], // 0 1 3 6
        '金地（集团）股份有限公司': [2, 4, 5, 7, 8, 9, 10],
        雅居乐地产控股有限公司: [6, 8, 10],
        雅居乐集团控股有限公司: [6, 8, 10],
        深圳市龙光控股有限公司: [0, 2, 4, 7, 9, 10],
        notConsiderCompany: [0, 2, 4, 6, 8, 9, 10], // 1 3 5 7
        碧桂园地产集团有限公司: [2, 4, 5, 7, 8, 9],
        深圳华侨城股份有限公司: [2, 4, 5, 7, 8, 9],
      };
      const index = this.shows.findIndex(
        (a) => a.checkerId === 'oldchooseFile'
      );
      this.oldSelectItem[params.selectedCompany].forEach((c) => {
        this.shows[index].selectOptions = this.shows[index].selectOptions.map(
          (v, i) => {
            if (i === c) {
              v.disable = true;
            }
            return v;
          }
        );
      });
    }
    // console.log(this.shows);
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
        newFormValue.isClassify === 'true' ? true : false;
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

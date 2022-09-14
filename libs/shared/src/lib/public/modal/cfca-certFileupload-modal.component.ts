import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { XnService } from '../../services/xn.service';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { EditInfoModalComponent } from '../component/edit-info-modal.component';

@Component({
    templateUrl: './cfca-certFileupload-modal.component.html',
    styles: [
        ` .spanClass{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #1F2B38;
            letter-spacing: 0;
            padding-left:40px;
        }
        .flex-row {
            display: flex;
        }
        .this-flex-1 {
            flex: 1;
        }

        .this-flex-2 {
            flex: 2;
        }
        .rejectinfoclass{
            background:rgba(187, 32, 32, 0.1) ;
            margin-bottom:10px;
            margin-left: 5%;
            width:728px;
        }
        .infodetail{
            width: 664px;
            margin: auto auto;
            padding-bottom: 10px;
            padding-top: 10px;
        }
        `
    ]
})
export class CfcaCertFileUploadModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    params: any = {} as any;
    public mainForm: FormGroup;
    currentParams: any;
    rejectReason = '';
    step6: any[] = [
        {
            title: '变更确认函', checkerId: 'authConfirmationFile', type: 'down-upload',
            options: {
                filename: '授权确认函(CA)',
                fileext: 'pdf',
                picSize: '300',
                type: 1,
                value: '',
            }
        },
        {
            title: '原件邮寄地址', checkerId: 'address', type: 'label', value: '深圳市福田区莲花街道海田路民生金融大厦14层深圳市链融科技股份有限公司，运行部授权函，0755-29966132', memo: '请使用顺丰或EMS邮寄'
        },
        {
            title: '快递单号', checkerId: 'expressNum', options: { readonly: false }, memo: '', placeholder: '请准确填写快递单号'
        },
    ];

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {
        this.currentParams = params;
        this.step6[0].options.value = JSON.stringify(this.currentParams);
        if (this.currentParams && this.currentParams.memo) {
            this.rejectReason = this.currentParams.memo;
        }
        this.buildForm6();
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    onSubmit() {
        this.close(this.mainForm.value);
    }
    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    private buildForm6() {
        XnFormUtils.buildSelectOptions(this.step6);
        // this.assign(this.step6);
        this.buildChecker(this.step6);
        this.mainForm = XnFormUtils.buildFormGroup(this.step6);
    }
    private assign(stepRows) {
        for (let row of stepRows) {
            if (row.checkerId in this.params) {
                row.value = this.params[row.checkerId];
            }
        }
    }
    private buildChecker(stepRows) {
        for (let row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
    public onPrev() {
        this.close({ action: 'prev' });
    }


    onCancel() {
        this.close(null);
    }
}

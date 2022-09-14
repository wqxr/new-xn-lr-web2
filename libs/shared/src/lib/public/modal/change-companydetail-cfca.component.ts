import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { XnService } from '../../services/xn.service';
import { FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { FileViewModalComponent } from './file-view-modal.component';
import { PdfSignModalComponent } from './pdf-sign-modal.component';
import { NzDemoModalBasicComponent } from './cfca-result-modal.component';

@Component({
    templateUrl: './change-companydetail-cfca.component.html',
    styles: [
        `.table-display tr td {
            width: 200px;
            vertical-align: middle;
            background: #fff;
        }
        .tables {
            overflow-x: hidden;
        }
        .table {
            table-layout: fixed;
            border-collapse: separate;
            border-spacing: 0;
        }
        .table-height {
            max-height: 600px;
            overflow: scroll;
        }
        .head-height {
            position: relative;
            overflow: hidden;
        }
        .table-display {
            margin: 0;
        }
         .spanColor{
            color:orange;
        }
        .relative {
            position: relative
        }`,
    ]
})
export class ChangeCfcaCompanyComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    params: any = {} as any;
    mainForm: FormGroup;
    businessFile: any[] = [];
    userchangeFile: any[] = [];
    certificateFile: any[] = [];
    title: string = '';
    getTime: '';
    userName: '';

    public fileUpload = [{
        name: 'certificateUpload',
        checkerId: 'certificateUpload',
        required: 1,
        value: '',
        show: true,
        options: '{"filename": "授权书","fileext": "jpg, jpeg, png,pdf","picSize": "500"}',
    },
    {
        name: 'userChangeUpload',
        checkerId: 'userChangeUpload',
        required: 1,
        value: '',
        show: true,
        options: '{"filename": "用户变更申请表","fileext": "jpg, jpeg, png,pdf", "picSize": "500"}',
    },
    {
        name: 'businessUpload',
        checkerId: 'businessUpload',
        required: 1,
        value: '',
        show: true,
        options: '{"filename": "营业执照","fileext": "jpg, jpeg, png,pdf", "picSize": "500"}',
    }
    ];
    constructor(private xn: XnService, private vcr: ViewContainerRef,) {
    }

    ngOnInit() {
        this.buildChecker(this.fileUpload);
        this.mainForm = XnFormUtils.buildFormGroup(this.fileUpload);
        this.mainForm.valueChanges.subscribe(x => {
            this.businessFile = !x.businessUpload ? [] : JSON.parse(x.businessUpload);
            this.userchangeFile = !x.userChangeUpload ? [] : JSON.parse(x.userChangeUpload);
            this.certificateFile = !x.certificateUpload ? [] : JSON.parse(x.certificateUpload);

        });
    }

    open(params: any): Observable<string> {

        this.params = params;
        this.title = this.params.type === 1 ?
            '更新CFCA数字证书企业名称' : '企业名称修改申请中';
        if (this.params.type === 2) {
            this.getTime = this.params.getTime;
            this.userName = this.params.userName;
            this.businessFile.push(this.params.businessLicenseFile);
            this.certificateFile.push(this.params.authFile);
            this.userchangeFile.push(this.params.changeFile);
        }
        this.modal.open(ModalSize.Large);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
    onCancel() {
        this.close('wq');
    }
    onOk() {
        this.close('wq');
    }
    onSubmit() {
        this.close(
            {
                action: 'ok',
                filelist: {
                    authFile: JSON.stringify(this.certificateFile[0]),
                    changeFile: JSON.stringify(this.userchangeFile[0]), businessLicenseFile: JSON.stringify(this.businessFile[0])
                }
            });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    /**F
   *  查看文件
   * @param item
   */
    public onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, item).subscribe(() => {
        });
    }

    /**
   *  查看合同
   * @param id
   * @param secret
   * @param label
   */
    public showContract(id: string, secret: string, label: string) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id,
            secret,
            label,
            readonly: true
        }).subscribe(() => {
        });
    }
    onValid() {
        return this.businessFile.length !== 0 && this.certificateFile.length !== 0 && this.userchangeFile.length !== 0;
    }
    deleteFile(paramItem: string) {
        if (paramItem === 'certificateFile') {
            this.mainForm.get('certificateUpload').setValue('');
        } else if (paramItem === 'businessFile') {
            this.mainForm.get('businessUpload').setValue('');
        } else if (paramItem === 'userchangeFile') {
            this.mainForm.get('userChangeUpload').setValue('');

        }
    }
    // 全部下载
    public onSave() {
        const fileList = this.userchangeFile.concat(this.businessFile, this.certificateFile);
        this.xn.api.download('/file/downFile', {
            files: fileList,
        }).subscribe((v: any) => {
            this.xn.api.save(v._body, `注销文件.zip`);
        });
    }
    public onSearch() {
        this.close({ action: 'search' });
    }
}

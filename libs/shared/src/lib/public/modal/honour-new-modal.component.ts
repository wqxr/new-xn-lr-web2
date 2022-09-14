import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnUtils} from '../../common/xn-utils';
import {XnService} from '../../services/xn.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {PdfViewService} from '../../services/pdf-view.service';

@Component({
    templateUrl: './honour-new-modal.component.html',
    styles: [`
        .pdf-container {
            width: 100%;
            min-height: 100%;
            background: #E6E6E6;
        }

        .this-img {
            width: 60%;
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .this-pdf {
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .img-container {
            width: 100%;
            min-height: 100%;
            text-align: center;
            position: relative;
            background: #E6E6E6;
        }

        .img-wrapper {
            transition: all 0.5s ease-in-out;
        }

        .page {
            float: right;
            vertical-align: middle;
        }

        .edit-content {
            height: calc(100vh - 280px);
            display: flex;
            flex-flow: column;
        }

        .edit-content-flex {
            flex: 1;
            text-align: center;
            overflow: auto;
            background: #E6E6E6;
        }

        .button-group {
            float: right;
            padding: 20px 15px 0 15px;
        }

    `],
    providers: [
        PdfViewService
    ]
})
export class HonourNewModalComponent {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('innerImg') innerImg: ElementRef;
    @ViewChild('outerImg') outerImg: ElementRef;
    @ViewChild('imgContainer') imgContainer: ElementRef;

    private observer: any;
    mainForm: FormGroup;
    rows: any[] = [];
    fileImg: any; // 商票图像
    degree = 0;
    private currentScale = .6;

    constructor(private xn: XnService,
                private localStorageService: LocalStorageService,
                private pdfViewService: PdfViewService) {
    }

    open(): Observable<any> {
        this.rows = [
            {
                title: '商票号码', checkerId: 'honourNum', memo: ''
            },
            {
                title: '有商票图片', checkerId: 'hasImage', type: 'radio', value: '1'
            },
            {
                title: '商票图片', checkerId: 'honourImg', type: 'file',
                options: {
                    showWhen: ['hasImage', '1'],
                    filename: '商票图片',
                    fileext: 'jpg, jpeg, png',
                    picSize: '500'
                }
            },
            {
                title: '商票金额', checkerId: 'honourAmount', options: {showWhen: ['hasImage', '0']}
            },
            {
                title: '出票日期', checkerId: 'honourDate', options: {showWhen: ['hasImage', '0']}, validators: {date: true},

            },
            {
                title: '到期日期', checkerId: 'dueDate', options: {showWhen: ['hasImage', '0']}, type: 'end', validators: {date: true},
            },
            {
                title: '商票承兑人', checkerId: 'acceptorName', options: {showWhen: ['hasImage', '0']}
            },
            {
                title: '承兑行行号', checkerId: 'honourBankNum', options: {showWhen: ['hasImage', '0']}
            },
        ];

        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);

        this.mainForm.valueChanges.subscribe((v) => {
            // 显示商票图片
            const fileId = v.honourImg && JSON.parse(v.honourImg).fileId;
            this.fileImg = fileId ? `/api/attachment/view?key=${fileId}` : '';
        });

        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public handleSubmit() {
        const v = this.mainForm.value;
        const currentFlow = this.localStorageService.caCheMap.get('current_flow'); // 当前流程
        // 判断商票是否为核心企业所开，自己所开则不可使用(两票一合同：基础模式，回购模式) (企业类型为核心企业时)
        if (this.xn.user.orgType === 2 && (currentFlow === 'financing' || currentFlow === 'financing1')) {
            this.xn.api.post('/custom/honour/check/check_honour_exist', {
                billNumber: v.honourNum.replace(/\s+/g, ''),
                appId: this.xn.user.appId
            }).subscribe(x => {
                if (x.data.honourExist === false) {
                } else {
                    this.xn.msgBox.open(false,
                        `无法使用自己出票登记的商票${v.honourNum.replace(/\s+/g, '')}`, () => {
                            this.close(null);
                        });
                }
            });
        } else {
            this.closeEvent(v);
        }

    }

    public onCancel() {
        this.close(null);
    }


    /**
     *  文件旋转
     * @param val 旋转方向 left:左转，right:右转
     */
    public rotateImg(val) {
        if (this.innerImg && this.innerImg.nativeElement
            && this.outerImg && this.outerImg.nativeElement
            && this.imgContainer && this.imgContainer.nativeElement
        ) {
            this.degree = this.pdfViewService.rotateImg(val, this.degree,
                this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement, this.currentScale);
        }
    }


    /**
     *  文件缩放
     * @param params 放大缩小  large:放大，small:缩小
     */
    public scaleImg(params: string) {
        if (this.innerImg && this.innerImg.nativeElement
            && this.outerImg && this.outerImg.nativeElement
            && this.imgContainer && this.imgContainer.nativeElement
        ) {
            // 缩放图片
            this.currentScale = this.pdfViewService.scaleImg(params,
                this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement);
        }
    }

    private closeEvent(v) {
        if (v.hasImage === '1') {
            // 有图片
            const img = JSON.parse(v.honourImg);
            this.close({
                honourNum: v.honourNum.replace(/\s+/g, ''),
                fileId: img.fileId,
                fileName: img.fileName
            });
        } else {
            // 无图片
            this.close({
                honourNum: v.honourNum.replace(/\s+/g, ''),
                acceptorName: v.acceptorName,
                honourDate: v.honourDate,
                dueDate: v.dueDate,
                honourAmount: v.honourAmount,
                honourBankNum: v.honourBankNum
            });
        }
    }


    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }
}

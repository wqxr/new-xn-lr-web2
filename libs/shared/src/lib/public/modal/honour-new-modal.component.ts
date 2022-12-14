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
    fileImg: any; // ????????????
    degree = 0;
    private currentScale = .6;

    constructor(private xn: XnService,
                private localStorageService: LocalStorageService,
                private pdfViewService: PdfViewService) {
    }

    open(): Observable<any> {
        this.rows = [
            {
                title: '????????????', checkerId: 'honourNum', memo: ''
            },
            {
                title: '???????????????', checkerId: 'hasImage', type: 'radio', value: '1'
            },
            {
                title: '????????????', checkerId: 'honourImg', type: 'file',
                options: {
                    showWhen: ['hasImage', '1'],
                    filename: '????????????',
                    fileext: 'jpg, jpeg, png',
                    picSize: '500'
                }
            },
            {
                title: '????????????', checkerId: 'honourAmount', options: {showWhen: ['hasImage', '0']}
            },
            {
                title: '????????????', checkerId: 'honourDate', options: {showWhen: ['hasImage', '0']}, validators: {date: true},

            },
            {
                title: '????????????', checkerId: 'dueDate', options: {showWhen: ['hasImage', '0']}, type: 'end', validators: {date: true},
            },
            {
                title: '???????????????', checkerId: 'acceptorName', options: {showWhen: ['hasImage', '0']}
            },
            {
                title: '???????????????', checkerId: 'honourBankNum', options: {showWhen: ['hasImage', '0']}
            },
        ];

        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);

        this.mainForm.valueChanges.subscribe((v) => {
            // ??????????????????
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
        const currentFlow = this.localStorageService.caCheMap.get('current_flow'); // ????????????
        // ?????????????????????????????????????????????????????????????????????(?????????????????????????????????????????????) (??????????????????????????????)
        if (this.xn.user.orgType === 2 && (currentFlow === 'financing' || currentFlow === 'financing1')) {
            this.xn.api.post('/custom/honour/check/check_honour_exist', {
                billNumber: v.honourNum.replace(/\s+/g, ''),
                appId: this.xn.user.appId
            }).subscribe(x => {
                if (x.data.honourExist === false) {
                } else {
                    this.xn.msgBox.open(false,
                        `???????????????????????????????????????${v.honourNum.replace(/\s+/g, '')}`, () => {
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
     *  ????????????
     * @param val ???????????? left:?????????right:??????
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
     *  ????????????
     * @param params ????????????  large:?????????small:??????
     */
    public scaleImg(params: string) {
        if (this.innerImg && this.innerImg.nativeElement
            && this.outerImg && this.outerImg.nativeElement
            && this.imgContainer && this.imgContainer.nativeElement
        ) {
            // ????????????
            this.currentScale = this.pdfViewService.scaleImg(params,
                this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement);
        }
    }

    private closeEvent(v) {
        if (v.hasImage === '1') {
            // ?????????
            const img = JSON.parse(v.honourImg);
            this.close({
                honourNum: v.honourNum.replace(/\s+/g, ''),
                fileId: img.fileId,
                fileName: img.fileName
            });
        } else {
            // ?????????
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

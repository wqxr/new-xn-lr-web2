import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

@Component({
    templateUrl: './build-xml-modal.component.html',
    styles: []
})
export class BuildXmlModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;

    private observer: any;
    rows: any[] = [];
    mainForm: FormGroup;
    private mainFlowId: string;
    private isAvenger = false;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(paramInfo: {mainFlowId: string, isAvenger: boolean}): Observable<any> {
        this.mainFlowId = paramInfo.mainFlowId;
        this.isAvenger  = paramInfo.isAvenger;

        this.rows = [
            {
                title: '转让人企业规模', checkerId: 'transferScale', type: 'select', options: {ref: 'orgScale'}
            },
            {
                title: '转让人企业英文名字', checkerId: 'transferNameEn'
            },
            {
                title: '债务人企业规模', checkerId: 'obligorScale', type: 'select', options: {ref: 'orgScale'}
            },
            {
                title: '债务人企业英文名字', checkerId: 'obligorNameEn'
            }
        ];

        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);

        this.modal.open(ModalSize.Large);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private close(value: any) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onCancel() {
        this.close({
            action: 'cancel'
        });
    }

    onSubmit() {
        const value = this.mainForm.value;
        if (this.isAvenger) {
            this.xn.avenger.download('/file/build_xml', {
                mainFlowId: this.mainFlowId,
                transferScale: parseInt(value.transferScale, 0),
                transferNameEn: value.transferNameEn,
                obligorScale: parseInt(value.obligorScale, 0),
                obligorNameEn: value.obligorNameEn,
            }).subscribe((v: any) => {
                this.xn.api.save(v._body, `${this.mainFlowId}.xml`);
                this.close({
                    action: 'ok'
                });
            });

        } else {
            this.xn.api.download('/build_xml', {
                mainFlowId: this.mainFlowId,
                transferScale: parseInt(value.transferScale, 0),
                transferNameEn: value.transferNameEn,
                obligorScale: parseInt(value.obligorScale, 0),
                obligorNameEn: value.obligorNameEn,
            }).subscribe((v: any) => {
                this.xn.api.save(v._body, `${this.mainFlowId}.xml`);
                this.close({
                    action: 'ok'
                });
            });
        }
    }
}

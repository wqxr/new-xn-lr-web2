import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

@Component({
    templateUrl: './map-add-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
    ]
})
export class MapAddModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    mainForm: FormGroup;
    formValid = false;
    newUserRoleList: any[] = [];
    roleArr: any[] = [];
    roleArrTemp: any[] = [];
    memoTemp = '';
    asset = true;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        this.params = params;

        // 处理数据
        this.shows = [];

        this.shows.push({
            name: 'contract',
            required: false,
            type: 'contract',
            title: '合同详情',
            options: {
                mode: 'edit',
                map: true,
                mainFlowId: this.params.mainFlowId
            },
            value: this.params.contractInfo
        });

        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        this.mainForm.valueChanges.subscribe((v) => {
            this.formValid = this.mainForm.valid;
        });

        this.formValid = this.mainForm.valid;

        this.modal.open(ModalSize.XLarge);


        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    cssClass(step): string {
        if (step === this.steped) { return 'current'; }
        if (step > this.steped) { return 'disabled'; }
        else { return 'success'; }
    }

    onOk() {

    }

    onSubmit() {
        this.addMap();

    }

    onValid() {
        // return false;
        if (this.mainForm && this.mainForm.value && this.mainForm.value.contract) {
            const contracts = JSON.parse(this.mainForm.value.contract);
            for (const contract of contracts) {
                if (!contract.appName) { return true; }
            }
            return false;
        }
    }

    addMap() {
        // console.log("this.mainForm.value.contract: ", this.mainForm.value.contract);
        if (!this.mainForm.value.contract) {
            return;
        }

        this.xn.api.post('/data/map/input', {
            data: JSON.parse(this.mainForm.value.contract)
        }).subscribe(json => {
            this.close(this.params);
        });
    }

}

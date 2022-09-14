import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

@Component({
    templateUrl: './white-list-add-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
    ]
})
export class WhiteListAddModalComponent implements OnInit {

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

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        // 处理数据
        this.shows = [];

        this.shows.push({
            name: 'orgName',
            required: true,
            type: 'text',
            title: '企业名称'
        });

        this.shows.push({
            name: 'orgType',
            required: true,
            type: 'radio',
            title: '企业类型',
            value: '2',
            selectOptions: [
                {label: '核心企业', value: '2'},
                {label: '保理商', value: '3'},
            ]
        });

        this.shows.push({
            name: 'parentOrgName',
            required: true,
            type: 'text',
            title: '父企业名称'
        });


        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        // console.log("shows: ", this.shows)
        // console.log("formValue: ", this.mainForm.value);

        this.mainForm.valueChanges.subscribe((v) => {
            this.formValid = this.mainForm.valid;
        });

        this.formValid = this.mainForm.valid;

        this.steped = parseInt(this.params.status);
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
        this.xn.api.post('/white_list/add', this.mainForm.value).subscribe(json => {
            this.params.orgName = this.mainForm.value.orgName;
            this.params.orgType = this.mainForm.value.orgType;
            this.params.parentOrgName = this.mainForm.value.parentOrgName;

            this.close(this.params);
        });
    }
}

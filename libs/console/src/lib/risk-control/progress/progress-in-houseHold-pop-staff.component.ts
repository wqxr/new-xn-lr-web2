import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    templateUrl: './progress-in-houseHold-pop-staff.component.html',
    styles: [
            `.panel {
            margin-bottom: 0
        }`,
    ]
})
export class HouseHoldStaffModel implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    shows: any[] = [];
    mainForm: FormGroup;

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {

        // 处理数据
        this.shows = params;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        this.modal.open(ModalSize.XLarge);

        this.mainForm.valueChanges.subscribe((v) => {
            // console.log(v)
        });

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    onSubmit() {
        // console.log(this.mainForm.value);
        this.close(this.mainForm.value);
    }

    modelClose() {
        this.close(null);
    }
}

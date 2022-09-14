import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/ng2-bs3-modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

/**
 *  添加/修改资产池名称
 */
@Component({
    templateUrl: './capital-pool-name-modal.component.html'
})
export class CapitalPoolNameModalComponent implements OnInit {
    // 传入的数据
    public params: any;
    public shows: any;
    public form: FormGroup;
    public modalType: string;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public formModule = 'new-agile-input';

    public constructor(private xn: XnService) {}

    open(params: any): Observable<string> {
        this.params = params;
        // 构造row
        this.shows = this.params.checkers;
        this.modalType = this.params.id ? '重命名' : '添加';
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public ngOnInit() {}

    public onSubmit() {
        console.log(this.form.value);
        this.close(this.form.value);
    }

    public onCancel() {
        this.close('');
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
}

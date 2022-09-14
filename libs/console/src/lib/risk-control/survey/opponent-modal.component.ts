import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {OpponentInputModel} from '../model/opponent';
import {OpponentEnum} from '../enum/risk-control-enum';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {FormGroup} from '@angular/forms';

/**
 *  交易对手 增删该查
 */
@Component({
    selector: 'app-opponent-modal',
    templateUrl: './opponent-modal.component.html',
    styles: [`
        .required-star::after {
            content: '*';
            color: #ff5500;
        }

        .content-box {
            max-height: calc(100vh - 260px);
        }
    `]
})
export class OpponentModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    observer: any;
    pageTitle = '';
    table: any; // 默认值
    opponentEnum = OpponentEnum;
    rows: any[] = [];
    mainForm: FormGroup;

    constructor() {
    }

    ngOnInit() {
    }

    open(params: any): Observable<any> {
        this.pageTitle = this.opponentEnum[params.type]; // 表头
        this.table = params.table; // 显示的表格['upStream','downStream','link']

        this.rows = params.checkers; // 显示的checkers 项
        this.rows.forEach(x => {
            x.value = params.value[x.checkerId]; // 赋值
        });

        XnFormUtils.buildSelectOptions(this.rows);
        this.buildChecker(this.rows);
        this.mainForm = XnFormUtils.buildFormGroup(this.rows);

        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    // 返回信息
    onSubmit() {
        this.close({action: 'ok', value: this.mainForm.value});
    }

    onCancel() {
        this.close(null);
    }

    close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}

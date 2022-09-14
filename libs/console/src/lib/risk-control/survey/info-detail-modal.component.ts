import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {InfoDetailOutputModel} from '../model/bank-credit';
import {LegalEnum} from '../enum/risk-control-enum';

/**
 *  法人机构信息详情
 */
@Component({
    selector: 'app-info-detail-modal',
    templateUrl: './info-detail-modal.component.html',
    styles: [`
        .text-content {
            max-height: calc(100vh - 250px);
            overflow-y: auto;
            padding: 0 10px;
        }

        .label-text {
            background-color: #F2F9FC;
        }

        .table tr td {
            vertical-align: middle;
        }

        .table tr td.label-text {
            width: 150px;
        }
        .text-prosecutor:after{
            content: '、';
            display: inline;
        }

    `]
})
export class InfoDetailModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    observer: any;
    pageTitle = '';
    params: InfoDetailOutputModel = new InfoDetailOutputModel();
    legalEnum = LegalEnum;
    label = '';

    constructor() {
    }

    ngOnInit() {
    }

    open(params: any): Observable<any> {
        this.params[params.label] = params.value;
        this.label = params.label; // 显示的表单['referee','courtNotice','opening']
        this.pageTitle = `${this.legalEnum[params.label]}详情`; // 详情表头
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    onCancel() {
        this.close(null);
    }

    close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}

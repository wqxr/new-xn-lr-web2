import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'dragon-audit-standard-modal',
    templateUrl: './white-status-modal.component.html',
    styles: [`
        .edit-content {
            display: flex;
            flex-flow: column;
        }

        .edit-content-flex {
            flex: 1;
            text-align: center;
            overflow-y: scroll;
            background: #E6E6E6;
        }

        .table > tbody > tr > td{
            border:0px;
        }

        .button-group {
            float: right;
            padding: 0 15px;
        }
    `]
})
export class BankWhiteStatusComponent {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public mainForm: FormGroup;
    public shows: any[];
    public params = {
        orgName: '',
        appId: '',
    };
    paging = 0; // 共享该变量

    datalist02: any[] = [];
    // 页码配置
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    public constructor(public xn: XnService,
                       public vcr: ViewContainerRef) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.value;
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
            this.onPage({ page: this.paging });

        });
    }
    public onPage(e?) {
        this.paging = e.page || 1;
        const params = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
            appId: this.params.appId
        };
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        this.xn.avenger.post('/sub_system/pht_white/white_history', params
        ).subscribe(data => {
            this.pageConfig.total = data.data.count;
            this.datalist02 = data.data.changeList.map(temp => {
                let objResult = {} as any;
                switch (temp.whiteStatus) {
                    case 1: objResult = { whiteStatus: '白名单', date: temp.dt }; break;
                    case 0: objResult = { whiteStatus: '非白名单', date: temp.dt }; break;
                }
                return objResult;
            });
        });
    }

    public onOk() {
        this.close({
            action: 'cancel'
        });
    }



    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}

import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'dragon-audit-standard-modal',
    template: `
    <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
    <modal-body>
      <div class="display-content" [style.background-image]="imgSrc"  style="width:100%;height:421px;background-size: cover;background-repeat:no-repeat;">
       </div>
    </modal-body>
    <modal-footer>
      <div class="button-group">
        <button  *ngIf='params.status===0' type="button" class="btn btn-success" (click)="getSupplier()">申请</button>
        <button type="button" class="btn btn-danger" (click)="onCancel()">关闭</button>
        <button type="button" class="btn btn-danger" (click)="noRemind()">不再提示</button>
      </div>
    </modal-footer>
  </modal>
`,
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
export class RecommendationLetterComponent {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public mainForm: FormGroup;
    public shows: any[];
    public params = {
        id: 0,
        isRead: 0,
        status: 0,
        url: '',
    };
    public imgSrc: SafeStyle;


    public constructor(public xn: XnService, private publicCommunicateService: PublicCommunicateService,
                       public vcr: ViewContainerRef, private sanitizer: DomSanitizer) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.value;
        this.imgSrc = this.sanitizer.bypassSecurityTrustStyle('url(\'apps/src/' + this.params.url + ' \')');
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    getSupplier() {
        this.xn.router.navigate([`/console/bank-puhuitong/record/new`],
            {
                queryParams: {
                    id: 'sub_bank_push_supplier_sign',
                }
            });
    }
    public onCancel() {
        this.publicCommunicateService.change.emit('recommendationModalClose');
        this.close({
            action: 'cancel'
        });
    }
    public noRemind() {
        this.xn.avenger.post('/bankpush/list/set_remind', { id: this.params.id }).subscribe(x => {
            if (x.ret === 0) {
                this.close({
                    cancel: 'cancel'
                });
            } else {
                this.xn.msgBox.open(false, x.msg);
            }
        });

    }


    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}

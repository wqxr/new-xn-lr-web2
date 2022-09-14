import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnService } from '../../services/xn.service';

/**
 *  发票查询功能的修改备注信息 弹窗
 */
@Component({
    template: `
    <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
    <modal-header [showClose]="false">
        <h4 class="modal-title">修改备注信息</h4>
    </modal-header>

    <modal-body>
        <form class="form-horizontal" (ngSubmit)="onSubmit()" #myForm="ngForm">
            <div class="panel panel-default">
                <div class="panel-body">
                    <div class="form-group">
                        <div class="col-sm-3 xn-control-label">备注信息</div>
                        <div class="col-sm-8">
                            <textarea class="input form-control" required name="desc"
                                      [(ngModel)]="desc" autocomplete="off" placeholder="（最多可录入4000字）"  rows="5"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </modal-body>

    <modal-footer>
        <button type="button" class="btn btn-white" (click)="onCancel();$event.stopPropagation();">取消</button>
        <button type="button" class="btn btn-success" [disabled]="!myForm.valid" (click)="onSubmit();$event.stopPropagation();">确定</button>
    </modal-footer>
    </modal>
    `,
    styles: [
        `
        @media (min-width: 768px) {
            .modal-wrap .modal-dialog {
                width: 1200px;
            }
        }
    `]
})
export class DescEditModalComponent implements OnInit {
    // 传入的数据
    public params: any;
    public shows: any;
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('myForm') form: FormGroup;
    private observer: any;
    public desc = '';

    public constructor(private xn: XnService) {
    }

    open(params: any): Observable<string> {
        this.desc = params.desc;
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public ngOnInit() {
    }

    public onSubmit() {
        this.close(this.desc);
    }

    public onCancel() {
        this.close('');
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}

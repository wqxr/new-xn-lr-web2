import {Component} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'app-record-register-code-info',
    template: `
        <section class="content">
            <form class="form-horizontal" (ngSubmit)="onSubmit()" [formGroup]="mainForm">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <span class="panel-title">{{pageTitle}}</span>
                    </div>
                    <div class="panel-body">
                        <div *ngFor="let row of baseInfo">
                            <div class="col-sm-3 xn-control-label">
                                {{row.title}} <span *ngIf="row.required !== false && row.required !== 0" class="required-label">*</span>
                            </div>
                            <div class="col-sm-6">
                                <xn-input [row]="row" [form]="mainForm"></xn-input>
                            </div>
                        </div>
                    </div>
                    <div class="panel-footer text-right">
                        <button type="button" class="btn btn-default pull-left" (click)="goBack()">返回</button>
                        <button type="submit" class="btn btn-primary " [disabled]="!mainForm.valid">提交</button>
                    </div>
                </div>

            </form>
        </section>
    `,
    styles: [``]
})
export class RegisterCodeInfoComponent {
    public mainForm: FormGroup;
    public pageTitle = '登记编码信息';
    public baseInfo: any;

    public constructor(private xn: XnService) {
    }

    public goBack() {
        this.xn.user.navigateBack();
    }

    public onSubmit() {
        //
    }
}

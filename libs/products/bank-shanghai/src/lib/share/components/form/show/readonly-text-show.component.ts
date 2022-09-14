/*
 * @Description: 
 * @Version: 1.0
 * @Author: yutianbao
 * @Date: 2020-11-13 09:13:12
 * @LastEditors: yutianbao
 * @LastEditTime: 2021-10-11 09:41:36
 * @FilePath: \xn-lr-web2\libs\products\bank-shanghai\src\lib\share\components\form\show\readonly-text-show.component.ts
 * @copyright: Copyright(C) 2017-2020, 深圳市链融科技股份有限公司
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'lib-readonly-text-show',
    template: `
    <div style="width: 100%">
        <ng-container [ngSwitch]="row.checkerId">
            <ng-container *ngSwitchCase="'drawalAmount'">
                <div [ngClass]="{'input-group': row.options?.unit}">
                    <span class="form-control xn-input-font xn-input-border-radius readonly-style text-break">
                        {{val | number: '1.2-2' | xnMoney}}
                    </span>
                    <span class="input-group-addon readonlystyle" *ngIf="row.options?.unit" [attr.id]="row.checkerId">{{row.options?.unit}}</span>
                </div>
            </ng-container>
            <ng-container *ngSwitchCase="'eAccountStatus'">
                <span class="form-control xn-input-font xn-input-border-radius readonly-style text-break"
                    [ngStyle]="{color: ['0', '2', 0, 2].includes(val) ? '#ff5500' : '#555'}">
                    {{val | xnSelectTransform: 'eAccountStatus' }}
                </span>
            </ng-container>
            <!--默认-->
            <ng-container *ngSwitchDefault>
                <span class="form-control xn-input-font xn-input-border-radius text-break">
                    {{val}}
                </span>
            </ng-container>
        </ng-container>
    </div>
    `,
    styles: [`
    .readonlys-tyle {
        background: #eee;
        pointer-events: none;
        cursor: not-allowed;
    }
    .text-red {
        color: #ff5500;
    }
    .text-break {
    overflow-y: auto;
    }
    `]
})
@DynamicForm({ type: 'readonly-text', formModule: 'dragon-show' })
export class ReadonlyTextShowComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    val = '';
    constructor(private er: ElementRef, private cdr: ChangeDetectorRef, private xn: XnService) {
    }

    ngOnInit() {
        this.val = this.row.data || '';
    }
}

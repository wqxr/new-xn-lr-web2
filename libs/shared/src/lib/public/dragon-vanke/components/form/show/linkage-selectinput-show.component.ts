import {Component, OnInit, ElementRef, Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnUtils } from '../../../../../common/xn-utils';

/**
 *  多级联动选择: 一次转让合同合同组组件
 */
@Component({
    selector: 'xn-linkage-selectinput-show',
    template: `
    <div class="row">
        <div class="col-md-6 xn-dselect-first">
            <select class="form-control xn-input-font" [(ngModel)]="selectValue" [disabled]="true">
                <option value="">请选择</option>
                <option *ngFor="let option of row.selectOptions" value="{{option.value}}">{{option.label}}</option>
            </select>
        </div>
        <ng-container *ngIf="isSecondShow">
            <div class="col-md-6 xn-dselect-second">
                <div class="form-control xn-input-font xn-input-border-radius">
                    <div class="label-line">
                        {{inputValue}}
                    </div>
                </div>
            </div>
        </ng-container>
    </div>
    `,
    styles: [`
    .xn-dselect-first {
        padding-right: 2px;
    }
    .xn-dselect-second {
        padding-left: 2px;
    }
    `]
})
@DynamicForm({ type: 'link-selectInput', formModule: 'dragon-show' })
export class LinkageSelectShowOnceComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    alert = '';
    myClass = '';
    isSecondShow = false;

    selectValue = '';
    inputValue = '';
    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        // 设置初始值
        if (!!this.row.data) {
            const value = XnUtils.parseObject(this.row.data, []);
            if (this.judgeDataType(value) && value.length > 0){
                this.selectValue = value[0] === '通用' ? value[0] : '非通用';
                this.inputValue = value[0] !== '通用' ? value[0] : '';
                this.isSecondShow = this.selectValue === '非通用' ? true : false;
            }
        }
    }

    /**
     *  判断数据类型
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }
}

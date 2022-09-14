import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

/**
 *  公用按钮组件
 */
@Component({
    selector: 'app-edit-button-component',
    template: `
        <div class="text-right">
            <button type="button" class="btn btn-success" [disabled]="validAddButton()" (click)="handleClick('add')">添加</button>
            <button type="button" class="btn btn-primary" [disabled]="validBtn()" (click)="handleClick('edit')">编辑</button>
            <button type="button" class="btn btn-danger" [disabled]="validBtn()" (click)="handleClick('delete')">删除</button>
        </div>
    `,
    styles: [`
    `]
})
export class EditButtonComponent implements OnInit, OnChanges {
    @Input() items: any;
    @Output() change: EventEmitter<any> = new EventEmitter(true);

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
    }

    // 增删该查
    handleClick(type: string) {
        this.change.emit(type);
    }

    // 按钮状态
    validBtn(): boolean {
        if (this.items.value && this.items.value.length) {
            const find = this.items.value.find((x: any) => x.selected === true);
            return !find;
        }
        return true;
    }

    validAddButton(): boolean {
        if (this.items.value && this.items.value.length) {
            if (!(this.items.label === 'upStream' || this.items.label === 'downStream')) {
                return false;
            } else {
                return this.items.value.length > 4;
            }
        }
    }
}

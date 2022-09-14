import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'collapse-condition-form',
    templateUrl: './collapse-condition.component.html',
    styles: [
        `
            .title {
                width: 100px;
            }
            .label {
                font-weight: normal;
                flex: 1;
            }
            .flex {
                display: flex;
            }
            .center-block {
                clear: both;
                border-bottom: 1px solid #ccc;
                width: 43.9%;
                height: 1px;
            }
            .showClass {
                width: 12.5%;
                margin: 0 auto;
                border: 1px solid #ccc;
                text-align: center;
                border-top: 0px;
                clear: both;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
            }
            .col-sm-6 .xn-control-label {
                width: 210px;
            }
            .colon::after {
                content: ':'
            }
        `,
    ],
})
export class CollapseConditionFormComponent {
    // 搜索项
    @Input() shows: any[] = [];
    @Input() formModule = 'default-input';
    @Input() form: FormGroup;
    @Input() colNum = 4;
    @Input() defaultRows = 2;
    @Input() showColon = false;
    displayShow = true;

    get col() {
        return `col-sm-${this.colNum}`;
    }

    get defaultRowNum() {
        // 默认显示 2行
        const gridCols = 12;
        return (this.defaultRows * gridCols) / this.colNum;
    }

    show() {
        this.displayShow = !this.displayShow;
    }
}

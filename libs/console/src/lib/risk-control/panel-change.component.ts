import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 *  table切换页
 */
@Component({
    selector: 'app-panel-change-component',
    template: `
        <ul class="nav navs">
            <li *ngFor="let item of SelectItem" class="item" role="presentation"
                [class.active]="item.value === type"
                (click)="onItemClick(item.value)">{{item.label}}
            </li>
        </ul>
    `,
    styles: [`
        .navs {
            display: flex;
            width: 900px;
            height: 50px;
            line-height: 50px;
            text-align: center;
        }

        .item {
            flex: 1
        }

        .item:hover {
            background: #fff
        }

        .nav li {
            cursor: pointer;
            text-align: center;
            background: inherit;
            background-color: #f6f6f6;
            box-sizing: border-box;
            border-radius: 5px;
            border-bottom-right-radius: 0px;
            border-bottom-left-radius: 0px;
            border: 1px solid #ddd;
        }

        .nav li.active {
            background-color: #fff;
            border-bottom: 0;
        }
    `]
})
export class PanelChangeComponent {
    @Input() SelectItem: any;
    @Input() type: any;
    @Output() change: EventEmitter<any> = new EventEmitter<any>(false);

    constructor() {
    }

    onItemClick(item) {
        this.change.emit(item);
    }
}

import { Component, OnInit, OnChanges, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FormGroup } from '@angular/forms';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

declare var $: any;

@Component({
    selector: 'app-select-box',
    templateUrl: './select-box.component.html',
    styles: [
        `.btn-box { width: 35px; float: left; }
        .custom-btn { width: 35px; height: 35px; font-size: 21px; padding: 0; margin-bottom: 10px;}
        .select-chart { margin: 0 15px; }`
    ]
})
export class SelectBoxComponent implements OnInit, OnChanges {

    @Input() fields: any;
    @Output() choose: EventEmitter<any> = new EventEmitter(false);

    rows: any[] = [];
    mainForm: FormGroup;
    shows = [];
    leftFields = [];
    rightFields = [];
    title: any;
    arrows = [
        { direc: 'right', class: 'fa fa-angle-right' },
        { direc: 'allRight', class: 'fa fa-angle-double-right' },
        { direc: 'allLeft', class: 'fa fa-angle-double-left' },
        { direc: 'left', class: 'fa fa-angle-left' },
    ];

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.leftFields = XnUtils.sortData(this.deepCopy(this.fields), 'downTimes');
        this.rightFields = [];
        this.title = {
            left: '未选字段',
            right: '已选字段'
        };
    }

    change(arrow) {
        switch (arrow) {
            case 'left': this.left(); break;
            case 'right': this.right(); break;
            case 'allLeft': this.allLeft(); break;
            case 'allRight': this.allRight(); break;
        }
    }

    left() {
        this.turnData('rightFields', 'leftFields');
    }

    right() {
        this.turnData('leftFields', 'rightFields');
    }

    turnData(field, unField) {
        const choosed = this[field].filter(v => v.activated === true);
        this[field] = this[field].filter(v => v.activated !== true);

        choosed.map(v => {
            delete v.activated;
            return v;
        });

        choosed.push(...this[unField]);

        if (choosed.length === 0) {
            return;
        }
        this[unField] = XnUtils.arrUnique(XnUtils.sortData(choosed, 'downTimes'), 'id');

        this.choose.emit(this.rightFields);
    }

    turnAllData(field, unfield) {
        this[field] = this.deepCopy(this.fields);
        this[unfield] = [];
        this.choose.emit(this.rightFields);
    }

    allLeft() {
        this.turnAllData('leftFields', 'rightFields');
    }

    allRight() {
        this.turnAllData('rightFields', 'leftFields');
    }

    // deepCopy
    deepCopy(arr) {
        return $.extend(true, [], arr);
    }

}

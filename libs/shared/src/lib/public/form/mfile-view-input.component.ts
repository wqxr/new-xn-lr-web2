import {Component, OnInit, Input, ElementRef, ViewContainerRef} from '@angular/core';
import {XnService} from '../../services/xn.service';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {isNullOrUndefined} from 'util';
import {XnInputOptions} from './xn-input.options';
import {XnUtils} from '../../common/xn-utils';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {FileViewModalComponent} from '../modal/file-view-modal.component';


declare let $: any;

@Component({
    selector: 'app-xn-mfile-view-input',
    templateUrl: './mfile-view-input.component.html',
    styles: [
            `.file-row-table {
            margin-bottom: 0
        }

        .file-row-table td {
            padding: 6px;
        }

        .file-row-table button:focus {
            outline: none
        }

        .btn-position {
            position: absolute;
            right: -100px;
            top: 5px
        }`, // 去掉点击后产生的边框

    ]
})
export class MfileViewInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    label;
    files: any[];

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    constructor(private xn: XnService, private er: ElementRef, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);

        // 设置初始值
        this.files = XnUtils.parseObject(this.ctrl.value, []);

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, item).subscribe(() => {
        });
    }
}

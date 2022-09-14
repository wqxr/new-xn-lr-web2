import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ShowViewModalComponent } from 'libs/shared/src/lib/public/modal/show-view-modal.component';


@Component({
    template: `
    <div class="form-control xn-input-font xn-input-border-radius">
      <div *ngFor="let item of items" class="label-line">
        <a class="xn-click-a" (click)="onView(item)">{{item.label}}</a>
      </div>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'file', formModule: 'avenger-show' })
export class AvengerFileComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    public items: any[] = [];

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            const json = JSON.parse(data);
            this.items = [];
            this.items.push({
                url: this.xn.file.view({ ...json, isAvenger: true }),
                label: json.fileName
            });
        }
    }

    /**
     *  查看文件
     * @param paramFile
     */
    public onView(paramFile: any): void {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShowViewModalComponent, paramFile).subscribe();
    }
}

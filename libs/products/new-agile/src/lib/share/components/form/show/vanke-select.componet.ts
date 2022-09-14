import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';


@Component({
    template: `
    <div>
      <span class="form-control xn-input-font xn-input-border-radius" style="display: inline-table">
        {{businessType}}
      </span>
    </div>
    <div style='margin-top:10px' *ngIf="vankeType!==''">
      <div class="col-sm-2 xn-control-label required-star" style="padding-left: 0px;text-align: left;width: 15%;">
        万科类型
      </div>
      <div class='col-sm-10' style='padding: 0px;width: 85%;'>
        <span class="form-control xn-input-font xn-input-border-radius"
          style="display: inline-table;">{{vankeType}}
        </span>
      </div>
    </div>
    `
})
@DynamicForm({ type: 'vanke-select', formModule: 'new-agile-show' })
export class XnVankeSelectShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    businessType = '';
    vankeType = '';

    constructor(
        private localStorageService: LocalStorageService,
        ) {
    }

    ngOnInit(): void {
        if (this.row.data.includes('}')) {
            this.businessType = SelectOptions.getLabel(this.row.selectOptions, JSON.parse(this.row.data).enterprise);
            const secondSelect = SelectOptions.get('enterprise_dc').filter((x: any) => x.value === JSON.parse(this.row.data).enterprise);
            this.vankeType = secondSelect[0].children.filter(x => String(x.value) === String(JSON.parse(this.row.data).wkType))[0].label;
            this.localStorageService.setCacheValue('enterprise', '万科');

        } else {
            this.businessType = SelectOptions.getLabel(this.row.selectOptions, this.row.data);
            this.localStorageService.setCacheValue('enterprise', this.row.data);

        }
    }
}

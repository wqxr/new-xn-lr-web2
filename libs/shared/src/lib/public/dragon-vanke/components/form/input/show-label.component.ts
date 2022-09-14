import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
  selector: 'xn-show-label',
  template: `
<div class='xn-control-desc'>
    <span class='infoclass' *ngIf="row.checkerId === 'caType';else block">
    {{ info | xnSelectTransform:'caType'}}

    </span>
    <ng-template #block>
    <span class='infoclass'>
      {{info}}
    </span>
    </ng-template>

    </div>


    `,
  styles: [
    `
          .infoclass{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #1F2B38;
          }
          .textclass{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4C5560;
          }
        `
  ]
})
@DynamicForm({ type: 'label', formModule: 'dragon-input' })

export class LabelInfoComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  public info = '';
  public ctrl: AbstractControl;


  public ngOnInit() {
    if (this.row.checkerId === 'caType') {
      this.row.value === 0 ? this.info = '0' : this.info = this.row.value;
    } else {
      this.info = this.row.value;
    }
    this.ctrl = this.form.get(this.row.name);
    this.ctrl.valueChanges.subscribe(x => {
      this.info = x;
    });
  }

}

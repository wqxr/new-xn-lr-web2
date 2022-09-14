import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
  selector: 'xn-show-label',
  template: `
<div class='xn-control-desc'>
    <span class='infoclass'>
    {{ info | xnSelectTransform:'caType'}}
    </span>
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
@DynamicForm({ type: 'label', formModule: 'dragon-show' })

export class LabelInfoShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  public info = '';
  public ctrl: AbstractControl;


  public ngOnInit() {
    if (this.row.flowId === 'sub_cfca_sign_pre' && this.row.checkerId === 'caType') {
      this.row.data === 0 ? this.info = '0' : this.info = this.row.data;
    } else {
      this.info = this.row.data;
    }
  }

}

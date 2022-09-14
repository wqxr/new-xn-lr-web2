import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DragonPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';

@Component({
  template: `
    <table   class="table table-bordered table-hover file-row-table" width="100%">
    <tbody>
    <tr>
      <td *ngFor='let item of datavalue; let i=index'>
        <a class="xn-click-a" (click)="showContract(item)">

          《{{item.label}}》
        </a>
      </td>
    </tr>
    </tbody>
  </table>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// 查看二维码checker项
@DynamicForm({ type: 'text-info', formModule: 'dragon-input' })
export class VanketextInfoInputComponent implements OnInit {

  @Input() row: any;
  @Input() form: FormGroup;
  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;
  datavalue: any;

  constructor(private xn: XnService,
              private er: ElementRef,
              private vcr: ViewContainerRef) {
  }

  ngOnInit() {
    if (this.row.value === '') {

    } else {
      this.datavalue = JSON.parse(this.row.value);

    }
  }

  /**
*  查看合同
* @param paramContract
*/
  public showContract(paramContract: any) {
    const params = Object.assign({}, paramContract, { readonly: true });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe();
  }
}

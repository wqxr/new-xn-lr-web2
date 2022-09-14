import { Component, Input, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from '../../../../pipe/xn-json.pipe';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FileViewModalComponent } from '../../../modal/file-view-modal.component';


@Component({
  selector: 'xn-template-list',
  template: `
  <div>
  <div style='text-align:right;margin-bottom:10px' *ngIf='showDown' >
  <button type="button" class="btn btn-success" (click)="downLoadTemp()">下载模板</button>
  </div>
 <table class="table table-bordered text-center">
 <thead>
   <tr class="table-head">
     <th>序号</th>
     <th>
       模板名称
     </th>
   </tr>
 </thead>

 <tbody>
   <ng-container *ngIf="items.length>0;">
     <tr *ngFor="let sub of items;let i=index">
       <ng-container>
         <td>
           <span>{{i+1}}</span>
         </td>
         <td>
           <a href='javascript:void(0)' (click)="fileView(sub)">
             {{sub.fileName}}
           </a>
         </td>
       </ng-container>
     </tr>
   </ng-container>
 </tbody>
</table>
  </div>



    `,
  styles: [
    `
          .btn-success {
            background-color: #337ab7;
            border-color: #337ab7;
        }
        `
  ]
})
@DynamicForm({ type: 'template-list', formModule: 'dragon-input' })
export class CfcaTemplateComponent implements OnInit {

  @Input() row: any;
  @Input() form: FormGroup;
  public items: any[] = [];
  public ctrl: AbstractControl;
  showDown = false; // 是否展示下载模板按钮
  constructor(private xn: XnService,
    private vcr: ViewContainerRef,

  ) {
  }
  public ngOnInit() {
    this.items = JSON.parse(this.row.value);
    this.showDown = this.form.get('signType').value === '1' ? true : false;
  }
  public fileView(paramFiles) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, JsonTransForm(paramFiles))
      .subscribe(() => {
      });
  }
  downLoadTemp() {
    this.xn.api.dragon.download('/file/downFile', {
      files: this.items,
    }).subscribe((v: any) => {
      this.xn.dragon.save(v._body, `合同模板附件.zip`);
    });
  }

}

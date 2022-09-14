import { Component, Input, OnInit, ViewContainerRef, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from '../../dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnUtils } from '../../../xn-utils';



@Component({
    template: `
    <div class="form-control xn-input-font xn-input-border-radius" style='height:auto;min-height:35px'>
      <div *ngFor="let item of items" class="label-line">
        <ng-container *ngIf="!!item.fileName">
          <a class="xn-click-a" (click)="onView(item)">{{item.fileName}}</a>
        </ng-container>
        <ng-container *ngIf="!!item.secret">
          <a class="xn-click-a" (click)="showContract(item)">{{item.label}}</a>
        </ng-container>
      </div>
    </div>
    `,
    // styleUrls: ['../../show-dragon-input.component.css']
})
@DynamicForm({ type: 'dragonMfile', formModule: 'default-show' })
export class DragonMultiFileComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public items: any[] = [];

    constructor(
        private xn: XnService, private er: ElementRef,
        private vcr: ViewContainerRef, private uploadPicService: UploadPicService) {
    }

    ngOnInit() {
        const data = this.row.data;
        if (this.row.name === 'tripleAgreement') {
            if (!!data){
              this.showRow();
              const json = JSON.parse(data);
              this.items = json;
            }else{
              this.hideRow();
            }
        } else if (!!data) {
          this.items = XnUtils.jsonFileToArry(data);
      }
    }

    /**
     *  查看文件
     * @param paramFile
     */
    public onView(paramFile: any): void {
    if (this.row.name === 'companyDecision'
            || this.row.name === 'businessLicense' || this.row.name === 'projectBusinessLicense') {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, paramFile).subscribe();
        } else {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile]).subscribe();
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

  private showRow(): void {
      $(this.er.nativeElement).parents('.form-group').show();
  }

  private hideRow(): void {
      $(this.er.nativeElement).parents('.form-group').hide();
  }
}

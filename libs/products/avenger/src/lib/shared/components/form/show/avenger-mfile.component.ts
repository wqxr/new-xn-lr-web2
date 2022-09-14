import { Component, Input, OnInit, ViewContainerRef, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { ShowViewModalComponent } from 'libs/shared/src/lib/public/modal/show-view-modal.component';
import { AvengerPdfSignModalComponent } from 'libs/shared/src/lib/public/avenger/modal/pdf-sign-modal.component';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';

@Component({
  template: `
    <div class="form-control xn-input-font xn-input-border-radius" style='height:auto;min-height:35px'>
      <div *ngFor="let item of items" class="label-line">
      <ng-container *ngIf="!!item.fileName">
          <td>
            <a class="xn-click-a" (click)="onView(item)">{{item?.fileName}}</a>
          </td>
        </ng-container>
        <ng-container *ngIf="!!item.url">
          <a class="xn-click-a" (click)="onView(item)">{{item.label}}</a>
        </ng-container>
        <ng-container *ngIf="!!item.secret">
          <a class="xn-click-a" (click)="showContract(item)">{{item.label}}</a>
        </ng-container>
      </div>
    </div>
    `,
  //  styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'mfile', formModule: 'avenger-show' })
export class AvengerMultiFileComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig?: any;

  public items: any[] = [];

  constructor(
    private xn: XnService, private er: ElementRef,
    private vcr: ViewContainerRef) {
  }

  ngOnInit() {
    const data = this.row.data;
    const flowId = this.svrConfig.record.flowId;
    if (!!data) {
      const json = JSON.parse(data);

      if (!!this.svrConfig.record.mainFlowId
        && (this.svrConfig.record.mainFlowId.endsWith('wk') ||
          this.svrConfig.record.mainFlowId.endsWith('lg') ||
          this.svrConfig.record.mainFlowId.endsWith('oct') ||
          this.svrConfig.record.mainFlowId.endsWith('bgy') ||
          this.svrConfig.record.mainFlowId.endsWith('sh') ||
          this.svrConfig.record.mainFlowId.endsWith('jd') ||
          this.svrConfig.record.mainFlowId.endsWith('yjl') ||
          this.svrConfig.record.mainFlowId.endsWith('hz'))) {
        if (this.row.name === 'tripleAgreement') {
          this.showRow();
          this.items = json;
        } else {
          this.items = json;
        }
      } else if (
        this.isInFlow(flowId)
        && this.svrConfig.procedure.procedureId === 'review'
      ) {
        const mainFlowId = this.svrConfig.actions[0].checkers.filter((x: any) => x.checkerId === 'mainFlowId')[0].data;
        if (mainFlowId.endsWith('wk') ||
          mainFlowId.endsWith('lg') ||
          mainFlowId.endsWith('oct') ||
          mainFlowId.endsWith('bgy') ||
          mainFlowId.endsWith('sh') ||
          mainFlowId.endsWith('jd') ||
          mainFlowId.endsWith('yjl') ||
          mainFlowId.endsWith('hz')) {
          this.items = json;
        } else {
          this.items = [];
          for (const item of json) {
            if (item.secret) {
              this.items.push(item);
            } else {
              this.items.push({
                url: this.xn.file.view({ ...item, isAvenger: true }),
                label: item.fileName
              });
            }
          }
        }
      } else {
        this.items = [];
        for (const item of json) {
          if (item.secret) {
            this.items.push(item);
          } else {
            this.items.push({
              url: this.xn.file.view({ ...item, isAvenger: true }),
              label: item.fileName
            });
          }
        }
      }
    } else if (this.row.name === 'tripleAgreement') {
      this.hideRow();
    }
  }
  private isInFlow(flowId): boolean {
    /**
     * sub_factoring_change_jd_520
     * sub_financing_sign_jd_520
     * sub_customer_verify_jd_520
     * sub_financing_verify_jd_520
     */
    return (
      flowId === 'sub_factoring_change_520' ||
      flowId === 'sub_factoring_change_jd_520' ||
      flowId === 'sub_financing_sign_jd_520' ||
      flowId === 'sub_customer_verify_jd_520' ||
      flowId === 'sub_financing_verify_jd_520'
    )

  }
  /**
   *  查看文件
   * @param paramFile paramFile
   */
  public onView(paramFile: any): void {
    const flowId = this.svrConfig.record.flowId;
    if (this.row.name === 'ipoFile') {
      const params = { ...JSON.parse(this.row.data)[0], isAvenger: false };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, params).subscribe(() => {
      });
    }

    if (!!this.svrConfig.record.mainFlowId &&
      (this.svrConfig.record.mainFlowId.endsWith('wk') ||
        this.svrConfig.record.mainFlowId.endsWith('lg') ||
        this.svrConfig.record.mainFlowId.endsWith('oct') ||
        this.svrConfig.record.mainFlowId.endsWith('bgy') ||
        this.svrConfig.record.mainFlowId.endsWith('sh') ||
        this.svrConfig.record.mainFlowId.endsWith('jd') ||
        this.svrConfig.record.mainFlowId.endsWith('yjl') ||
        this.svrConfig.record.mainFlowId.endsWith('hz'))) {
      XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile]).subscribe(x => {

      });
    } else if (
      this.isInFlow(flowId)
      && this.svrConfig.procedure.procedureId === 'review'
    ) {
      const mainFlowId = this.svrConfig.actions[0].checkers.filter((x: any) => x.checkerId === 'mainFlowId')[0].data;
      if (mainFlowId.endsWith('wk') ||
        mainFlowId.endsWith('lg') ||
        mainFlowId.endsWith('oct') ||
        mainFlowId.endsWith('bgy') ||
        mainFlowId.endsWith('sh') ||
        mainFlowId.endsWith('jd') ||
        mainFlowId.endsWith('yjl') ||
        mainFlowId.endsWith('hz')) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile]).subscribe(x => {

        });
      }

    } else {
      XnModalUtils.openInViewContainer(this.xn, this.vcr, ShowViewModalComponent, paramFile).subscribe();

    }

  }

  /**
   *  查看合同
   * @param paramContract paramContract
   */
  public showContract(paramContract: any) {
    const params = Object.assign({}, paramContract, { readonly: true });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerPdfSignModalComponent, params).subscribe();
  }

  private showRow(): void {
    $(this.er.nativeElement).parents('.form-group').show();
  }

  private hideRow(): void {
    $(this.er.nativeElement).parents('.form-group').hide();
  }
}

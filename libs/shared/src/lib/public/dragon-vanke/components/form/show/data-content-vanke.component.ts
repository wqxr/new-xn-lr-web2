import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import TableHeadConfig from '../../../../../config/table-head-config';
import { XnService } from '../../../../../services/xn.service';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { InvoiceDataViewModalComponent } from '../../../../modal/invoice-data-view-modal.component';

@Component({
  template: `
    <div class="height">
      <div class="head-height">
        <table
          class="table table-data-content table-bordered table-hover text-center table-display relative"
          [style.left.px]="headLeft"
        >
          <thead>
            <tr>
              <ng-container *ngFor="let item of heads">
                <td>
                  <span style="word-wrap: break-word;">{{ item.label }}</span>
                </td>
              </ng-container>
            </tr>
          </thead>
        </table>
      </div>
      <div class="table-height" (scroll)="onScroll($event)">
        <table
          class="table table-data-content table-bordered table-hover text-center table-display"
        >
          <tbody>
            <ng-container *ngFor="let item of items">
              <tr>
                <td *ngFor="let head of heads">
                  <ng-container *ngIf="head?.options">
                    <span
                      *ngIf="head.options.type === 'money'"
                      [ngClass]="head.options.style"
                      >{{ item[head.value] | number: '1.2-3' }}</span
                    >
                    <span
                      *ngIf="head.options.type === 'def'"
                      [ngClass]="head.options.style"
                      >{{ item[head.value] }}</span
                    >
                    <span
                      *ngIf="head.options.type === 'boolean'"
                      [ngStyle]="{
                        color: item[head.value] === 0 ? 'red' : 'black'
                      }"
                      >{{ item[head.value] === 1 ? '是' : '否' }}</span
                    >

                    <!--当有多张内容时-->
                    <div *ngIf="head.options.type === 'multiple'">
                      <ng-container
                        *ngIf="
                          hwModeService.arrayLength(item[head.value]);
                          else block2
                        "
                      >
                        <a
                          class="xn-click-a"
                          href="javaScript:void(0)"
                          (click)="viewMoreDetailInfo(item[head.value])"
                          [innerHtml]="
                            item[head.value] | xnStringToArray: 2:'等;'
                          "
                        >
                        </a>
                      </ng-container>
                      <ng-template #block2>
                        <div
                          [innerHtml]="
                            item[head.value] | xnStringToArray: 2:'等;'
                          "
                        ></div>
                      </ng-template>
                    </div>
                    <span *ngIf="head.options.type === 'date'">
                      {{ item[head.value] | xnDate: 'stringtodate' }}
                    </span>
                    <span
                      *ngIf="head.options.type === 'text1'"
                      [innerHTML]="
                        +item[head.value] | xnSelectTransform: head.value
                      "
                    ></span>
                  </ng-container>
                  <span *ngIf="!head.options">{{ item[head.value] }}</span>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['./show.css'],
})
@DynamicForm({ type: 'data-content1', formModule: 'dragon-show' })
export class DataContentVankeComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  items: any[] = [];

  // 左移动距离
  public headLeft = 0;

  // 表格字段对应
  heads = TableHeadConfig.getConfig('龙光提单').万科企业股份有限公司.headText;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    public hwModeService: HwModeService
  ) {}

  ngOnInit() {
    if (!!this.row.data) {
      this.items = JSON.parse(this.row.data);
    }
  }

  public onScroll($event) {
    this.headLeft = $event.srcElement.scrollLeft * -1;
  }

  /**
   *  查看更多信息
   * @param item 长字符串    122，3213，12313，
   */
  public viewMoreDetailInfo(item) {
    item = item.toString().split(',');
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      InvoiceDataViewModalComponent,
      item
    ).subscribe(() => {});
  }
}

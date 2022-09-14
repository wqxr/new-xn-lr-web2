/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file
 * @summary：根据zd-search-data.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  wangqing         中登查询        2021-01-08
 * **********************************************************************
 */
import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { EnterZdType } from 'libs/shared/src/lib/config/enum/common-enum';

@Component({
  templateUrl: `./zd-update-component.html`,
  styleUrls: ['./zd-update-component.less']
})
export class ZdUpdateComponent implements OnInit {
  public type = 1;
  public filename = '请点击右侧按钮上传文件';
  mainForm: FormGroup;
  row: any;
  alert = '';
  lastSearchDate = ' ';
  company = '';
  public showAlert = '查询中，请等待';

  constructor(private xn: XnService,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.getLastSearchDate();
    this.row = [{
      title: '特查询企业清单',
      checkerId: 'companyRecord',
      type: 'file',
      options: {
        filename: '请点击右侧按钮上传文件',
        fileext: 'txt,xls,xlsx',
        picSize: '500'
      }
    }];
    XnFormUtils.buildSelectOptions(this.row);
    this.buildChecker(this.row);
    this.mainForm = XnFormUtils.buildFormGroup(this.row);
  }
  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }
  /**
*  获取最后一次请求时间
*/
  public getLastSearchDate() {
    return this.lastSearchDate;
  }
  public updateInvoice() {
    if (this.type === 2) {
      return;
    }
    if (!this.company) {
      this.xn.msgBox.open(false, '请输入公司名称');
      return;
    }
    this.xn.api.post('/custom/zhongdeng/invoice/get_invoicemain', {
      company: this.company.trim()
    }).subscribe(json => {
      if (!json.data) {
        this.xn.msgBox.open(false, json.err);
        return;
      } else if (json.data?.errcode !== 0) {
        this.xn.msgBox.open(true, json.data.errmsg);
        return;
      } else {
        this.xn.msgBox.open(true, '查询中，请等待');
        const record_id = json.data.record_id;
        const timed = window.setInterval(() => {
          this.xn.api.post('/custom/zhongdeng/invoice/get_invoicestatus', {
            record_id
          }).subscribe(data => {
            if (data.data.status === 2 || data.data.status === 3) {
              if ($(document).find('.modal-body span').length === 0) {
                this.xn.msgBox.open(true, data.data.status_info);
              } else {
                $(document).find('.modal-body span').text(data.data.status_info);
              }
              clearInterval(timed);
            } else {
            }
          });
        }, 5000);
      }
    });
  }
  // 下载模板
  downTemplate() {
    this.xn.api.download('/custom/zhongdeng/zd/download_subject_template',
      {})
      .subscribe((con: any) => {
        this.xn.api.save(con._body, '企业批量查询模板.xlsx');
        this.xn.loading.close();
      });
  }
  /**
*
* @param value 公司名称 批量查询记录
*/
  public downList() {
    this.xn.router.navigate([`console/manage/invoice-search/record`], { queryParams: { records: EnterZdType.ZD_UPDATE } });
  }

  singleSearch(type: number) {
    this.type = type;
  }
  public onUploadExcel(e) {
    this.showAlert = '查询中，请等待';
    if (e.target.files.length === 0) {
      return;
    }
    const err = this.validateExcelExt(e.target.files[0].name);
    if (!XnUtils.isEmpty(err)) {
      this.alert = err;
      $(e.target).val('');
      return;
    }

    const fd = new FormData();
    this.filename = e.target.files[0].name;
    fd.append('checkerId', this.row.checkerId);
    fd.append('file_data', e.target.files[0], e.target.files[0].name);
    // 上传excel
    this.xn.api.upload('/custom/zhongdeng/invoice/upload_excel', fd).subscribe(json => {
      if (json.type === 'progress') {
        this.xn.msgBox.open(false, '查询中，请等待');
      } else if (json.type === 'complete' && json.data?.data?.errcode === 0) {
        this.showAlert = '查询成功';
        if ($(document).find('.modal-body span').length === 0) {
          this.xn.msgBox.open(false, this.showAlert);
        } else {
          $(document).find('.modal-body span').text(this.showAlert);
        }

      } else {
        this.showAlert = json.data.msg;
        if ($(document).find('.modal-body span').length === 0) {
          this.xn.msgBox.open(false, this.showAlert);
        } else {
          $(document).find('.modal-body span').text(this.showAlert);
        }
      }
      this.cdr.markForCheck();
    });
    $(e.target).val('');

  }

  private validateExcelExt(s: string): string {
    if (isNullOrUndefined(this.row.options)) {
      return '';
    }
    if ('fileext' in this.row.options) {
      const exts = this.row.options.fileext.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
      if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
        return '';
      } else {
        return `只支持以下文件格式: ${this.row.options.fileext}`;
      }
    } else {
      return '';
    }
  }

}

/*************************************************************************
 * Copyright (c) 2017 - 2020 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-formly\src\linkage-select\linkage-select.component.ts
 * @summary：init linkage-select.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  yutinabao        init             2020-08-20
 ***************************************************************************/
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'xn-formly-field-linkage-select',
  template: `
    <div nz-row [formControl]="formControl" ngDefaultControl>
      <ng-container *ngFor="let key of selectModelKeys;let i=index">
        <ng-container *ngIf="isShow(key, 'select')">
          <div nz-col [nzFlex]="inputColFlex">
            <nz-select [nzPlaceHolder]="to.placeholder" [(ngModel)]="selectModel[key]" (ngModelChange)="onChange($event, key)">
              <nz-option nzValue="" nzLabel="请选择"></nz-option>
              <nz-option *ngFor="let option of optionsModel[key]" [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            </nz-select>
          </div>
        </ng-container>
        <div nz-col nzFlex="1" class="separator" *ngIf="isShow(key, 'split')"> - </div>
      </ng-container>
    </div>
  `,
  styles: [`
   nz-select {
    margin-right: 8px;
  }
  .separator {
    text-align: center;
    line-height: 32px;
    color: #ccc;
  }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XnFormlyFieldLinkageSelect extends FieldType implements OnInit {
  defaultOptions = {
    templateOptions: {
      options: [],
      mode: 'fixed'  // 'fixed'固定input数量 'dynamic'动态控制input数量
    },
  };

  selectModel: {[key: string]: number | string} = {};
  keyArr = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
  optionsModel: {[key: string]: any[]} = {};

  get selectModelKeys(){
    return Object.keys(this.selectModel) || [];
  }
  get inputColFlex(){
    const inputNumber = this.selectModelKeys.filter((x: string | number) => this.optionsModel[x] && this.optionsModel[x].length).length || 0;
    return inputNumber ? Math.floor(24 / inputNumber) : 1;
  }

  constructor(private cdr: ChangeDetectorRef){
    super();
  }

  ngOnInit() {
    // 获取options层级
    const maxLevel = this.getMaxlevel(this.to.options as any[]);
    const maxLevelArr = Array.from({length: maxLevel}, (x, i) => i);
    // 初始化
    const defaultValue = this.isEmpty(this.field.defaultValue) ? {} : JSON.parse(this.field.defaultValue);
    this.optionsModel[this.keyArr[0]] = [...(this.to.options as any[])];
    maxLevelArr.map((x: any, index: number) => {
      this.selectModel[this.keyArr[index]] = !this.isEmpty(defaultValue[this.keyArr[index]]) ? defaultValue[this.keyArr[index]] : '';
    });
    maxLevelArr.map((x: any, index: number) => {
      this.initData(this.selectModel[this.keyArr[index]], this.keyArr[index]);
    });
    this.toValue(defaultValue);
    this.formControl.valueChanges.subscribe((x: any) => {
      if (this.isEmpty(x)){
        // 重置表单时处理
        this.onChange('', 'first');
      }
    });
  }

  initData(val: number | string, key: string) {
    const currentObj = this.optionsModel[key].find((x: any) => this.selectModel.hasOwnProperty(key) && x.value.toString() === val.toString());
    const keyIndex = this.keyArr.findIndex((x: any) => x === key);
    const nextOptions = currentObj && currentObj.children ? currentObj.children : [];
    if (!!this.selectModel.hasOwnProperty(this.keyArr[keyIndex + 1])){
      this.optionsModel[this.keyArr[keyIndex + 1]] = [...nextOptions];
    }
  }

  onChange(event: number | string, key: string) {
    this.selectModel[key] =  !this.isEmpty(event) ?  event : '';
    const currentObj = this.optionsModel[key].find((x: any) => this.selectModel.hasOwnProperty(key) && x.value.toString() === event.toString());
    const keyIndex = this.keyArr.findIndex((x: any) => x === key);
    const nextOptions = currentObj && currentObj.children ? currentObj.children : [];
    if (!!this.selectModel.hasOwnProperty(this.keyArr[keyIndex + 1])){
      const surplusKeyArr = Array.from({length: this.selectModelKeys.length - keyIndex - 1}, (x, i) => i);
      // 重置keyIndex后所有下拉选项和值
      surplusKeyArr.map((idx: number) => {
        this.optionsModel[this.keyArr[keyIndex + idx + 1]] = !!idx ? [] : [...nextOptions];
        this.selectModel[this.keyArr[keyIndex + idx + 1]] = '';
      });
    }
    this.toValue( this.selectModel);
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  isShow(key: string, type: string): boolean {
    if (type === 'split'){
      const keyIndex = this.keyArr.findIndex((x: any) => x === key);
      return !!this.optionsModel[this.keyArr[keyIndex + 1]] && (!!this.optionsModel[this.keyArr[keyIndex + 1]].length || this.to.mode === 'fixed');
    } else if (type === 'select'){
      return this.to.mode === 'fixed' || this.optionsModel[key] && !!this.optionsModel[key].length;
    }
  }

  toValue(val: {[key: string]: any}) {
    const keys = Object.keys(val);
    const isEmpty = keys.every((x: any) => this.isEmpty(val[x]));
    const finalVal = isEmpty ? null : val;
    this.formControl.setValue({...finalVal});
  }

  getMaxlevel(treeData: any[]) {
    let level = 0;
    let maxLevel = 0;
    const loopFunc = (data: any[], level: number = 0) => {
      data.map(item => {
        item['level'] = level;
        if (level > maxLevel) {
          maxLevel = level;
        }
        if(item.hasOwnProperty('children')){
          if (item.children.length > 0) {
            loopFunc(item.children, level + 1);
          }
        }
      });
    };
    loopFunc(treeData, 1);
    return maxLevel;
  }

  isEmpty(val: any) {
    return ['null', 'NaN', 'undefined', '', '{}', '[]'].includes(String(val));
  }

}

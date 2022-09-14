import { Injectable } from '@angular/core';
import { XnService } from './xn.service'
import { CheckersOutputModel } from '../config/checkers';

/**
 * 获取台账自定义筛选条件字段，台账引入，用于获取自定义筛选条件字段
 */
@Injectable({ providedIn: 'root' })
export class MachineCustomFieldService {

  constructor(
    private xn: XnService) { }

  /**
   * 获取自定义搜索项字段
   * @param searchNumber 请求参数
   * @param searchField 配置的搜索项
   * @returns Promise
   */
  public getCustomField(searchNumber: number, searchField: CheckersOutputModel[]) {

    this.xn.loading.open();
    return new Promise((resolve, reject) => {
      this.xn.dragon.post('/trade/get_column', { statusList: [searchNumber] }).subscribe(res => {
        this.xn.loading.close();
        const newSearches: CheckersOutputModel[] = [];
        if (res.ret === 0 && res.data && res.data.data && res.data.data.length) {
          const fieldDataList = res.data.data;
          fieldDataList.forEach((x: any) => {
            if (x.status === searchNumber) {
              if (x.column === '') {
                resolve(searchField);
              } else {
                // 后台存的搜索项字段名
                const searchArr = x.column || [];
                // 将json格式的字段转换成新的搜索项
                JSON.parse(searchArr).forEach((y: any) => {
                  searchField.forEach((z: any) => {
                    if (y === z.checkerId) {
                      newSearches.push(z);
                    }
                  });
                });
              }
            }
          });
          resolve(newSearches);
        } else {
          resolve(searchField);
        }
      }, (err) => {
        this.xn.loading.close();
        reject(err);
      }, () => {
        // complete
        this.xn.loading.close();
      });
    });
  }

}

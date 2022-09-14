import { Pipe, PipeTransform } from '@angular/core';
import RoleType from '../common/roleIdList';
@Pipe({ name: 'angencyTypeTransform' }) // 中介机构类型列表 转换为对应的中介机构名字符串
export class AgencyTypeTransform implements PipeTransform {
    transform(angencyTypeList: any[]): string {
        let angencyType = '';
        angencyTypeList.forEach(t => {
            angencyType += AgencyType[t] + '&nbsp;';
        });
        return angencyType || '';
    }
}
enum AgencyType {
    '计划管理人' = 1,  // 计划管理人
    '会计师事务所' = 2,  // 会计师事务所
    '联合销售机构' = 3,  // 联合销售机构
    '评级机构' = 4,   // 评级机构
    '律师事务所' = 5,  // 律师事务所
    '主要销售机构' = 6,  // 主要销售机构
    '资产服务机构' = 7,  // 资产服务机构
    '投资者' = 8,  // 投资者
    '托管服务机构' = 9,  // 托管服务机构
    '资金服务机构' = 10,  // 资金服务机构
    '再保理银行' = 11,  // 再保理银行
}

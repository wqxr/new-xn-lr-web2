import { Pipe, PipeTransform } from '@angular/core';
import RoleType from '../common/roleIdList';
@Pipe({ name: 'RoleTypeTransform' }) // 用户角色列表 转换为对应的用户角色名字符串
export class RoleTypeTransform implements PipeTransform {
    transform(roleIdList: any[]): string {
        let roleName = '';
        const roleType = RoleType.getConfig();
        roleIdList.forEach(t => {
            roleType.forEach(d => {
                if (t === d.value) {
                    roleName += d.label + '&nbsp;';
                }
            });
        });
        return roleName || '只读用户';
    }
}

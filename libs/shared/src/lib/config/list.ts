/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：List
 * @summary：系统角色
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          添加说明         2019-05-28
 * **********************************************************************
 */

import {Observable, of} from 'rxjs';


export class List {

    static readonly roleList = [
        {
            name: '管理员',
            roleId: 'admin'
        },
        {
            name: '业务经办人',
            roleId: 'operator'
        },
        {
            name: '业务复核人',
            roleId: 'reviewer'
        },
        {
            name: '高管经办人',
            roleId: 'windOperator'
        },
        {
            name: '高管复核人',
            roleId: 'windReviewer'
        },
    ];

    static readonly customList = [
        {
            name: '自定义',
            roleId: 'custom'
        }
    ];


    private static getListData(): any {
        return List.roleList;
    }

    private static getCustomData(): any {
        return List.roleList.concat(List.customList);
    }

    private static getCustomTitle(roleId): any {
        const lists = List.roleList.concat(List.customList);
        for (const list of lists) {
            if (list.roleId === roleId) {
                return list.name;
            }
        }
    }

    /**
     * 获取list信息
     * @returns {Observable}
     */
    static getList(): Observable<any> {
        return of(List.getListData());
    }

    static getCustomList(): Observable<any> {
        return of(List.getCustomData());
    }

    static getTitle(roleId): Observable<any> {
        return of(List.getCustomTitle(roleId));
    }
}

import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

/*
 * Copyright(c) 2017-2019, 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：项目管理-提醒管理-首页代办产看提醒
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   yu             新增                 2020-01-17
 * **********************************************************************
 */



export default class ViewRemindConfig {
    // 发起抽样页面
    static viewRemind = {
        checkers: <CheckersOutputModel[]>[
            { title: '提醒事项名称', checkerId: 'remindName', type: 'special-text', required: false, value: '', name: 'remindName', options: {} },
            { title: '提醒日期', checkerId: 'remindDate', type: 'special-text', required: false, value: '', options: {} },
            { title: '提醒内容', checkerId: 'remindContent', type: 'textarea', required: false, value: '', options: { readonly: true }, memo: '' },
        ],
        returnFiles: { title: '文件回传', checkerId: 'remindFiles', type: 'dragonMfile', required: true, value: '', options: { fileext: "jpg, jpeg, png, pdf" }, },
        remindMemo: { title: '备注信息', checkerId: 'remindMemo', type: 'textarea', required: false, value: '', options: {}, },
    }


    /**
     * 给checkes赋值
     * @param params 值集合
     * @param remindType 提醒类型
     * @param remindStatus 提醒类型
     */
    static setValue(params: { [key: string]: any }, remindType: string[], remindStatus: number): any {
        let checkers = XnUtils.deepCopy(ViewRemindConfig.viewRemind.checkers, []);
        checkers.forEach((obj) => {
            if (params.hasOwnProperty(obj.checkerId)) {
                obj.value = obj.checkerId === 'remindDate' ? XnUtils.formatDate(params[obj.checkerId]) : params[obj.checkerId];
            }
            if (obj.checkerId === 'remindContent' && remindType.includes('downloadList')) {
                obj.memo = '点击下载清单';
            }
        });
        if (remindType.includes('returnFiles')) {
            const returnFiles = XnUtils.deepCopy(ViewRemindConfig.viewRemind.returnFiles, {});
            returnFiles.value = params['remindFiles'];
            if (!!params['remindFiles']) { returnFiles.options['readonly'] = true };
            checkers.push(returnFiles);
        }
        const remindMemo = XnUtils.deepCopy(ViewRemindConfig.viewRemind.remindMemo, {});
        remindMemo.value = params['remindMemo'];
        if (!!params['remindMemo']) { remindMemo.options['readonly'] = true };
        checkers.push(remindMemo);
        return { checkers };
    }

    static getConfig(name: string, type: string) {
        return ViewRemindConfig[name][type];
    }
}

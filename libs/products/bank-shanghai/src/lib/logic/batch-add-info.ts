
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

/*
 * Copyright(c) 2017-2019, 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：项目管理-基础资产-抽样页面checker配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   yu             新增                 2020-01-17
 * **********************************************************************
 */



export default class BatchAddInfoConfig {
    // 发起补充信息页面
    static batchAddInfo = {
        checkers: [
            {
                title: '已选交易',
                checkerId: 'batchInfoShanghai',
                type: 'single-list',
                required: 0,
                value: '',
            },
            {
                title: '补充信息',
                checkerId: 'addInfo',
                type: 'checkbox',
                options: { ref: 'addInfo_sh' },
                required: true,
                value: '',
            },
            {
                title: '保理融资到期日',
                checkerId: 'factoringEndDate',
                type: 'sh-date',
                options: { showWhen: ['addInfo', '1'] },
                required: true,
                value: '',
            },
            // {
            //     title: '融资利率',
            //     checkerId: 'discountRate',
            //     type: 'number-control',
            //     options: { size: { min: 0, max: 100 }, showWhen: ['addInfo', '2'] },
            //     required: true,
            //     value: '',
            // },
            // {
            //     title: '服务费率',
            //     checkerId: 'serviceRate',
            //     type: 'number-control',
            //     options: { size: { min: 0, max: 100 }, showWhen: ['dockingInfo', '3'] },
            //     required: true,
            //     value: '',
            // }
        ] as CheckersOutputModel[]
    };

    /**
     * 给checkes赋值
     */
    static setValue(params: { [key: string]: any }): any {
        BatchAddInfoConfig.batchAddInfo.checkers.forEach((obj) => {
            if (params.hasOwnProperty(obj.checkerId)) {
                obj.value = params[obj.checkerId];
            }
        });
        return BatchAddInfoConfig.batchAddInfo;
    }

    static getChecker(name: string, type: string) {
        return BatchAddInfoConfig[name][type];
    }

    static getConfig(name: string) {
        return BatchAddInfoConfig[name];
    }
}


/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：Contract
 * @summary：老万科模式 针对万科利率，合同的一些特殊处理，基本废弃
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          说明         2019-05-28
 * **********************************************************************
 */

export class Contract {

    static readonly contractNames = ['应收账款转让通知书(城市公司)', '应收账款转让通知书(万科集团)', '应收账款转让通知书',
        '应收账款转让通知书(保理商-->付款人)', '应收账款转让通知书(保理商-->债务人)'];

    static getNames(): any {
        return Contract.contractNames;
    }
}

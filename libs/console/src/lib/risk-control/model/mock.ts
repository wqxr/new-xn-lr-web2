import {Observable, of} from 'rxjs';


export class MockData {
    static infoData = {
        'Name': '北京小桔科技有限公司',
        'KeyNo': '4659626b1e5e43f1bcad8c268753216e',
        'Category': '1',
        'Count': '5',
        'FundedRatio': '100%',
        'Children': [
            {
                'Name': '程维',
                'KeyNo': '7B0CFF16CA8BA1EC_',
                'Category': '2',
                'StockType': '自然人股东',
                'Count': '2',
                'SubConAmt': '491.9万元',
                'FundedRatio': '49.1900%',
                'Children': [
                    {
                        'Name': '程维',
                        'KeyNo': '7B0CFF16CA8BA1EC_',
                        'Category': '2',
                        'StockType': '企业',
                        'Count': '0',
                        'SubConAmt': '491.9万元',
                        'FundedRatio': '49.1900%',
                        'Children': null,
                        'IsAbsoluteController': 'True',
                        'Grade': '2',
                        'OperName': null,
                        'InParentActualRadio': '0.4919',
                        'ParentKeyNo': '4659626b1e5e43f1bcad8c268753216e'
                    },
                    {
                        'Name': '王刚',
                        'KeyNo': null,
                        'Category': '2',
                        'StockType': '企业',
                        'Count': '2',
                        'SubConAmt': '482.25万元',
                        'FundedRatio': '48.2250%',
                        'Children': [
                            {
                                'Name': '程维',
                                'KeyNo': '7B0CFF16CA8BA1EC_',
                                'Category': '1',
                                'StockType': '自然人股东',
                                'Count': '0',
                                'SubConAmt': '491.9万元',
                                'FundedRatio': '49.1900%',
                                'Children': null,
                                'IsAbsoluteController': 'True',
                                'Grade': '2',
                                'OperName': null,
                                'InParentActualRadio': '0.4919',
                                'ParentKeyNo': '4659626b1e5e43f1bcad8c268753216e'
                            },
                            {
                                'Name': '王刚',
                                'KeyNo': null,
                                'Category': '2',
                                'StockType': '自然人股东',
                                'Count': '0',
                                'SubConAmt': '482.25万元',
                                'FundedRatio': '48.2250%',
                                'Children': null,
                                'IsAbsoluteController': 'False',
                                'Grade': '2',
                                'OperName': null,
                                'InParentActualRadio': '0.48225',
                                'ParentKeyNo': '4659626b1e5e43f1bcad8c268753216e'
                            }
                        ],
                        'IsAbsoluteController': 'False',
                        'Grade': '2',
                        'OperName': null,
                        'InParentActualRadio': '0.48225',
                        'ParentKeyNo': '4659626b1e5e43f1bcad8c268753216e'
                    }
                ],
                'IsAbsoluteController': 'True',
                'Grade': '2',
                'OperName': null,
                'InParentActualRadio': '0.4919',
                'ParentKeyNo': '4659626b1e5e43f1bcad8c268753216e'
            },
            {
                'Name': '王刚',
                'KeyNo': null,
                'Category': '2',
                'StockType': '自然人股东',
                'Count': '0',
                'SubConAmt': '482.25万元',
                'FundedRatio': '48.2250%',
                'Children': null,
                'IsAbsoluteController': 'False',
                'Grade': '2',
                'OperName': null,
                'InParentActualRadio': '0.48225',
                'ParentKeyNo': '4659626b1e5e43f1bcad8c268753216e'
            },
            {
                'Name': '张博',
                'KeyNo': null,
                'Category': '2',
                'StockType': '自然人股东',
                'Count': '0',
                'SubConAmt': '15.53万元',
                'FundedRatio': '1.5530%',
                'Children': null,
                'IsAbsoluteController': 'False',
                'Grade': '2',
                'OperName': null,
                'InParentActualRadio': '0.01553',
                'ParentKeyNo': '4659626b1e5e43f1bcad8c268753216e'
            },
            {
                'Name': '吴睿',
                'KeyNo': null,
                'Category': '2',
                'StockType': '自然人股东',
                'Count': '2',
                'SubConAmt': '7.23万元',
                'FundedRatio': '0.7230%',
                'Children': [
                    {
                        'Name': '程维',
                        'KeyNo': '7B0CFF16CA8BA1EC_',
                        'Category': '1',
                        'StockType': '自然人股东',
                        'Count': '0',
                        'SubConAmt': '491.9万元',
                        'FundedRatio': '49.1900%',
                        'Children': null,
                        'IsAbsoluteController': 'True',
                        'Grade': '2',
                        'OperName': null,
                        'InParentActualRadio': '0.4919',
                        'ParentKeyNo': '4659626b1e5e43f1bcad8c268753216e'
                    },
                    {
                        'Name': '王刚',
                        'KeyNo': null,
                        'Category': '2',
                        'StockType': '自然人股东',
                        'Count': '0',
                        'SubConAmt': '482.25万元',
                        'FundedRatio': '48.2250%',
                        'Children': null,
                        'IsAbsoluteController': 'False',
                        'Grade': '2',
                        'OperName': null,
                        'InParentActualRadio': '0.48225',
                        'ParentKeyNo': '4659626b1e5e43f1bcad8c268753216e'
                    }
                ],
                'IsAbsoluteController': 'False',
                'Grade': '2',
                'OperName': null,
                'InParentActualRadio': '0.00723',
                'ParentKeyNo': '4659626b1e5e43f1bcad8c268753216e'
            },
            {
                'Name': '陈汀',
                'KeyNo': null,
                'Category': '2',
                'StockType': '自然人股东',
                'Count': '0',
                'SubConAmt': '3.09万元',
                'FundedRatio': '0.3090%',
                'Children': null,
                'IsAbsoluteController': 'False',
                'Grade': '2',
                'OperName': null,
                'InParentActualRadio': '0.00309',
                'ParentKeyNo': '4659626b1e5e43f1bcad8c268753216e'
            }
        ],
        'IsAbsoluteController': 'True',
        'Grade': '1',
        'ActualControllerLoopPath': [
            {
                'Name': '程维',
                'StockType': '自然人股东',
                'KeyNo': '',
                'SubConAmt': '491.9万元',
                'FundedRatio': '49.1900%'
            }
        ],
        'OperName': '程维',
        'InParentActualRadio': '0'
    };

    static getInfo(): Observable<any> {
        return of(this.infoData);
    }

}

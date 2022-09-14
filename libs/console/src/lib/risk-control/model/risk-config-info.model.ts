export default class SurveyInfo {
    constructor() {
    }

    'link': {
        heads: [
            { title: '企业名称', checkerId: 'companyName' },
            { title: '交易笔数', checkerId: 'dealCounts' },
            { title: '交易金额', checkerId: 'dealMoney' },
            { title: '一年内交易比重', checkerId: 'tradeProportion' }
            ],
        button: [{}],
        year: true
    };

    static getInfo(label) {
        //
    }
}

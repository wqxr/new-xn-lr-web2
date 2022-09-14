export default class SeasonDate {
    static getInfo(year?, type?, years?) {
        const data: SelectItem[] = [
            {label: `${year}年第一季度`, value: `${year}-01-01,${year}-03-31`},
            {label: `${year}年中报`, value: `${year}-01-01,${year}-06-30`},
            {label: `${year}年第三季度`, value: `${year}-07-01,${year}-09-30`},
            {label: `${year}年年报`, value: `${year}-01-01,${year}-12-31`},
        ];
        const data2: SelectItem[] = [
            {label: `${year}年中报`, value: `${year}-01-01,${year}-06-30`},
            {label: `${year}年年报`, value: `${year}-01-01,${year}-12-31`},
        ];
        const data3: SelectItem[] = [];
        if (!!years) {
            if (years.length) {
                years.map(x => {
                    data3.push({label: `${x}年`, value: x});
                });
                return data3;
            }
            return [{label: '--请选择--', value: ''}];
        }
        if (type === 'year') {
            return data2;
        }
        return data;
    }
}

export class SelectItem {
    label: string;
    value: string;
}

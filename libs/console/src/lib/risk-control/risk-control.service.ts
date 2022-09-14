import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

/**
 *  风控服务
 */
@Injectable({ providedIn: 'root' })
export class RiskControlService {
    public coreBusinessLists: BigDataListModel[];
    public memberBusinessLists: BigDataListModel[];

    public constructor(private xn: XnService) {
        this.memberBusinessLists = [
            {order: 1, appId: 100001, orgName: '万科企业股份有限公司'},
            {order: 2, appId: 100002, orgName: '深圳市思贝克工业发展有限公司'},
            {order: 3, appId: 100003, orgName: '深圳市怡亚通供应链股份有限公司'},
            {order: 4, appId: 100004, orgName: '深圳市旗丰供应链服务有限公司'},
            {order: 5, appId: 100005, orgName: '深圳市联合利丰供应链管理有限公司'},
            {order: 6, appId: 100006, orgName: '深圳市朗华供应链服务有限公司'},
            {order: 7, appId: 100007, orgName: '深圳市同济中基实业有限公司'},
            {order: 8, appId: 100008, orgName: '深圳市中基恒诚贸易有限公司'},
            {order: 9, appId: 100009, orgName: '深圳市前海一帆珠宝云商有限公司'},
            {order: 10, appId: 100010, orgName: '腾邦物流集团股份有限公司'},
            {order: 11, appId: 100011, orgName: '深圳市飞马国际供应链股份有限公司'},
            {order: 12, appId: 100012, orgName: '浙江思贝克电子商务有限公司'},
            {order: 13, appId: 100013, orgName: '东莞市思贝克电子商务有限公司'},
            {order: 14, appId: 100014, orgName: '宝德科技集团股份有限公司'},
            {order: 15, appId: 100015, orgName: '深圳前海产业互联网股份有限公司'},
            {order: 16, appId: 100016, orgName: '深圳鲜链科技有限公司'},
            {order: 17, appId: 100017, orgName: '深圳市创捷供应链有限公司'},
            {order: 18, appId: 100018, orgName: '深圳市大道晟供应链管理有限公司'},
        ];
    }

    // 获取企业列表
    public getLists(): Observable<BigDataListModel[]> {
        return of(this.coreBusinessLists);
    }

    // 获取成员企业
    public getMemberLists(start: number, size: number): Observable<any> {
        const list = this.memberBusinessLists.slice(start, size);
        const data = {
            total: this.memberBusinessLists.length,
            data: list
        };
        return of(data);
    }

    // 搜索企業
    public searchList(params: string): Observable<any> {
        const list = this.memberBusinessLists.filter((x: any) => x.orgName === params);
        const data = {
            total: list.length,
            data: list
        };
        return of(data);
    }
}

export class BigDataListModel {
    public appId?: number;
    public orgName?: string;
    public order?: number;
}

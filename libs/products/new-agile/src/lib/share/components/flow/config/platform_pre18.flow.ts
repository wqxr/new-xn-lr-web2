import { Observable, of } from 'rxjs';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { IFlowCustom } from './flow.custom';

/**
 *  万科abs 平台预录入
 */
export class PlatformPre18Flow implements IFlowCustom {

    constructor(private xn: XnService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            def: `《${this.xn.user.orgName}》的交易申请`
        };
    }
    private computeSum(array) {
        return array.reduce((prev, curr, idx, arr) => {
            return prev + curr;
        });
    }
}
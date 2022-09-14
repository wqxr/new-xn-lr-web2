import {IFlowCustom} from '../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';


export class PlatformEnterpriseAmountFlow implements IFlowCustom {

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
        if (svrConfig.procedure.procedureId === '@begin') {
            formValue.title = '《' + JSON.parse(formValue.enterprise).label + '》的额度调整';
        }
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '默认标题'
        };
    }

}

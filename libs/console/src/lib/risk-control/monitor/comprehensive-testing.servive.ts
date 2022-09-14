import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComprehensiveTestingServive {
    public accountsLists: AccountsOutputModel[];

    public constructor() {
        this.accountsLists = [
            {type: '3', agingStructure: '3个月', currentBalance: '100', preBalance: '120', previousPeriod: '-20 %'},
            {type: '6', agingStructure: '6个月', currentBalance: '', preBalance: '', previousPeriod: ''},
            {type: '9', agingStructure: '9个月', currentBalance: '', preBalance: '', previousPeriod: ''},
            {type: '12', agingStructure: '12个月', currentBalance: '', preBalance: '', previousPeriod: ''},
            {type: '12', agingStructure: '一年以上', currentBalance: '', preBalance: '', previousPeriod: ''},
        ];
    }

    public getaccoutsLists(): Observable<AccountsOutputModel[]> {
        return of(this.accountsLists);
    }
}

export class AccountsOutputModel {
    public type: string;  // 结构标记
    public agingStructure: string; // 账龄结构;
    public currentBalance: string; // 本期余额;
    public preBalance: string; // 上期余额;
    public previousPeriod: string; // 较上期;
}

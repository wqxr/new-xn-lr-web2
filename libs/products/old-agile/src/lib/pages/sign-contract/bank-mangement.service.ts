import { Injectable } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Injectable({ providedIn: 'root' })
export class BankManagementService {
    public constructor(private xn: XnService) {
    }

    /**
     * 查看流程记录
     */
    public viewProcess(mainFlowId: any) {
        this.xn.router.navigate([
            `console/main-list/detail/${mainFlowId}`
        ]);
    }
    // 查询参数设置
    public searchFormat(page, pageSize, searches): any {
        const params: any = {
            start: (page - 1) * pageSize,
            length: pageSize
        };
        // 搜索处理
        for (const search of searches) {
            if (search.key === 'createTime' && search.value !== '') {
                params.startTime = JSON.parse(search.value).beginTime;
                params.endTime = JSON.parse(search.value).endTime;
            } else {
                params[search.key] = search.value;
            }
        }
        return params;
    }
}

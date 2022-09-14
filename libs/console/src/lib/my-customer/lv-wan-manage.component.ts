import {Component, Input, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {forkJoin} from 'rxjs';

/**
 *  万科利率
 */
@Component({
    selector: 'app-lv-wan-manage-component',
    templateUrl: './lv-wan-manage.component.html',
    styles: [
            `.table {
            font-size: 13px;
        }`,
    ]
})
export class LvWanManageComponent implements OnInit {
    @Input() hiddenTitle: boolean;
    public pageTitle = '万科利率管理';
    public pageDesc = '';
    public headerTitle = '总部利率';
    public cityTitle = '城市公司利率';
    public projectTitle = '项目公司利率';
    // 总部总数
    public wkHeadquarterTotal = 0;
    // 城市公司
    public wkCityTotal = 0;
    // 项目公司
    public wkProjectTotal = 0;
    public pageSize = 10;
    // 总部
    public wkHeadquarterInfo: EenterpriseInfoModel[] = [];
    // 城市公司
    public wkCityInfo: EenterpriseInfoModel[] = [];
    // 项目公司
    public wkProjectInfo: EenterpriseInfoModel[] = [];
    public showEditOperator = false;
    public showEditOperatorTemp = false;
    public processConfig: ProcessConfig = new ProcessConfig();
    public vankeApiConfig: VankeApiConfig = new VankeApiConfig();
    // 公司级数
    public levelModel: LevelModel = new LevelModel();

    public constructor(private xn: XnService) {
    }

    public ngOnInit() {
        this.onPage(1);
        /**
         *  获取保存的登录信息
         * ["admin","operator","reviewer","windOperator"]
         * @type {any}
         */
        this.xn.user.roles.map(x => {
            if (x === 'windOperator') {
                this.showEditOperatorTemp = true;
                this.showEditOperator = this.showEditOperatorTemp;
            }
        });
    }

    /**
     *  wk:万科总部利率，wk1:万科城市公司利率,wk2:万科项目公司利率
     * @param {number} page
     */
    private onPage(page: number) {
        page = page || 1;
        /**
         *  开始位置，长度
         * @type {{start: number; length: number}}
         */
        const params = {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        };
        forkJoin(
            this.xn.api.post(this.vankeApiConfig.wkHeadApi, params),
            this.xn.api.post(this.vankeApiConfig.wkCityApi, params),
            this.xn.api.post(this.vankeApiConfig.wkProjectApi, params),
        ).subscribe(([wk, wk1, wk2]) => {
            // 总部
            this.wkHeadquarterTotal = wk.data.recordsTotal;
            this.wkHeadquarterInfo = wk.data.data;
            // 城市公司
            this.wkCityTotal = wk1.data.recordsTotal;
            this.wkCityInfo = wk1.data.data;
            // 项目公司
            this.wkProjectTotal = wk2.data.recordsTotal;
            this.wkProjectInfo = wk2.data.data;
        });
    }
}

// 信息模型
export class EenterpriseInfoModel {
    // 总部公司
    public enterpriseName: string;
    // 城市公司
    public enterpriseName1?: string;
    // 项目公司
    public enterpriseName2?: string;
    // 标准保理服务费率
    public factoringFWF: number;
    // 标准保理使用费率
    public factoringSYF: number;
    // 标准保理特殊利率
    public factoringTS: number;
    // 标准保理平台服务费
    public platformCost: string;
}

// 流程新增修改，新增接口
export class ProcessConfig {
    // 总部新增
    public wkHeaderAdd = 'financing_enterprise_lv_wk_add';
    // 编辑
    public wkHeaderEdit = 'financing_enterprise_lv_wk_edit';
    // 城市公司新增
    public wkCityAdd = 'financing_enterprise_lv_wk1_add';
    // 编辑
    public wkCityEdit = 'financing_enterprise_lv_wk1_edit';
    // 项目公司新增
    public wkProjectAdd = 'financing_enterprise_lv_wk2_add';
    public wkProjectEdit = 'financing_enterprise_lv_wk2_edit';
}

export class VankeApiConfig {
    // 总部api接口
    public wkHeadApi = '/quota/quotalist_wk';
    // 城市公司接口
    public wkCityApi = '/quota/quotalist_wk1';
    // 项目公司接口
    public wkProjectApi = '/quota/quotalist_wk2';
}

export class LevelModel {
    public level = '总部';
    public level1 = '城市公司';
    public level2 = '项目公司';
}

import {Component, Input, OnInit} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute} from '@angular/router';
import {CustomerInfoOutputModel} from '../model/survey-info.model';
import {BigDataListModel} from '../risk-control.service';
import {EquityStructureOutputModel} from '../model/equity-structure';
import { forkJoin } from 'rxjs';
/**
 *  客户信息
 */
@Component({
    selector: 'app-survey-in-info',
    templateUrl: './survey-in-info.component.html',
    styleUrls: ['./survey-in-info.component.css']
})
export class SurveyInInfoComponent implements OnInit {
    @Input() customerInformation: BigDataListModel;
    // 客户信息-工商信息、股东信息
    customerInfo: CustomerInfoOutputModel = new CustomerInfoOutputModel();
    // 股权关系结构
    structureData: EquityStructureOutputModel = new EquityStructureOutputModel();
    // 列表图标
    listAwesome = {minus: 'fa fa-2x fa-minus-circle', plus: 'fa fa-2x fa-plus-circle'};

    constructor(private xn: XnService, public route: ActivatedRoute) {
    }

    ngOnInit() {
        this.init();
        // this.initChart(); // 加载图表
    }

    init() {
        this.xn.loading.open();
        forkJoin(
            this.xn.api.post('/yb/risk1/customer/data1', {orgName: this.customerInformation.orgName}),
            this.xn.api.post('/yb/risk1/customer/data12', {orgName: this.customerInformation.orgName})
        ).subscribe(([v, w]) => {
            this.customerInfo = v.data;
            this.structureData = this.formatData(w.data);
            setTimeout(() => {
                this.xn.loading.close();
            });

        });
    }

    // 展开合并子项
    expand(val: EquityStructureOutputModel, all?) {
        if (val.expand === false) {
            val.expand = true;
            val.awesome = this.listAwesome.minus;
        } else if (val.expand === true) {
            val.expand = false;
            val.awesome = this.listAwesome.plus;
            if (!!all && all === 'all') {
                this.structureData = this.formatData(this.structureData);
            }
        }
    }

    // 格式化数据
    formatData(obj: EquityStructureOutputModel): any {
        // 初始化给每列数据加样式
        if (!!obj) {
            obj.awesome = this.listAwesome.plus;
            obj.expand = false; // 默认不展开,隐藏子项集
            if (obj.Children && obj.Children.length) {
                obj.Children.forEach(x => {
                    x.awesome = this.listAwesome.plus;
                    x.expand = false; // 默认不展开,隐藏子项集
                    this.formatData(x);
                });
            }
            return obj;
        }
        return obj;
    }

}

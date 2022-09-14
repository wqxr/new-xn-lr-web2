import {Component, OnInit, ViewContainerRef, ElementRef, ViewChild} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';

declare var $: any;

@Component({
    templateUrl: './interest.component.html',
    styles: [
            `.table {
            font-size: 13px;
        }`,
            `.xn-click-a {
            display: inline-block;
            padding-left: 5px;
            padding-right: 5px;
        }`,
            `label {
            font-weight: normal
        }`,
            `.bill-details-title {
            background-color: #EFF6FC;
            border: #6FA3DC 1px solid;
            padding: 6px 0px;
            margin-bottom: 15px
        }`,
            `.f-tilte-2 {
            margin-left: 10px
        }`,
            `.l-ticket-title font {
            color: #D10303;
        }`,
            `font {
            line-height: 34px;
        }
        .col-xs-offset-1{
            margin-left: 3% !important;
        }
        .col-xs-4{
            width: 48.33333333% !important;
        }`,
            `input {
            border-radius: 0 !important;
            background-clip: padding-box !important;
            color: #858585;
            background-color: #fbfbfb;
            border: 1px solid #d5d5d5;
            font-family: inherit;
            transition: box-shadow .45s, border-color .45s ease-in-out;
            -webkit-box-shadow: none;
            -moz-box-shadow: none;
            box-shadow: none;
        }`,
            `.form-horizontal .control-label {
            padding-top: 0px
        }`,
            `.btn-blue, .btn-blue:focus {
            background-color: #5db2ff;
            border-color: #5db2ff;
            color: #fff;
        }`,
            `.d-bill-help-block i {
            color: #E58183;
        }`,
            `.help-block {
            margin: 0
        }`
    ]
})
export class InterestComponent implements OnInit {

    pageTitle = '利息计算器';
    pageDesc = '';
    cardNo = '';
    interest: any;
    amount = 0;

    total = 0;
    pageSize = 10;
    items: any[] = [];
    errorAmount = false;
    errorStartDate = false;
    errorExpireDate = false;
    errorUseRate = false;
    errorServiceRate = false;
    errorMaxDate = false;
    errorPlatServiceRate = false;

    @ViewChild('BillAmount') billAmount: ElementRef;
    @ViewChild('StartDate') StartDate: ElementRef;
    @ViewChild('ExpireDate') ExpireDate: ElementRef;
    @ViewChild('UseRate') UseRate: ElementRef;
    @ViewChild('ServiceRate') ServiceRate: ElementRef;
    @ViewChild('UseRateData') UseRateData: ElementRef;
    @ViewChild('ServiceRateData') ServiceRateData: ElementRef;
    @ViewChild('CalcDay') CalcDay: ElementRef;
    @ViewChild('PlatServiceRateData') PlatServiceRateData: ElementRef; // 计算平台服务费
    @ViewChild('userServiceData') userServiceData: ElementRef;
    @ViewChild('totalData') totalData: ElementRef;
    @ViewChild('platformServiceSate') platformServiceSate: ElementRef;

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        $('#startDate').datepicker();
        $('#expireDate').datepicker();
    }

    calculate() {
        const money = this.billAmount.nativeElement.value;
        const billAmount = parseFloat(money.replace(/[,]/g, ''));
        const startDate = Date.parse(this.StartDate.nativeElement.value) || '';
        const expireDate = Date.parse(this.ExpireDate.nativeElement.value) || '';
        const useRate = this.UseRate.nativeElement.value;
        const serviceRate = this.ServiceRate.nativeElement.value;
        const platfromRate = this.platformServiceSate.nativeElement.value; // 平台服务费取值
        const PlatServiceRateData = this.PlatServiceRateData.nativeElement.value;

        !billAmount ? this.errorAmount = true : this.errorAmount = false;
        !startDate ? this.errorStartDate = true : this.errorStartDate = false;
        !expireDate ? this.errorExpireDate = true : this.errorExpireDate = false;
        !useRate ? this.errorUseRate = true : this.errorUseRate = false;
        !serviceRate ? this.errorServiceRate = true : this.errorServiceRate = false;
        !PlatServiceRateData ? this.errorPlatServiceRate = true : this.errorPlatServiceRate = false;
        if (billAmount && startDate && expireDate && useRate && serviceRate) {
            if (expireDate <= startDate) {
                this.errorMaxDate = true;
                return 0;
            } else {
                this.errorMaxDate = false;
            }
            const calcDay = (Number(expireDate) - Number(startDate)) / 1000 / 60 / 60 / 24; // 计息天数
            const timeRate = (Number(expireDate) - Number(startDate)) / (1000 * 86400 * 360); // 融资期限
            const useRateData = Number(((useRate / 100) * timeRate * billAmount).toFixed(2)); // 使用费
            const serviceRateData = Number(((serviceRate / 100) * timeRate * billAmount).toFixed(2));  // 服务费
            const platserviceRateData = Number((billAmount * (platfromRate / 100) * Math.ceil(calcDay / 30)).toFixed(2)); // 平台服务费
            const useServiceData = (useRateData + serviceRateData + platserviceRateData).toFixed(2); // 使用费+服务费+平台服务费
            const totaldata = (billAmount - Number(useRateData) - serviceRateData - platserviceRateData).toFixed(2); // 本金-使用费-服务费-平台服务费
            this.CalcDay.nativeElement.value = calcDay;
            this.UseRateData.nativeElement.value = XnUtils.formatMoney(useRateData);
            this.ServiceRateData.nativeElement.value = XnUtils.formatMoney(serviceRateData);
            this.userServiceData.nativeElement.value = XnUtils.formatMoney(useServiceData);
            this.totalData.nativeElement.value = XnUtils.formatMoney(totaldata);
            this.PlatServiceRateData.nativeElement.value = XnUtils.formatMoney(platserviceRateData);

        }
    }

    inputMoney() {
        // 金额千分位显示支持
        this.billAmount.nativeElement.value = XnUtils.formatMoney(this.billAmount.nativeElement.value);
    }
}

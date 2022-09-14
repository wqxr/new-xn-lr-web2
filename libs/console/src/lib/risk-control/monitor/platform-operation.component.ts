import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { FormGroup } from '@angular/forms';


import * as moment from 'moment';

/**
 *  平台运营指标
 */
@Component({
  selector: 'app-comprehensive-testing-platform-operation',
  templateUrl: './platform-operation.component.html',
  styles: [`
        .chart-title {
            margin: 18px 0;
            font-size: 20px;
            font-weight: bold;
        }
        .select-pos {
            margin: 15px 0;
        }
        .chart-border {
            border: 1px solid #dddddd;
        }
    `
  ]
})
export class PlatformOperationComponent implements OnInit {

  pageTitle = '综合监测';
  pageDesc = '';
  earlyWarn: Boolean;
  shows = [];
  showsTime = [];
  mainForm: FormGroup;
  mainFormTime: FormGroup;
  // 初始时间
  initDate = JSON.stringify({ beginTime: moment().subtract(90, 'days').format('x'), endTime: moment().format('x') });
  // 是否初始化公司选择select
  private hasInitCompanySlect = false;
  // 保存资金回笼所有数据
  private infoData: any;

  nowMonth: number;

  optionKey: any = [
    {
      cn: '回款中',
      en: 'backAmont'
    },
    {
      cn: '放款',
      en: 'loanAmount'
    },
    {
      cn: '逾期',
      en: 'overAmont'
    },
    {
      cn: '已还款',
      en: 'repaymentAmount'
    },
  ];


  @ViewChild('chart1') chart1: ElementRef;
  @ViewChild('chart2') chart2: ElementRef;
  @ViewChild('chart3') chart3: ElementRef;

  constructor(private xn: XnService) { }

  ngOnInit() {

    this.showsTime = [
      {
        checkerId: 'createTime',
        type: 'quantum',
        title: '选择监测时间',
        required: false,
        value: this.initDate
      }
    ];
    XnFormUtils.buildSelectOptions(this.showsTime);
    this.buildChecker(this.showsTime);
    this.mainFormTime = XnFormUtils.buildFormGroup(this.showsTime);
    this.mainFormTime.valueChanges.subscribe((v) => {
      const changeDate = JSON.parse(this.getChangeData(v));
      this.getDealPercent(changeDate);
    });


    // 交易占比模块初始化
    this.dealPercentModel();

    // 规模占比模块初始化
    this.scopePercentModel();

    // 资金回笼模块
    this.infoModel();

  }

  // 资金回笼模块
  private infoModel() {
    // 异步数据获取
    this.getInfo();
  }

  // 资金回笼异步请求
  private getInfo(d?) {
    const param = !!d ? { c: d } : {};
    this.xn.api.post('/llz/comprehensive_test/platform_business/info', param).subscribe(json => {

      if (json.data.length <= 0) {
        return;
      }
      // 保存所有数据
      this.infoData = json.data;
      // 整理数据
      this.fixInfoData(json.data);
    });
  }

  // 资金回笼数据整理
  private fixInfoData(json) {
    const rows = this.getLastYear();
    this.nowMonth = +(moment().format('YY') + moment().format('MM'));

    const preData = this.getCol(json);
    const uniqueData = this.arrUnique(preData, 'appName');

    const uniqueAppName = uniqueData.map(v => v.appName);

    // 没有初始化公司选择器就初始化
    !this.hasInitCompanySlect ? this.companySelectInit(uniqueAppName) : '';

    const afterData = this.uniteMonth(preData, uniqueAppName);

    const compute = this.computeOptionAndSums(afterData, rows);
    const optionKeys = compute.optionKeys;
    const sums = compute.sums;

    const optionDataLoanAmount = optionKeys.loanAmount;
    const sumLoanAmount = sums.loanAmount;
    const option = this.getOption(optionDataLoanAmount, sumLoanAmount);

    uniqueAppName.push('总计');
    this.buildChart(rows, uniqueAppName, option);
  }

  // 初始化公司选择select
  private companySelectInit(data): void {
    this.hasInitCompanySlect = true;

    const selectOption = this.buildOption(
      data.map(c => {
        return { name: c, code: c };
      })
    );
    this.shows.push({
      name: 'card_score',
      type: 'select',
      title: '选择公司',
      required: false,
      selectOptions: selectOption
    });
    this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    this.mainForm.valueChanges.subscribe((v) => {

      const data = this.infoData.filter(c => {
        return c.appName === v.card_score;
      });
      echarts.dispose(this.chart3.nativeElement);
      this.fixInfoData(data);
    });
  }

  // 计算当前月份所在的index
  // getNowMonthIndex(rows, nowMonth) {
  //   for (let i = 0; i < rows.length; i++) {
  //     if (Number(rows[i].month) === Number(nowMonth)) {
  //       return i;
  //     }
  //   }
  // }

  computeOptionAndSums(afterData, rows) {
    const optionKey = this.optionKey.map(v => v.en);
    const optionKeys = {} as any;
    for (const key of optionKey) {
      optionKeys[key] = this.buildOptionData(afterData, rows, key);
    }

    const sums = {} as any;
    for (const key of optionKey) {
      sums[key] = this.getSum(this.buildArray(optionKeys[key]));
    }
    sums.allRepayment = this.getAllRepay(sums.repaymentAmount);
    sums.allBackAmont = this.getAllRepay(sums.backAmont);
    sums.allLoanAmount = this.getAllRepay(sums.loanAmount);
    sums.allOverAmont = this.getAllRepay(sums.overAmont);
    return {
      optionKeys,
      sums
    };
  }

  getAllRepay(sums) {
    let total = 0;
    for (const sum of sums) {
      total += sum;
    }
    return total;
  }

  // 拼成option的值，带上总计
  getOption(optionData, sum) {
    const option = optionData.map(v => {
      return {
        name: v.name,
        data: v.value.map(d => d.toFixed(2)),
        type: 'bar',
      };
    });
    option.push({
      name: '总计',
      type: 'line',
      data: sum.map(v => v.toFixed(2)),
    });
    return option;
  }

  // 拼成纯数组
  buildArray(optionData) {
    const arr = optionData.map(v => v.value);
    return arr;
  }

  // 求和
  getSum(arr) {
    const newArray = arr[0].map((col, i) => {
      return arr.map((row) => {
        return row[i];
      });
    });
    const sum = [];
    for (const array of newArray) {
      sum.push(this.computeSum(array));
    }
    return sum; // js浮点数相加会错乱，取两位小数
  }

  // 具体到单个数组的求和
  computeSum(array) {
    return array.reduce((prev, curr, idx, arr) => {
      return prev + curr;
    });
  }

  buildOptionData(datas, titles, v) {
    const arrs = [];
    for (const data of datas) {
      const arr = [];
      for (const title of titles) {
        let key = false;
        for (const i of data.value) {
          if (parseInt(i.month, 10) === parseInt(title.month, 10)) {
            key = true;
            arr.push(i[v] / 1000000); // 除以百万
          }
        }
        if (key === false) {
          arr.push(0);
        }
      }
      arrs.push({
        name: data.name,
        value: arr
      });
    }
    return arrs;
  }

  // 生成一个数组，就是列，当前月份往前推12个月。
  // 测试月份：moment('2015-03-25').subtract(i, 'months').format('M')
  getLastYear() {
    const rows = [];
    // 当前月份往前推12个月。
    for (let i = 11; i >= 0; i--) {
      rows.push({
        year: moment().subtract(i, 'months').format('YY'),
        MMmonth: moment().subtract(i, 'months').format('MM'),
        month: moment().subtract(i, 'months').format('YY') + moment().subtract(i, 'months').format('MM')
      });
    }
    // 当前月份往前后12个月。
    for (let i = 1; i <= 11; i++) {
      rows.push({
        year: moment().add(i, 'months').format('YY'),
        MMmonth: moment().add(i, 'months').format('MM'),
        month: moment().add(i, 'months').format('YY') + moment().add(i, 'months').format('MM'),
      });
    }
    return rows.filter(v => Number(v.month) >= 1710);
  }

  // 遍历所有data项，将每个data项的时间戳算成月份，并加上
  getCol(datas) {
    for (let i = 0; i < datas.length; ++i) {
      const payMonth = this.computeMonth(datas[i].payTime);
      const factoryMonth = this.computeMonth(datas[i].factoringTime);
      datas[i].payMonth = parseInt(payMonth, 10);
      datas[i].factoryMonth = parseInt(factoryMonth, 10);
    }

    return datas;
  }

  // 将时间戳转成月份
  computeMonth(date) {
    // 时间戳转成毫秒
    const month = moment(new Date(date * 1000)).format('YY') + moment(new Date(date * 1000)).format('MM');
    return month;
  }

  // 将相同公司相同月份的值进行统一相加
  uniteMonth(datas, uniqueAppName) {
    if (datas && datas.length === 0 || uniqueAppName && uniqueAppName.length === 0) {
      return;
    }
    const uniteData: any = [];

    for (const name of uniqueAppName) {
      const arrs: any = [];
      for (const data of datas) {
        if (name === data.appName) {
          arrs.push(data);
        }
      }
      const obj = {} as any;
      obj.name = name;
      obj.value = this.sameMonthAdd(arrs);
      obj.total = this.getPerTotal(this.sameMonthAdd(arrs));
      uniteData.push(obj);
    }
    return uniteData;
  }

  getPerTotal(arrs) {
    let total = 0;
    for (const arr of arrs) {
      total += arr.repaymentAmount;
    }
    return total;
  }

  // 数组去重
  arrUnique(arrs, id) {
    const hash = {} as any;
    arrs = arrs.reduce(function(item, next) {
      hash[next[id]] ? '' : hash[next[id]] = true && item.push(next);
      return item;
    }, []);
    return arrs;
  }

  // 将相同月份的值进行相加
  sameMonthAdd(arrs) {

    const obj = {} as any;
    const arr = [];

    for (const item of arrs) {
      if (!obj[item.factoryMonth]) {
        obj[item.factoryMonth] = {} as any;
        obj[item.factoryMonth].backAmont = 0;
        if (item.repaymentAmount <= 0 && item.overAmont <= 0) {
          obj[item.factoryMonth].backAmont += item.loanAmount;
        }
        obj[item.factoryMonth].loanAmount = item.loanAmount;
        obj[item.factoryMonth].overAmont = item.overAmont;
        obj[item.factoryMonth].repaymentAmount = item.repaymentAmount;
      } else {
        if (item.repaymentAmount <= 0 && item.overAmont <= 0) {
          obj[item.factoryMonth].backAmont += item.loanAmount;
        }
        obj[item.factoryMonth].loanAmount += item.loanAmount;
        obj[item.factoryMonth].overAmont += item.overAmont;
        obj[item.factoryMonth].repaymentAmount += item.repaymentAmount;
      }

    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const temp = {} as any;
        temp.month = parseInt(key, 10);
        temp.backAmont = obj[key].backAmont;
        temp.loanAmount = obj[key].loanAmount;
        temp.overAmont = obj[key].overAmont;
        temp.repaymentAmount = obj[key].repaymentAmount;
        arr.push(temp);
      }
    }

    return arr;
  }

  buildChart(titles, uniqueAppName, option) {

    const option3 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        itemGap: 10,
        padding: 8,
        left: 'center',
        top: 650,
        align: 'left',
        data: uniqueAppName
      },
      grid: {
        height: 500,
        bottom: 300
      },
      xAxis: [
        {
          type: 'category',
          data: titles.map(v => {
            return v.year + '/' + v.MMmonth;
          }),
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '百万',
          min: 0,
          max: 2200,
          interval: 200,
          axisLabel: {
            formatter: '{value} '
          }
        },
      ],
      series: option
    };

    const chart3 = echarts.init(this.chart3.nativeElement);
    chart3.setOption(option3);
  }

  // 交易占比模块
  private dealPercentModel() {
    // 转换初始时间
    const parseInitDate = JSON.parse(this.initDate);
    // 获取异步数据，并整理
    this.getDealPercent(parseInitDate);
  }

  // 交易占比监测异步数据
  private getDealPercent(d): void {
    this.xn.api.post('/llz/comprehensive_test/platform_business/deal_percent', {
      startTime: d.beginTime,
      endTime: d.endTime
    })
      .subscribe(json => {
        const options = this.fixDealPercent(json.data);
        // 创建一个echarts实例，并将交易占比监测数据导入
        const chart1 = echarts.init(this.chart1.nativeElement);
        // 设置实例的的配置项和数据
        chart1.setOption(options);
      });
  }

  // 交易占比监测数据整理
  private fixDealPercent(json): any {
    const dealPercent = {
      title: {
        text: '累计业务份额',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        // orient: 'vertical',
        // top: 'middle',
        bottom: 5,
        itemGap: 15,
        left: 'center',
        data: json.map(c => {
          return c.appName;
        })
      },
      series: [
        {
          name: '占比详情',
          type: 'pie',
          radius: '58%',
          center: ['50%', '44%'],
          selectedMode: 'single',
          data: json.map(c => {
            const o = {
              name: c.appName,
              value: Number(c.contractAmount)
            };
            return o;
          }),
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    return dealPercent;
  }


  // 规模占比模块
  private scopePercentModel() {
    // 获取异步数据，并整理
    this.getScopePercent();
  }

  // 规模占比模块异步数据
  private getScopePercent(): void {
    this.xn.api.post('/llz/comprehensive_test/platform_business/scope_percent', {})
      .subscribe(json => {
        const options = this.fixScopePercent(json.data);
        // 创建一个echarts实例，并将数据导入
        const chart2 = echarts.init(this.chart2.nativeElement);
        // 设置实例的的配置项和数据
        chart2.setOption(options);
        // 预警标识控制
        this.earlyWarn = Number(json.data.money) / Number(json.data.riskMoney) > 0.1;
      });
  }

  // 规模占比监测数据整理
  private fixScopePercent(json): any {
    const scopePercent = {
      title: {
        text: '资本金占风险资本金比重',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        // orient: 'vertical',
        // top: 'middle',
        bottom: 10,
        left: 'center',
        data: ['资本金', '风险资本金-资本金']
      },
      series: [
        {
          name: '占比详情',
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: [
            { value: Number(json.money), name: '资本金' },
            { value: Number(json.riskMoney) - Number(json.money), name: '风险资本金-资本金' }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]

    };
    return scopePercent;
  }

  private buildOption(v) {
    return v.map(data => {
      return {
        label: data.name,
        value: data.code
      };
    });
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  // 获取选择的日期
  private getChangeData(v: any): any {
    return v.createTime;
  }
}

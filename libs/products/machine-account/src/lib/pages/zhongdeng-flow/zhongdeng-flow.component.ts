import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ZhongdengComponent } from './zhongdeng.component';

@Component({
    templateUrl: './zhongdeng-flow.component.html',
    styles: [`
        .clearfix:after {
            content: '.';
            height: 0;
            display: block;
            clear: both;
        }
        .clearfix {
            zoom: 1;
        }
    `]
})
export class ZhongdengFlowComponent implements OnInit {
    mainForm: FormGroup;
    infos: any[] = [];

    flowTitle = '保理商中登登记';
    isGet = false;
    goBack: boolean = false;
    timed: any;
    @ViewChild(ZhongdengComponent)
    private Zhongdeng: ZhongdengComponent;
    constructor(private xn: XnService,
        private route: ActivatedRoute,
        private router: Router,) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (XnUtils.isEmptyObject(params)) {
                return;
            }
            const isSh = XnUtils.parseObject(params.relateValue, []).every((x: string) => x.endsWith('sh') || x.endsWith('so'));
            const zdUrl = !!isSh ? '/zhongdeng/zd/register_sh_list' : '/zhongdeng/zd/registerList';
            this.xn.dragon.post2(zdUrl, { mainIds: params.relateValue }).subscribe(json => {
                if (json.ret === 0) {
                    this.infos = json.data.zdList;
                    this.timed = window.setInterval(() => {
                        this.getZDStatus(this.infos[0].registerId)
                    }, 5000);
                    this.isGet = true;
                } else {
                    this.goBack = true;
                }
            });
        });
        this.router.events.subscribe((data) => {
            //路由导航结束之后处理
            if (data instanceof NavigationEnd) {
                clearInterval(this.timed);
            }
        });
    }
    /**
     * 开启轮循任务  告知有人正在操作这个界面
     */
    getZDStatus(registerId: number) {
        this.xn.dragon.postMap('/zhongdeng/zd/zd_operate_create_cache', { registerId: registerId }).subscribe(x => {
            if (x.ret === 0) {
            } else {
                clearInterval(this.timed);
            }
        })
    }

    /**
     *  取消并返回
     */
    public onCancel() {
        clearInterval(this.timed);
        if (this.goBack) {
            this.xn.user.navigateBack();
        } else {
            this.Zhongdeng.returnBack();

        }
    }

    /**
     * 点击完成跳转到列表页面
     */
    // public onFinish() {
    //     this.xn.router.navigate(['machine-account/zhongdeng-list']);
    // }
}

import { Component, OnInit, ElementRef, ViewContainerRef, Input } from '@angular/core';
import { PortalData } from 'libs/shared/src/lib/config/mock';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import XnLogicUtils from 'libs/shared/src/lib/common/xn-logic-utils';
import XnLoginSwitchUtils from 'libs/shared/src/lib/common/xn-login-switch';
@Component({
    selector: 'new-console-header',
    templateUrl: './new-console-header.component.html',
    styles: [

        `
        .detailClass{
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0.34px;
            text-align: right;
        }
         .skin-blue .main-header .logo {
            background-color: transparent;
            color: #fff;
            border-bottom: 0 solid transparent;
        }
       .nav>li {
            position: relative;
            display: block;
            margin-left: 30px !important;
       }

        .main-header {
            width: 100%;
            margin:auto auto;
        }
        .main-header .newhead{
            width: 1200px;
            margin: 0 auto;
            height:60px;
        }

        .main-header .logo {
            padding: 0;
            padding-top:15px;
        }

        .console-header-container {
            float: right;
        }

        .console-header-login-btn {
            width: 80px;
            border: 1px solid #fff;
            line-height: 30px;
            padding: 0;
            margin-top: 8px;
            margin-right: 20px;
        }

        .navbar-nav > .user-menu > .dropdown-menu > li.user-header {
            height: 190px;
        }
        .btn-switch {
            margin-left: 6px;
            padding-left: 20px;
            padding-right: 20px;
        }
        .btn-logout {
            padding-left: 18px;
            padding-right: 18px;
         }
         .navbar-lr .navbar-nav > li > a {
            opacity: 0.8;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #fff;
            letter-spacing: 0.34px;
            text-align: right;
            position: relative;
            display: block;
            padding: 20px 0px;
            min-width:0px;
          }
         .fontColor{
            opacity: 0.8;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #1F2B38;
            letter-spacing: 0.34px;
         }
        `
    ]
})
export class NewConsoleHeaderComponent implements OnInit {

    // 有两种类型，注册中（未登陆时不跳转）和非注册中（未登陆时就跳转页面）
    needRedirectWhenLogout: boolean;

    logined = false;
    items: any;
    userId: string;
    userName: string;
    orgName: string;
    roles: any[] = [];
    rolesCn: any[] = [];
    multiOrgs = [];
    @Input() isRegister: boolean;
    // 当前登陆角色，企业类型
    public currentLoginedType: number;

    constructor(private xn: XnService,
        private route: ActivatedRoute,
        private vcr: ViewContainerRef,
        private er: ElementRef) {
    }

    ngOnInit() {
        const orgs = window.sessionStorage.getItem('orgs');
        if (orgs !== 'undefined') {
            this.multiOrgs = JSON.parse(orgs);
        }
        this.route.url.subscribe(v => {
            this.onEnter();
        });
    }

    private onEnter() {
        //this.needRedirectWhenLogout = XnLogicUtils.needRedirectWhenLogout(this.xn.router.url);
        this.items = []; // PortalData.newcolumns2;
        this.currentLoginedType = this.xn.user.orgType;
        // 检查登录态
        const body = $(this.er.nativeElement.ownerDocument.body);
        body.removeClass('skin-blue');
        body.removeClass('skin-purple');
        body.removeClass('skin-green');
        body.removeClass('skin-red');
        body.addClass('skin-white');
        this.xn.user.checkLogin().subscribe(logined => {
            if (!logined) {
                this.onLogout();
            } else {
                this.fetchUserInfo();
                // 改变主题颜色
                XnLogicUtils.changeTheme(this.er, this.xn.user.orgType);

            }

        });
    }

    private fetchUserInfo(): void {
        this.logined = true;
        this.userId = this.xn.user.userId;
        this.userName = this.xn.user.userName;
        this.orgName = this.xn.user.orgName;
        this.roles = this.xn.user.roles;
        let rolesTemp: any[] = [];
        // console.log("roles: ", this.roles)
        for (let i in this.roles) {
            if (this.roles[i] === 'admin') {
                rolesTemp.push('管理员 ');
            } else if (this.roles[i] === 'operator') {
                rolesTemp.push('业务经办人 ');
            } else if (this.roles[i] === 'reviewer') {
                rolesTemp.push('业务复核人 ');
            } else if (this.roles[i] === 'windOperator') {
                rolesTemp.push('高管经办人 ');
            } else if (this.roles[i] === 'windReviewer') {
                rolesTemp.push('高管复核人 ');
            } else if (this.roles[i] === 'customerOperator') {
                rolesTemp.push('客户经理经办人');
            } else if (this.roles[i] === 'customerReviewer') {
                rolesTemp.push('客户经理复核人');

            } else if (this.roles[i] === 'riskOperator') {
                rolesTemp.push('风险审查经办人');

            } else if (this.roles[i] === 'riskReviewer') {
                rolesTemp.push('风险审查复核人');
            } else if (this.roles[i] === 'financeOperator') {

                rolesTemp.push('财务经办人');
            } else if (this.roles[i] === 'financeReviewer') {
                rolesTemp.push('财务复核人');

            } else if (this.roles[i] === 'checkerLimit') {
                rolesTemp.push('查看权限');
            }
        }
        this.rolesCn = rolesTemp;
    }

    public onLogin() {
        this.xn.user.setRedirectUrl(this.xn.router.url);
        XnLogicUtils.changeTheme(this.er, this.xn.user.orgType);
        this.xn.router.navigate(['/login']);
    }

    public onLogout(type?: number) {
        this.logined = false;
        this.userId = '';
        this.userName = '';
        this.orgName = '';
        XnLogicUtils.changeTheme(this.er, this.xn.user.orgType);
        window.sessionStorage.removeItem('orgs');
        if (type) {
            this.xn.api.post('/user/logout', {}).subscribe();
        }
        if (this.isRegister) {
            this.xn.user.logout();
        } else {
            if (this.needRedirectWhenLogout) {
                this.xn.user.logout();
            } else {
                this.xn.user.logoutNoRedirect();
            }
        }

    }

    public onSwitchMode() {
        const params = { multiOrgs: this.multiOrgs } as any;
        XnLoginSwitchUtils.switchModal(this.xn, this.vcr, params).subscribe(x => {
        });
    }
}

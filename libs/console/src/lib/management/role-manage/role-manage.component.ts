import {Component, OnInit, ViewContainerRef, ElementRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {List} from 'libs/shared/src/lib/config/list';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    templateUrl: './role-manage.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`,
        `.receive {padding-left: 5px;}`,
        `.inner-table tbody tr { text-align: center; cursor: pointer;}`,
        `.inner-table tbody tr td { line-height: 2;}`,
        `.inner-table tbody tr td { background: none}`,
        `.inner-table tbody tr:hover { background-color: #b6e3de; }`,
        `.inner-table tbody tr.active { background-color: #b6e3de; }`,
        `.form-group { margin-bottom: 0; }`,
        `.normal { font-weight: normal; text-align: center; padding-left: 20px; position: relative}`,
        `.text-center { text-align: center }`,
        `.row-power { width: 50%; float: left }`,
        `.main-power { height: 500px; overflow-y: scroll }`,
        `.main-power .row-power .hoverBox { display: none }`,
        `.main-power .row-power.active .hoverBox { display: block; position: absolute; left: 100px; top: 0px; width: 150px; height: 150px;
            border: 1px solid #ccc; background: #fff; z-index: 1; border-radius: 10px; text-align: left; padding: 5px; }`,
        `.main-power .row-power.active .hoverBox:before { position: absolute; content: ''; width: 0; height: 0; left: -7px; top: 4px; border-top: 7px solid transparent; border-right: 7px solid #ccc; border-bottom: 7px solid transparent; }`,
        `.o-hidden { overflow: scroll; width: 140px; height: 140px;}`
    ]
})
export class RoleManageComponent implements OnInit {

    pageTitle = '角色权限';
    pageDesc = '';
    tableTitle = '角色权限';
    cardNo = '';

    total = 0;
    pageSize = 10;
    items: any[] = [];
    readonlyMan = '只读用户';
    powerlist: any = {} as any;
    types: any[] = [];
    roleList: any[] = [];
    roleId = '';
    powerShows: any[] = [];
    powerList: any[] = [];
    mainForm: FormGroup;

    constructor(private xn: XnService, private vcr: ViewContainerRef, private er: ElementRef) {
    }

    ngOnInit() {

        List.getList().subscribe(v => {
            this.items = v;
            this.roleClick('admin');
        });
    }

    getPowerList(roleId) {
        this.xn.api.post('/power/role_power_list', {
            roleId
        }).subscribe(json => {
            this.powerList = json.data;
            const powers = $.extend(true, [], this.powerList); // 深拷贝
            const powersValue = this.addValue(powers);
            this.initCheckboxList(powersValue);
        });
    }

    addValue(powers) {
        if (!powers || powers.length <= 0) {
            return;
        }
        const newPower = $.extend(true, [], powers); // 深拷贝
        for (const power of newPower) {
            power.value = power.name;
            power.label = power.name;
        }
        return newPower;
    }

    roleClick(roleId) {
        if (this.roleId === roleId) {
            return;
        }
        this.roleId = roleId;
        this.getPowerList(roleId);
    }

    onCss(roleId) {
        if (!roleId) {
            return;
        }
        return this.roleId === roleId ? 'active' : '';
    }

    initCheckboxList(powerList) {
        this.powerShows = [];
        for (const power of powerList) {
            this.powerShows.push({
                name: power.name,
                required: false,
                type: 'checkbox',
                title: power.name,
                selectOptions: [power],
            });
        }

        this.mainForm = XnFormUtils.buildFormGroup(this.powerShows);

        this.mainForm.valueChanges.subscribe((v) => {
        });

        setTimeout(() => {
            this.initHover();
        }, 0);
    }

    // 更新checkbox的值，根据event.target.checked的值为true为新增，为false为删除，调取不同的接口
    updateSelection(event, name) {
        if (event.target.checked === true) {
            this.addPower(name);
        } else if (event.target.checked === false) {
            this.deletePower(name);
        }
    }

    // 新增权限
    private addPower(key: string) {
        const post = {
            roleId: this.roleId,
            appId: this.xn.user.appId,
            powers: [key]
        };
        this.xn.api.post('/power/role_power_add', post).subscribe(json => {
        });
    }

    // 删除权限
    private deletePower(key: string) {
        const post = {
            roleId: this.roleId,
            appId: this.xn.user.appId,
            powers: [key]
        };
        this.xn.api.post('/power/role_power_del', post).subscribe(json => {
        });
    }

    initHover() {
        $('.main-power .row-power label', this.er.nativeElement).hover(function() {
            $('.main-power .row-power').eq($(this).parent().index()).addClass('active').siblings().removeClass('active');
        }, function() {
            // $('.main-power .row-power').removeClass('active');
        });
    }

    hoverBox() {

    }
}

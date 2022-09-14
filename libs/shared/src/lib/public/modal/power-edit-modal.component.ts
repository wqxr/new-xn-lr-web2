import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from '../../services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {Router} from '@angular/router';
import {List} from '../../config/list';

@Component({
    templateUrl: './power-edit-modal.component.html',
    styles: [
        `.panel { margin-bottom: 0 }`,
        `.xn-input-font { padding-top: 5px; font-weight: normal; color: #353535; margin-right: 20px }`,
        `.normal { font-weight: normal }`,
        `.panel-height { height: 600px; overflow-y: scroll; }`,
        `@media(max-height: 1000px) { .panel-height { height: 550px } }`,
        `@media(max-height: 900px) { .panel-height { height: 500px } }`,
        `@media(max-height: 800px) { .panel-height { height: 450px } }`,
        `@media(max-height: 700px) { .panel-height { height: 400px } }`,
        `.line { border-bottom: 1px solid #ccc }`,
        `.xn-control-label { padding-top: 0 }`
    ]
})
export class PowerEditModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    private observer: any;

    params: any = {} as any;
    steped = 0;
    rows: any[] = [];
    shows: any[] = [];
    powerShows: any[] = [];
    mainForm: FormGroup;
    formValid = false;
    roleNumber = 0;
    roleArr: any[] = [];
    roleString = '';
    roleArrTemp: any[] = [];
    paramsTemp: any = {} as any;
    paramsArrTemp: any[] = [];
    newUserRoleList: any[] = [];
    selectOptionsArrAdmin: any[] = [];
    selectOptionsArrNotAdmin: any[] = [];
    selectOptionsArrAdminFactory: any[] = [];
    selectOptionsArrAdminNotFactory: any[] = [];
    memoTemp = '';
    types: any[] = [];
    power: any = {} as any;
    customShows: any[] = [];
    normalShows: any[] = [];

    constructor(private xn: XnService, private router: Router) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {
        this.params = params;
        console.log('params: ', this.params);
        this.types = params.types;

        List.getCustomList().subscribe(v => {
            console.log('list: ', v);
            const Obj = this.buildRole(v);
            console.log('Obj: ', Obj);
            this.buildTable(Obj);
        });

        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    buildTable(obj) {
        for (const role in obj) {
            if (obj.hasOwnProperty(role)) {
                if (obj[role] && obj[role].length > 0) {
                    console.log('role： ', role);
                    if (role === 'custom') {
                        List.getTitle(role).subscribe(v => {
                            this.customShows.push({
                                name: role,
                                required: false,
                                type: 'checkbox',
                                title: v,
                                selectOptions: obj[role],
                            });
                        });
                    } else {
                        List.getTitle(role).subscribe(v => {
                            this.normalShows.push({
                                name: role,
                                required: false,
                                type: 'checkbox',
                                title: v,
                                selectOptions: obj[role],
                            });
                            this.mainForm = XnFormUtils.buildFormGroup(this.normalShows);
                        });
                    }
                }
            }
        }
    }

    buildRole(v) {
        const Obj: any = {} as any;
        for (const item of v) {
            Obj[item.roleId] = this.addValue(this.params[item.roleId]);
        }
        return Obj;
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
        console.log('new: ', newPower);
        return newPower;
    }

    isChecked(value, name) {
        if (!this.power[name]) {
            return;
        }
        return this.power[name].indexOf(value) >= 0;
    }

    // 更新checkbox的值，根据event.target.checked的值为true为新增，为false为删除，调取不同的接口
    updateSelection(event, value, name) {

        console.log('event.target.checked:', event.target.checked);
        console.log('value:', value);

        if (event.target.checked === true) {
            this.addPower(name, value);
        } else if (event.target.checked === false) {
            this.deletePower(name, value);
        }
    }

    // 新增权限
    private addPower(key: string, value: any) {
        const keyValue = {} as any;
        keyValue[key] = value.split(',');

        const post = {
            userId: this.params.userId,
            appId: this.xn.user.appId,
            power: keyValue
        };

        this.xn.api.post('/power/add', post).subscribe(json => {
            console.log('state: ', json);
        });
    }

    // 删除权限
    private deletePower(key: string, value: any) {
        const keyValue = {} as any;
        keyValue[key] = value.split(',');

        const post = {
            userId: this.params.userId,
            appId: this.xn.user.appId,
            power: keyValue
        };

        this.xn.api.post('/power/del', post).subscribe(json => {
        });
    }

    private close(value: string) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    cssClass(step): string {
        if (step === this.steped) { return 'current'; }
        if (step > this.steped) { return 'disabled'; }
        else { return 'success'; }
    }

    onOk() {
        this.close('ok');
    }

}

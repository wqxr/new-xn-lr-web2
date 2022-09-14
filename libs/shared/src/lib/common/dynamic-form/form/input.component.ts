import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { DynamicDirective } from '../dynamic-host.directive';
import { dynamicComponentService } from '../dynamic.decorators';
import { DynamicComponent } from '../dynamic.component';

@Component({
    selector: 'app-dynamic-input',
    template: `<ng-template #dynamic dynamic-host></ng-template>`
})
export class InputComponent implements OnInit {

    // 动态表单模块名称
    @Input() formModule: string;

    // 当前行信息
    @Input() row: any;
    // 表单组
    @Input() form: FormGroup;
    // 主流程信息
    @Input() svrConfig?: any;
    @Input() mainFlowId?: string;
    @Input()  step:string;  // 分步信息

    // 组件tips
    public memo: any;
    // mainFlowId: string = '';

    @ViewChild(DynamicDirective, { static: true }) dynamicHost: DynamicDirective;

    constructor(
        private xn: XnService,
        private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        if (this.row && this.row.options !== undefined) {
            this.memo = this.initMemo(this.row.options);
        }
        if (this.row) {
            this.loadComponent();
        }
    }

    /**
     * 格式化输入组件提示信息
     * @param paramOptionConfig
     */
    private initMemo(paramOptionConfig) {
        if (!paramOptionConfig) {
            return '';
        } else {
            return JsonTransForm(paramOptionConfig).memo;

        }
    }

    private loadComponent() {
        const component = dynamicComponentService.getComponentInstance(this.row.type, this.formModule);

        if (!component) {
            return;
        }

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component as any);

        const viewContainerRef = this.dynamicHost.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(componentFactory);
        const instance = (componentRef.instance as DynamicComponent);
        instance.row = this.row;
        instance.form = this.form;
        instance.svrConfig = this.svrConfig;
        instance.mainFlowId = this.mainFlowId;
        instance.step=this.step;
    }
}

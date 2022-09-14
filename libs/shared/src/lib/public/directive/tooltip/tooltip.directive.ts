import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ApplicationRef,
    Injector,
    OnInit,
    Output,
    EventEmitter,
    OnDestroy,
    Inject,
    Optional, TemplateRef
} from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { TooltipOptionsService } from './tooltip-options.service';
import { defaultOptions } from './options';

export interface AdComponent {
    data: any;
    show: boolean;
    close: boolean;
    events: any;
}

@Directive({
    selector: '[tooltip]'
})

export class TooltipDirective implements OnInit, OnDestroy {

    hideTimeoutId: number;
    destroyTimeoutId: number;
    hideAfterClickTimeoutId: number;
    createTimeoutId: number;
    showTimeoutId: number;
    componentRef: any;
    elementPosition: any;
    _showDelay: any = 0;
    _hideDelay = 300;
    _id: any;
    _options: any = {} as any;
    _defaultOptions: any;
    _destroyDelay: number;
    componentSubscribe: any;
    isHoverTooltip = false;

    /* tslint:disable:no-input-rename */
    @Input('tooltip') tooltipValue: string | TemplateRef<any>;
    /* tslint:enable */

    @Input('options') set options(value: any) {
        if (value && defaultOptions) {
            this._options = value;
        }
    }
    get options() {
        return this._options;
    }

    @Input('placement') set placement(value: string) {
        if (value) {
            this._options.placement = value;
        }
    }

    @Input('content-type') set contentType(value: string) {
        if (value) {
            this._options['content-type'] = value;
        }
    }

    @Input('delay') set delay(value: number) {
        if (value) {
            this._options.delay = value;
        }
    }

    @Input('hide-delay-mobile') set hideDelayMobile(value: number) {
        if (value) {
            this._options['hide-delay-mobile'] = value;
        }
    }

    @Input('z-index') set zIndex(value: number) {
        if (value) {
            this._options['z-index'] = value;
        }
    }

    @Input('animation-duration') set animationDuration(value: number) {
        if (value) {
            this._options['animation-duration'] = value;
        }
    }

    @Input('trigger') set trigger(value: string) {
        if (value) {
            this._options.trigger = value;
        }
    }

    @Input('tooltip-class') set tooltipClass(value: string) {
        if (value) {
            this._options['tooltip-class'] = value;
        }
    }

    @Input('display') set display(value: boolean) {
        if (typeof (value) === 'boolean') {
            this._options.display = value;
        }
    }

    @Input('display-mobile') set displayMobile(value: boolean) {
        this._options['display-mobile'] = value;
    }

    @Input('shadow') set shadow(value: boolean) {
        this._options.shadow = value;
    }

    @Input('theme') set theme(value: boolean) {
        if (value) {
            this._options.theme = value;
        }
    }

    @Input('offset') set offset(value: number) {
        if (value) {
            this._options.offset = value;
        }
    }

    @Input('max-width') set maxWidth(value: number) {
        if (value) {
            this._options['max-width'] = value;
        }
    }

    @Input('id') set id(value: any) {
        this._id = value;
    }
    get id() {
        return this._id;
    }

    @Input('show-delay') set showDelay(value: number) {
        if (value) {
            this._showDelay = this._options['show-delay'] = value;
        }
    }

    get showDelay() {
        const result = this.options.delay || this._showDelay;

        if (this.isMobile) {
            return 0;
        } else {
            return result;
        }
    }

    @Input('hide-delay') set hideDelay(value: number) {
        if (value) {
            this._hideDelay = this._options['hide-delay'] = value;
        }
    }

    get hideDelay() {
        if (this.isMobile) {
            return (this._hideDelay >= this.options['hide-delay-mobile']) ? this._hideDelay : this.options['hide-delay-mobile'];
        } else {
            return this._hideDelay;
        }
    }

    get isTooltipDestroyed() {
        return this.componentRef && this.componentRef.hostView.destroyed;
    }

    get destroyDelay() {
        if (this._destroyDelay) {
            return this._destroyDelay;
        } else {
            return Number(this.hideDelay) + Number(this.options['animation-duration']);
        }
    }
    set destroyDelay(value: number) {
        this._destroyDelay = value;
    }

    @Output() events: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        @Optional() @Inject(TooltipOptionsService) private initOptions,
        private elementRef: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector) {
    }

    @HostListener('focusin')
    @HostListener('mouseenter')
    onMouseEnter() {
        if (this.isDisplayOnHover === false) {
            return;
        }

        this.show();
    }

    @HostListener('focusout')
    @HostListener('mouseleave')
    onMouseLeave() {
        setTimeout(() => {
            if (this.options.trigger === 'hover' && !this.isHoverTooltip) {
                this.destroyTooltip();
            }
        }, 300);
    }

    @HostListener('click')
    onClick() {


        if (this.isDisplayOnClick === false) {
            return;
        }

        this.show();

        this.hideAfterClickTimeoutId = window.setTimeout(() => {
            this.destroyTooltip();
        }, 0);
    }

    ngOnInit(): void {
        this.applyOptionsDefault(defaultOptions, this.options);
    }

    ngOnDestroy(): void {
        this.destroyTooltip({ fast: true });

        if (this.componentSubscribe) {
            this.componentSubscribe.unsubscribe();
        }
    }

    getElementPosition(): void {
        this.elementPosition = this.elementRef.nativeElement.getBoundingClientRect();
    }

    createTooltip(): void {
        this.clearTimeouts();
        this.getElementPosition();

        this.createTimeoutId = window.setTimeout(() => {
            this.appendComponentToBody(TooltipComponent);
        }, this.showDelay);

        this.showTimeoutId = window.setTimeout(() => {
            this.showTooltipElem();
        }, this.showDelay);
    }

    destroyTooltip(options = { fast: false }): void {
        this.clearTimeouts();

        if (this.isTooltipDestroyed === false) {

            this.hideTimeoutId = window.setTimeout(() => {
                this.hideTooltip();
            }, options.fast ? 0 : this.hideDelay);

            this.destroyTimeoutId = window.setTimeout(() => {
                if (!this.componentRef || this.isTooltipDestroyed) {
                    return;
                }

                this.appRef.detachView(this.componentRef.hostView);
                this.componentRef.destroy();
                this.events.emit('hidden');
            }, options.fast ? 0 : this.destroyDelay);
        }
    }

    showTooltipElem(): void {
        this.clearTimeouts();
        (this.componentRef.instance as AdComponent).show = true;
        this.events.emit('show');
    }

    hideTooltip(): void {
        if (!this.componentRef || this.isTooltipDestroyed) {
            return;
        }
        (this.componentRef.instance as AdComponent).show = false;
        this.events.emit('hide');
    }

    appendComponentToBody(component: any): void {
        this.componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);

        (this.componentRef.instance as AdComponent).data = {
            value: this.tooltipValue,
            element: this.elementRef.nativeElement,
            elementPosition: this.elementPosition,
            options: this.options
        };

        this.appRef.attachView(this.componentRef.hostView);
        const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        this.componentSubscribe = (this.componentRef.instance as AdComponent).events.subscribe((event: any) => {
            this.handleEvents(event);
        });
    }

    clearTimeouts(): void {
        if (this.createTimeoutId) {
            clearTimeout(this.createTimeoutId);
        }

        if (this.showTimeoutId) {
            clearTimeout(this.showTimeoutId);
        }

        if (this.hideTimeoutId) {
            clearTimeout(this.hideTimeoutId);
        }

        if (this.destroyTimeoutId) {
            clearTimeout(this.destroyTimeoutId);
        }
    }

    get isDisplayOnHover(): boolean {
        if (this.options.display === false) {
            return false;
        }

        if (this.options['display-mobile'] === false && this.isMobile) {
            return false;
        }

        if (this.options.trigger !== 'hover') {
            return false;
        }

        return true;
    }

    get isDisplayOnClick(): boolean {
        if (this.options.display === false) {
            return false;
        }

        if (this.options['display-mobile'] === false && this.isMobile) {
            return false;
        }

        if (this.options.trigger !== 'click') {
            return false;
        }

        return true;
    }

    get isMobile() {
        let check = false;
        navigator.maxTouchPoints ? check = true : check = false;
        return check;
    }

    applyOptionsDefault(defaultOps, options): void {
        this._defaultOptions = Object.assign({}, defaultOps, this.initOptions || {});
        this.options = Object.assign(this._defaultOptions, options);
    }

    handleEvents(event: any) {
        switch (event) {
            case 'shown':
                this.events.emit('shown');
                break;
            case 'hover':
                this.isHoverTooltip = true;
                break;
            case 'leave':
                this.isHoverTooltip = false;
                this.onMouseLeave();
                break;
            default:
                break;
        }
    }

    public show() {
        if (!this.componentRef || this.isTooltipDestroyed) {
            this.createTooltip();
        } else if (!this.isTooltipDestroyed) {
            this.showTooltipElem();
        }
    }

    public hide() {
        this.destroyTooltip();
    }
}

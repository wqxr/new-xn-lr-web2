import { Component, OnDestroy, Input, Output, EventEmitter, ElementRef, HostBinding } from '@angular/core';
import { ModalInstance, ModalResult } from './modal-instance';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'modal',
    host: {
        class: 'modal',
        role: 'dialog',
        tabindex: '-1'
    },
    template: `
        <div class="modal-wrap">
            <div class="modal-dialog" [ngClass]="getCssClasses()">
                <div class="modal-content" [ngClass]="specialClass">
                    <ng-content></ng-content>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .specialModel {
            width: 500px;
            height:260px;
        }
        .bigModel {
            height:95%;
        }
        `
    ]

})
export class ModalComponent implements OnDestroy {

    private overrideSize: string = null;

    instance: ModalInstance;
    visible = false;
    specialClass = '';

    @Input() animation = true;
    @Input() backdrop: string | boolean = true;
    @Input() keyboard = true;
    @Input() size: string;
    @Input() cssClass = '';

    @Output() onClose: EventEmitter<any> = new EventEmitter(false);
    @Output() onDismiss: EventEmitter<any> = new EventEmitter(false);
    @Output() onOpen: EventEmitter<any> = new EventEmitter(false);

    @HostBinding('class.fade') get fadeClass(): boolean {
        return this.animation;
    }

    @HostBinding('attr.data-keyboard') get dataKeyboardAttr(): boolean {
        return this.keyboard;
    }

    @HostBinding('attr.data-backdrop') get dataBackdropAttr(): string | boolean {
        return this.backdrop;
    }

    constructor(public element: ElementRef) {
        this.instance = new ModalInstance(this.element);

        this.instance.hidden.subscribe((result) => {
            this.visible = this.instance.visible;
            if (result === ModalResult.Dismiss) {
                this.onDismiss.emit(undefined);
            }
        });

        this.instance.shown.subscribe(() => {
            this.onOpen.emit(undefined);
        });
    }

    ngOnDestroy(): void {
        if (this.instance) {
            // 需要subscribe，让instance把appendTo body的元素remove掉
            this.instance.destroy().subscribe(() => {
            });
        }
    }

    routerCanDeactivate(): any {
        return this.ngOnDestroy();
    }

    open(size?: string, specialModel?: string): Observable<void> {
        if (ModalSize.validSize(size)) {
            this.overrideSize = size;
        }
        this.specialClass = !!specialModel ? specialModel : '';
        return this.instance.open().pipe(map(() => {
            this.visible = this.instance.visible;
        }));
    }

    close(value?: any): Observable<void> {
        return this.instance.close().pipe(map(() => {
            this.onClose.emit(value);
        }));
    }

    dismiss(): Observable<void> {
        return this.instance.dismiss().pipe(map(() => {
        }));
    }

    getCssClasses(): string {
        const classes: string[] = [];

        if (this.isSmall()) {
            classes.push('modal-sm');
        }

        if (this.isLarge()) {
            classes.push('modal-lg');
        }

        if (this.isXLarge()) {
            classes.push('modal-xlg');
        }
        if (this.isXXLarge()) {
            classes.push('modal-xxlg');
        }
        if (this.isXXXLarge()) {
            classes.push('modal-xxxlg');
        }

        if (this.cssClass !== '') {
            classes.push(this.cssClass);
        }

        return classes.join(' ');
    }

    private isSmall(): boolean {
        return this.overrideSize !== ModalSize.Large && this.overrideSize !== ModalSize.XLarge && this.overrideSize !== ModalSize.XXLarge
            && this.size === ModalSize.Small
            || this.overrideSize === ModalSize.Small;
    }

    private isLarge(): boolean {
        return this.overrideSize !== ModalSize.Small && this.overrideSize !== ModalSize.XLarge && this.overrideSize !== ModalSize.XXLarge
            && this.size === ModalSize.Large
            || this.overrideSize === ModalSize.Large;
    }

    private isXLarge(): boolean {
        return this.overrideSize !== ModalSize.Small && this.overrideSize !== ModalSize.Large && this.overrideSize !== ModalSize.XXLarge
            && this.size === ModalSize.XLarge
            || this.overrideSize === ModalSize.XLarge;
    }

    private isXXLarge(): boolean {
        return this.overrideSize !== ModalSize.Small && this.overrideSize !== ModalSize.Large && this.overrideSize !== ModalSize.XLarge
            && this.size === ModalSize.XXLarge
            || this.overrideSize === ModalSize.XXLarge;
    }
    private isXXXLarge(): boolean {
        return this.overrideSize !== ModalSize.Small && this.overrideSize !== ModalSize.Large && this.overrideSize !== ModalSize.XLarge
            && this.size !== ModalSize.XXLarge && this.size === ModalSize.XXXLarge
            || this.overrideSize === ModalSize.XXXLarge;
    }
}

export class ModalSize {
    static Small = 'sm';
    static Large = 'lg';
    static XLarge = 'xlg';
    static XXLarge = 'xxlg';
    static XXXLarge = 'xxxlg';


    static validSize(size: string): boolean {
        return size && (size === ModalSize.Small || size === ModalSize.Large || size === ModalSize.XLarge || size === ModalSize.XXLarge || size === ModalSize.XXXLarge);
    }
}

import {ElementRef} from '@angular/core';
import {Observable, of, fromEvent} from 'rxjs';
import { map } from 'rxjs/operators';

declare var jQuery: any;

export class ModalInstance {

    private suffix = '.ng2-bs3-modal';
    private shownEventName: string = 'shown.bs.modal' + this.suffix;
    private hiddenEventName: string = 'hidden.bs.modal' + this.suffix;
    private $modal: any;

    shown: Observable<void>;
    hidden: Observable<ModalResult>;
    result: any;
    visible = false;

    constructor(private element: ElementRef) {
        this.init();
    }

    open(): Observable<any> {
        return this.show();
    }

    close(): Observable<ModalResult> {
        this.result = ModalResult.Close;
        return this.hide();
    }

    dismiss(): Observable<ModalResult> {
        this.result = ModalResult.Dismiss;
        return this.hide();
    }

    destroy(): Observable<ModalResult> {
        return this.hide().pipe(map((ret) => {
            if (this.$modal) {
                this.$modal.data('bs.modal', null);
                this.$modal.remove();
            }
            return ret;
        }));
    }

    private show(): Observable<void> {
        this.resetData();
        this.$modal.modal();
        return this.shown;
    }

    private hide(): Observable<ModalResult> {
        if (this.$modal && this.visible) {
            this.$modal.modal('hide');
            return this.hidden;
        }
        return of(this.result);
    }

    private init(): void {
        this.$modal = jQuery(this.element.nativeElement);
        this.$modal.appendTo('body');

        this.shown = fromEvent(this.$modal, this.shownEventName)
            .pipe(map(() => {
                this.visible = true;
            }));

        this.hidden = fromEvent(this.$modal, this.hiddenEventName)
            .pipe(map(() => {
                const result = (!this.result || this.result === ModalResult.None)
                    ? ModalResult.Dismiss : this.result;

                this.result = ModalResult.None;
                this.visible = false;

                return result;
            }));
    }

    private resetData() {
        this.$modal.removeData();
        this.$modal.data('backdrop', booleanOrValue(this.$modal.attr('data-backdrop')));
        this.$modal.data('keyboard', booleanOrValue(this.$modal.attr('data-keyboard')));
    }
}

function booleanOrValue(value) {
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    }
    return value;
}

export enum ModalResult {
    None,
    Close,
    Dismiss
}

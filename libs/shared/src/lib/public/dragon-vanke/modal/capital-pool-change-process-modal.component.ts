import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from '../../../common/modal/ng2-bs3-modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { SelectRange } from '../../../common/dragon-vanke/emus';

/**
 *  资产池变更
 */
@Component({
    templateUrl: './capital-pool-change-process-modal.component.html'
})
export class CapitalChangeProcessModalComponent implements OnInit {
    public form: FormGroup;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public shows: any;
    public formModule = 'dragon-input';

    public constructor(private xn: XnService) {
    }

    open(params: any): Observable<string> {
        this.shows = [
            {
                checkerId: 'scope',
                name: 'scope',
                required: true,
                type: 'radio',
                title: '',
                selectOptions: [
                    {
                        value: SelectRange.All,
                        label: '变更发行'
                    },
                    {
                        value: SelectRange.Select,
                        label: '变更资产池'
                    }
                ]
            }
        ];
        if (!params.hasSelect) {
            this.shows[0].selectOptions[1].disable = true;
        }
        this.form = XnFormUtils.buildFormGroup(this.shows);
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public ngOnInit() {
    }

    public onSubmit() {
        this.close(this.form.value);
    }

    public onCancel() {
        this.close('');
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}

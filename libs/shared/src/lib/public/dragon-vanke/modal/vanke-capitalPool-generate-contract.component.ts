import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from '../../../common/modal/ng2-bs3-modal';
import { XnService } from '../../../services/xn.service';

/**
 *  资产池生成合同
 */
@Component({
    templateUrl: './vanke-capitalPool-generate-contract.component.html'
})
export class VankeCapitalPoolGeneratingContractModalComponent implements OnInit {
    public form: FormGroup;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public shows: any;
    public formModule = 'dragon-input';
    params: any;
    public id: number;
    public isOk = false;

    public constructor() {
    }

    open(params: any): Observable<string> {
        this.params = params.fileList;
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public ngOnInit() {
    }
    getContrctFile(e) {
        this.isOk = true;
        this.id = Number(e.target.value);

    }
    public onSubmit() {

        const choseFile = this.params.filter((x: any) => x.id === this.id);
        this.close(choseFile);
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

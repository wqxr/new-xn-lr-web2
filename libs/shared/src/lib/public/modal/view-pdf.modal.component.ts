import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewService } from '../../services/pdf-view.service';
import { XnService } from '../../services/xn.service';
import { Service } from 'libs/products/new-agile/src/lib/pages/vnake-mode';

// 付款管理打印时起息日期
@Component({
    templateUrl: './view-pdf.modal.component.html',
    styles: [`
        .required-label::after {
            content: '*';
            display: inline-block;
            color: #c50000;
        }
        .button-group {
            padding: 20px 0 0 15px;
        }
        .pdf-container {
            width: 100%;
            min-height: 100%;
            border: 0;
            background: #E6E6E6;
        }
        .display-content {
            height: calc(100vh - 280px);
            text-align: center;
            overflow-y: auto;
            background: #E6E6E6;
        }
        .this-pdf {
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }
        .footerCss {
            float: right;
            color: #666;
            padding-top: 5px;
            margin-right: 30px;
        }
    `],
    providers: [
        PdfViewService
    ]
})
export class ViewPdfModalComponent implements OnInit, AfterViewInit {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    params = {
        url: '',
        title: '',
    }
    public constructor(private pdfViewService: PdfViewService, private xn: XnService,) {
    }
    public ngOnInit() {

    }
    public ngAfterViewInit() {
        $('#container').scroll(() => {

            const nScrollHight = $('#container')[0].scrollHeight;
            const nScrollTop = $('#container')[0].scrollTop;
            const nDivHight = $('#container').height();
            console.log('nScrollHight==>', nScrollHight);
            if ((nScrollTop + nDivHight + 1300) >= nScrollHight) {
                $('#isRead').attr('disabled', false);
            } else {
                $('#isRead').attr('disabled', true);
            }
        });
    }

    open(params: any): Observable<any> {
        // this.params.title = params.title;
        // this.params.url = params.url;
        $('#isRead').attr('disabled', true);
        this.pdfViewService.m_init = true;
        this.params.title = params.titles;
        this.pdfViewService.pdfToCanvas(params.data, 'cfca');
        // setTimeout(() => {
        //     this.pdfViewService.pdfToCanvas(params.url, 'showpdf');

        // }, 0);
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });

    }
    private close(value) {
        this.modal.close();
        this.pdfViewService.onDestroy();
        this.observer.next(value);
        this.observer.complete();
    }

    // 我已阅读并同意
    onSubmit() {
        this.close({ action: 'ok' });
    }
    downLoad() {
        this.xn.api.getFileDownload('/user/get_protocol_file',
            { type: textTypeEnum[this.params.title], download: true }).subscribe(x => {
                const fileName = this.xn.api.getFileName(x._body.headers);
                this.xn.api.save(x._body.body, `${fileName}`);
            });
    }
    handleClose() {
        this.close({ action: 'cancel' });
    }


}
enum textTypeEnum {
    '链融平台参与方服务协议' = 'service',
    '链融平台隐私权政策协议' = 'privacy'
}

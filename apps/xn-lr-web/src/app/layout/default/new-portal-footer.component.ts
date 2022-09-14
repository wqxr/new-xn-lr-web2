import { Component, OnInit, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'new-portal-footer',
    templateUrl: './new-portal-footer.component.html',
    styleUrls: [
        './style.css',
        './portal-footer.component.css'
    ],
})
export class NewPortalFooterComponent implements OnInit, AfterViewInit {
    public Version = '';
    constructor() {
    }

    ngOnInit() {
        this.Version = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    public ngAfterViewInit() {
        this.hasScrollbar();
        $(window).scroll(function () {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop >= 0) {
                document.getElementById('footer').style.position = 'relative';
            } else {
                document.getElementById('footer').style.position = 'absolute';
            }
        });
    }
    hasScrollbar() {
        const scrollTop = document.documentElement.scrollHeight || document.body.scrollHeight;
        if (scrollTop > (window.innerHeight || document.documentElement.clientHeight)) {
            document.getElementById('footer').style.position = 'relative';
        } else {
            document.getElementById('footer').style.position = 'absolute';
        }
    }
}

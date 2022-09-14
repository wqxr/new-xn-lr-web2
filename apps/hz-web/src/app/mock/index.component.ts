import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
    <div class="wrapper">
        <header class="main-header">
            <nav class="navbar navbar-static-top">
                <div class="container">
                    <div class="navbar-header">
                        <a class="navbar-brand">Mock Forms</a>
                    </div>
                    <div class="collapse navbar-collapse pull-left" id="navbar-collapse">
                        <ul class="nav navbar-nav">
                            <li><a [routerLink]="['/input']">Input</a></li>
                            <li><a [routerLink]="['/show']">Show</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
        <div class="content-wrapper">
            <div class="container">
                <router-outlet></router-outlet>
            </div>
        </div>
    </div>
    `
})
export class MockIndexComponent implements OnInit {

    constructor() {
        //
    }

    ngOnInit() {
    }

}

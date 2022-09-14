import { Injectable } from '@angular/core';
import { pointRoot } from '../config/config';
import { HttpClientApiBaseService } from './api-base';
import { Router } from '@angular/router';
import { MsgBoxService } from './msg-box.service';
import { LoadingService } from './loading.service';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class PointApiService extends HttpClientApiBaseService {

    get apiRoot() {
        return pointRoot;
    }

    constructor(protected router: Router,
                protected httpClient: HttpClient,
                protected msgBox: MsgBoxService,
                protected loading: LoadingService) {
        super(router, httpClient, msgBox, loading);
    }
}

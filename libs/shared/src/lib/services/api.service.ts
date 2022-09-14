import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiRoot } from '../config/config';
import { ApiBaseService } from './api-base';
import { Router } from '@angular/router';
import { MsgBoxService } from './msg-box.service';
import { LoadingService } from './loading.service';
import { AvengerApiService } from './avenger-api.service';
import { DragonApiService } from './api-extra.service';
import { MiddleGroundApiService } from './middle-ground-api.service';

@Injectable({ providedIn: 'root' })
export class ApiService extends ApiBaseService {
    get apiRoot() {
        return apiRoot;
    }

    constructor(protected router: Router,
                protected http: HttpClient,
                protected msgBox: MsgBoxService,
                protected loading: LoadingService,
                public avenger: AvengerApiService,
                public dragon: DragonApiService,
                public Middle: MiddleGroundApiService,
    ) {
        super(router, http, msgBox, loading);
    }
}

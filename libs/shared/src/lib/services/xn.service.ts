import {Injectable, ApplicationRef, ComponentFactoryResolver} from '@angular/core';
import {Router} from '@angular/router';
import {MsgBoxService} from './msg-box.service';
import {ApiService} from './api.service';
import {ModalService} from './modal.service';
import {UserService} from './user.service';
import {LoadingService} from './loading.service';
import {NavService} from './nav.service';
import {LocalStorageService} from './local-storage.service';
import {AvengerApiService} from './avenger-api.service';
import { FileAdapterService } from './file-adapter.service';
import { DragonApiService } from './api-extra.service';
import { MiddleGroundApiService } from './middle-ground-api.service';
import { PointApiService } from './point-api.service'
@Injectable({ providedIn: 'root' })
export class XnService {
    constructor(public router: Router,
                public application: ApplicationRef,
                public cfr: ComponentFactoryResolver,
                public api: ApiService,
                public avenger: AvengerApiService,
                public dragon: DragonApiService,
                public point: PointApiService,
                public middle: MiddleGroundApiService,
                public file: FileAdapterService,
                public user: UserService,
                public msgBox: MsgBoxService,
                public modal: ModalService,
                public loading: LoadingService,
                public nav: NavService,
                public localStorageService: LocalStorageService) {
    }
}

import { PageComponent } from './page.component';

export enum PageTypes {
    Add,
    Detail,
    Edit,
    List
}

export abstract class CommonPage {
    type: PageTypes;

    constructor(pageType: PageTypes) {
        this.type = pageType;
    }
}

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xnStorageType'})
export class XnStorageTypePipe implements PipeTransform {
    transform(type: number): string {

        if (!type) {
            return;
        }

        let storageType: string;
        switch (type) {
            case 1:
                storageType = '自有';
                break;
            case 2:
                storageType = '租用';
                break;
            case 3:
                storageType = '其他';
                break;
        }
        return storageType;

    }
}

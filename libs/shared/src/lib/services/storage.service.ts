import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  isPhone = window.sessionStorage.getItem('isPhone') === 'true';
  saveData(key: string, value: any) {
    const data = typeof value !== 'string' ? JSON.stringify(value) : value;
    window.sessionStorage.setItem(key, data);
  }
  getData(key: string, isObject: boolean = false) {
    const data = window.sessionStorage.getItem(key);
    return isObject ? JSON.parse(data) : data;
  }
  removeData(key: string) {
    window.sessionStorage.removeItem(key);
  }
  clearData() {
    window.sessionStorage.clear();
  }
}

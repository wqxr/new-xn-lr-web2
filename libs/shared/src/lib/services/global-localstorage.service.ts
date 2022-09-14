import { Injectable } from '@angular/core';

/**
 * 在前台的页面不需要往数据库中存储数据，但是需要将数据传递到下一个页面。这时候就涉及到了，数据的临时存储。前端的缓存的使用。
 * 相同点：
        1、作用是一样的，sessionStorage和localStorage一样都是用来存储客户端临时信息的对象。
        2、存储内容类型：两者皆储存字符串类型的数据。
        3、数据存储操作：key-value，操作用法相同。
   不同点：
   生命周期：
        1、sessionStorage：生命周期是当前窗口或标签页，一旦窗口或标签页被关闭了，那么所有通过sessionStorage存储的数据也就被清空了，为了从安全方面考虑建议使用sessionStroage。
        2、localStorage：生命周期是永久，这意味着除非用户显式操作在浏览器提供的UI上清除localStorage信息，否则这些信息将永远存在。
   信息共享：
        不同浏览器无法共享localStorage或sessionStorage中的信息。相同浏览器的不同页面间可以共享相同的localStorage（页面属于相同域名和端口），
        但是不同页面或标签页间无法共享sessionStorage的信息。这里需要注意的是，页面及标签页仅指顶级窗口，
        如果一个标签页包含多个iframe标签且他们属于同源页面，那么他们之间是可以共享sessionStorage的。
 * localStorage有一定的存储大小限制，各浏览器不一致，经实测chrome为5M;
 */
@Injectable({ providedIn: 'root' })
export class GlobalLocalStorageService {

    public localStorage: any;

    constructor() {
        if (!localStorage) {
            throw new Error('Current browser does not support Local Storage');
        }
        this.localStorage = localStorage;
    }

    public set(key: string, value: string): void {
        this.localStorage[key] = value;
    }

    public get(key: string): string {
        return this.localStorage[key] || false;
    }

    public setArr(key: string, value: Array<any>): void {
        this.localStorage[key] = value;
    }

    public setObject(key: string, value: any): void {
        this.localStorage[key] = JSON.stringify(value);
    }

    public getObject(key: string): any {
        return JSON.parse(this.localStorage[key] || '{}');
    }

    public remove(key: string): any {
        this.localStorage.removeItem(key);
    }

    public removeAll(): any {
        this.localStorage.clear();
    }

}

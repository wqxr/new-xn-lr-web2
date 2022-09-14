import { Injectable } from '@angular/core';
import { HeaderParam, HttpService } from '../http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpService) { }
  // 首页统计数据
  getStatistics(
    params: any = {},
    headers?: Array<HeaderParam>,
    credentials: boolean = true
  ): Observable<any>{
    return this.http.post('home-statistics', params, headers, credentials);
  }
  // 首页展示最近上链数据
  getRecentList(
    params: any = {},
    headers?: Array<HeaderParam>,
    credentials: boolean = true
  ): Observable<any>{
    return this.http.post('query-recent-list', params, headers, credentials);
  }
  // 首页搜索
  queryInput(
    params: any = {},
    headers?: Array<HeaderParam>,
    credentials: boolean = true
  ): Observable<any>{
    return this.http.post('query-input', params, headers, credentials);
  }
  // 根据hash获取链详情数据
  queryDetail(
    params: any = {},
    headers?: Array<HeaderParam>,
    credentials: boolean = true
  ): Observable<any>{
    return this.http.post('query-detail', params, headers, credentials);
  }
}

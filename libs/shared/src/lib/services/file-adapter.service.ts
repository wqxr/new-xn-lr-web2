import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { AvengerApiService } from './avenger-api.service';
import { DragonApiService } from './api-extra.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FileAdapterService {
  constructor(
    private api: ApiService,
    private avenger: AvengerApiService,
    private dragonApiService: DragonApiService
  ) {}

  /**
   * 上传文件
   * @param data 文件表单数据
   * @param isAvenger 是否是采购融资业务，默认为 false
   */
  upload(data: FormData, isAvenger = false) {
    return (
      isAvenger
        ? this.avenger.upload('/file/upload', data)
        : this.api.upload('/attachment/upload', data)
    ).pipe(
      map((x) => {
        const obj = { ...x.data.data, isAvenger };
        x.data.data = obj;
        return x;
      })
    );
  }
  /**
   * 龙光上传文件
   * @param data 文件表单数据
   */
  dragonUpload(data: FormData) {
    return this.dragonApiService.upload('/file/upload', data).pipe(
      map((x) => {
        return x;
      })
    );
  }
  /**
   * 查看文件
   * @param params 文件信息参数
   * @param isAvenger 是否是采购融资业务，默认为 false
   */
  view(params: {
    fileId: string;
    filePath: string;
    isAvenger: boolean;
    isInvoice?: boolean;
  }) {
    if (params.isAvenger) {
      const { t, sign } = this.avenger.getSignInfo();
      return params.isInvoice
        ? `/avenger/file/nuonuofp?id=${params.fileId.replace(
            /\.pdf/,
            ''
          )}&mainFlowId=${params.filePath}&sign=${sign}&t=${t}`
        : `/avenger/file/view?key=${
            params.filePath || params.fileId
          }&sign=${sign}&t=${t}`;
    } else {
      return `/api/attachment/view?key=${params.fileId}`;
    }
  }

  /**
   * 龙光查看文件
   * @param params 文件信息参数
   *
   */
  dragonView(params: { fileId: string; filePath: string }) {
    const { t, sign } = this.dragonApiService.getSignInfo();
    return `/dragon/file/view?key=${
      params.fileId || params.filePath
    }&sign=${sign}&t=${t}`;
  }

  /**
   * 通用查看文件
   * @param params 文件信息参数
   */
  XnFilesView(params: { fileId: string; filePath: string }, type: string) {
    const { t, sign } = this.dragonApiService.getSignInfo();
    return type === 'dragon'
      ? `/dragon/file/view?sign=${sign}&t=${t}&key=${
          params.filePath || params.fileId
        }`
      : `/api/attachment/view?key=${params.filePath || params.fileId}`;
  }

  /**
   * 删除文件
   * @param fileId 文件 id
   * @param isAvenger 是否是采购融资业务，默认为 false
   */
  remove(fileId: string, isAvenger = false) {
    return isAvenger
      ? this.avenger.post(`/file/delete`, { key: fileId })
      : this.api.post(`/attachment/delete`, { key: fileId });
  }
  dragonRemove(fileId: string) {
    return this.dragonApiService.post('/file/delete', { key: fileId });
  }

  /**
   * 下载文件
   * @param files 文件 id
   * @param mainFlowId 流程 id
   * @param isAvenger 是否是采购融资业务，默认为 false
   */
  download(files: any[], mainFlowId?: string, isAvenger = false) {
    const params = { files, mainFlowId };
    if (isAvenger) {
      return this.avenger.download('/file/downFile', params);
    } else {
      return this.api.download('/file/down_file', params);
    }
  }

  /**
   * 根据地址下载单个文件
   * @param file  文件信息
   * @param name 自定义文件名
   * @param type dragon avenger api
   */
  saveFile(
    file: { fileId: string; filePath: string },
    name: string,
    type: string
  ) {
    let url = '';
    if (type === 'dragon') {
      url = this.dragonView(file);
    } else if (type === 'avenger') {
      url = this.view({ ...file, isAvenger: true });
    } else if (type === 'api') {
      url = this.view({ ...file, isAvenger: false });
    }
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    const link = document.createElement('a');
    link.download = name || '文件';
    link.href = url;
    link.dispatchEvent(evt);
  }

  /**
   * 根据地址下载项目assets静态单个文件
   * @param file  文件信息
   * @param name 自定义文件名
   * @param type dragon avenger api
   */
  getAssetsFile(url: string, fileName?: string) {
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    const link = document.createElement('a');
    link.download = fileName || '文件';
    link.href = url;
    link.dispatchEvent(evt);
  }
}

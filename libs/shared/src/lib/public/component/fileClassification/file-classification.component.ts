import { forkJoin, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { XnUtils } from '../../../common/xn-utils';
import { Params, ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { PdfViewService } from '../../../services/pdf-view.service';
import { XnService } from '../../../services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import {
  MediaFileTypeEnum,
  FileNatureChildOptionEnum,
  FileRotateTypeEnum,
  FileScaleTypeEnum,
} from '../../../config/enum';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';
import { NgxViewerDirective } from 'ngx-viewer';

let timeId;

@Component({
  templateUrl: './file-classification.component.html',
  styleUrls: ['./file-classification.component.css'],
  providers: [PdfViewService],
})
export class FileClassificationComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('innerImg') innerImg: ElementRef;
  @ViewChild('outerImg') outerImg: ElementRef;
  @ViewChild('imgContainer') imgContainer: ElementRef;
  @ViewChild('pageNum') pageNum: ElementRef;
  @ViewChild('pageCount') pageCount: ElementRef;
  @ViewChild(NgxViewerDirective) tplViewer!: NgxViewerDirective;
  private readonly zoomRatio = 0.15;
  private readonly rotateAngle = 90;
  // 图片初始缩放倍数
  zoom = 0.85;
  spinning = true;
  viewerOptions = {
    navbar: false,
    inline: true,
    loop: false,
    backdrop: false,
    toolbar: false,
    button: false,
  };
  // 鼠标距离canvas-box左边缘的距离
  restLeft: number;
  // 鼠标距离canvas-box上边缘的距离
  restTop: number;
  private pdfLoadingSubscription!: Subscription;

  pdfPageNum = '';
  private toolTip = new Subject<string>();
  pageTitle = '补充信息';
  tabList = [
    {
      label: '',
      value: '',
    },
  ];
  collapseStyle = ['expand-wrap', ''];
  isEdit: false; // 是否为编辑查看页面
  isAllCollapse = false; // 全部展开/折叠面板开关
  mainFlowId: string; // 交易mainFlowId
  recordId: string; // 交易recordId
  fileList: any[]; // 左侧文件列表
  public degree = 0;
  public currentScale = 1;
  public total: number;
  public pageSize = 1;
  imgIndex: any;
  fileType: MediaFileTypeEnum; // 接收的文件类型
  get fileEnum() {
    return MediaFileTypeEnum;
  }
  fileData: any;
  fileTypeList: any; // 右侧文件配置集合
  product_id: any; // 一级产品ID
  product_name: any; // 一级产品名称
  file_type_name: any; // 一级文件配置名
  file_type_id: any; // 一级文件配置ID
  file_nature_id: any; // 一级文件性质id
  file_nature_name: any; // 一级文件名称
  currentFileType: any; // 当前文件配置
  fileTypeIndex: any; // 当前文件配置索引
  currentOptions = []; // 右侧当前文件类别选项
  fileNatureChildIndex: any; // 下拉选项索引
  file_nature_child_option_name: any; // 二级选择的下拉文件分类选项名称
  file_nature_child_option_id: any; // 二级下拉选中的当前文件分类ID
  rule_collection_code: any; // 二级下拉选中的规则code
  rule_collection_name: any; // 二级下拉选中的规则name
  fileNatureName: any; // 文件选项信息
  fileClassifyCfg = []; // 当前文件分类ID名下规则集合
  fileSrc = ''; // 左侧文件类型为 img 存放url
  file_source_id: String; // 文件来源id
  item_file_classify_id: any[] = []; // 当前分类下的classify_id
  source_file_info: any; // 当前选中的展示文件信息
  cfgIndex: any[] = []; // fileClassifyCfg 索引
  saveParams: { recordId: string; flowId: string; procedureId: string };
  public currentKey=[0,0];
  // 切换文件操作按钮
  showToolIcon = false;

  /** 金额输入框配置 */
  inputMoneyOptions = {
    // 最小值
    minValue: 0,
    // 指定输入框展示值的格式
    formatterPercent: (value: number): string => {
      if(value === 0) {
        return '0'
      } else {
        return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
      }
    },
    // 转换回数字的handle
    parserPercent: (value: string): string => value.replace(/\,/g, ''),
  }
  constructor(
    private pdfViewService: PdfViewService,
    private xn: XnService,
    private router: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ngModal: NzModalService,
    private loading: LoadingService
  ) { }
  ngOnDestroy() {
    // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
    if (this.toolTip) {
      this.toolTip.unsubscribe();
    }
    if (this.pdfLoadingSubscription) {
      this.pdfLoadingSubscription.unsubscribe();
    }
    timeId = null;
    this.pdfViewService.onDestroy();
    const canvas = document.getElementById('thisCanvas') as HTMLCanvasElement;
    const context = canvas?.getContext('2d');
    context?.clearRect(0, 0, canvas.width, canvas.height);
  }
  ngOnInit() {
    this.loading.open();
    this.router.params.subscribe((params: Params) => {
      const mainFlowId = params.id || '';
      this.mainFlowId = mainFlowId;
      forkJoin(
        this.xn.dragon.post('/file_type/loadFileSource', { mainFlowId }),
        this.xn.dragon.post('/file_type/loadFileType', { mainFlowId })
      ).subscribe(([res1, res2]) => {
        this.getFileSource(res1.data);
        this.getFileType(res2.data);
      });
    });
    this.router.queryParams.subscribe((x: any) => {
      this.isEdit = x.isEdit || false;
      this.saveParams = x;
      this.recordId = x.recordId || '';
    });
    this.toolTip
      .pipe(
        debounceTime(1500), // 请求防抖 300毫秒
        distinctUntilChanged() // 节流
      )
      .subscribe((param) => {
        this.displayFilePage(param);
      });
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  /**
   * 处理获取左侧文件详情
   * @param data 该笔交易的 mainFlowId
   */
  getFileSource(data): any {
    const files = [];
    for (let i in data) {
      files.push(this.resolveData(data[i]));
    }
    this.fileList = files;
    this.getCurrentFile(this.fileList[0].multiData[0], 0,0);
  }
  /**
   * 处理获取右侧文件配置
   * @param data 该笔交易的 mainFlowId
   */
  getFileType(data): any {
    this.fileTypeList = data;
    this.tabList = data.map((i) => {
      if (this.file_nature_child_option_id) {
        this.fileTypeList[this.fileTypeIndex].file_nature_child_option_id =
          this.file_nature_child_option_id;
      }
      const item = {
        label: i.file_type_name,
        value: i.file_type_id,
      };
      return item;
    });

    this.choseFileType(this.fileTypeIndex);
  }
  /**
   * 处理返回文件数据
   * @param data
   * @param rawData
   */
  resolveData(data) {
    let obj = data;
    // parse raw Data
    const resFileData = data.fileData ? JSON.parse(data.fileData) : [];
    //
    let fileData = [];
    const multiData = [];
    if (Object.prototype.toString.call(resFileData[0]) === '[object String]') {
      // 文件data是二维数组格式,将文件拼接在一个数组展示
      let subIndex = 0;
      resFileData.forEach((i: any, index: number) => {
        const files = JSON.parse(i);
        files.forEach((subFile: any) => {
          fileData.push(subFile);
          multiData.push({
            fileName: subFile.fileName,
            fileSourceId: obj?.fileSourceId,
            index: subIndex,
            currentClick:false,
            fileType: subFile.filePath.substr(-3).toLowerCase(),
          });
          subIndex++;
        });
      });
      const finalObj = {
        ...obj,
        fileData,
        multiData,
      };
      return finalObj;
    } else {
      fileData = XnUtils.deepClone(resFileData);
      fileData.forEach((subFile: any, subIndex: number) => {
        multiData.push({
          fileName: subFile.fileName,
          fileSourceId: obj?.fileSourceId,
          index: subIndex,
          currentClick:false,
          fileType: subFile.filePath.substr(-3).toLowerCase(),
        });
      });
      const finalObj = {
        ...obj,
        fileData,
        multiData,
      };
      return finalObj;
    }
  }
  /**
   * 获取大类文件
   * @param multiData 文件类中的文件集合
   */
  getFileItem(multiData) {
    const item = multiData[0];
    this.getCurrentFile(item, 0,0);
  }
  /**
   * 获取当前文件信息
   * @param multiDataItem 当前文件数据
   */
  getCurrentFile(multiDataItem: any, key: number,typeIndex:number) {
    this.currentKey[1]=key; //文件索引
    this.currentKey[0]=typeIndex; //当前文件类型的索引
    if (!multiDataItem) {
      this.ngModal.warning({
        nzTitle: '提示',
        nzContent: '当前文件信息为空',
      });
      return;
    }
    const { fileSourceId, index, fileType } = multiDataItem;
    const files = this.fileList.filter((i) => {
      if (i.fileSourceId === fileSourceId) {
        return i.fileData[index];
      }
    });
    const { fileData } = files[0];
    if (fileData.length < 1) {
      this.ngModal.warning({
        nzTitle: '提示',
        nzContent: '当前文件信息没有返回!',
      });
      return;
    }
    // TODO: 这里要做数据处理
    this.source_file_info = fileData[key];
    this.file_source_id = fileSourceId;
    this.fileData = fileData[key];
    this.total = fileData[key].length;
    this.fileType = fileType;
    if (fileType === MediaFileTypeEnum.PDF) {
      const pdfParam = {
        fileId: fileData[key].fileId || '',
        filePath: fileData[key].filePath || '',
      };
      this.clearPdf();
      timeId = setTimeout(() => {
        this.pdfViewService.m_init = false;
        this.spinning = true;
        this.pdfViewService.pdfToCanvas(this.xn.file.dragonView(pdfParam));
        $('#canvas-box').css( "left", `${50}%` );
        $('#canvas-box').css( "transform", `translateX(${-50}%)` );
        this.pdfLoadingSubscription = this.pdfViewService.pdfLoading$.subscribe((spinning: boolean) => {
          this.spinning = spinning;
        });
      });
    } else if (
      fileType === MediaFileTypeEnum.JPG ||
      fileType === MediaFileTypeEnum.PNG
    ) {
      this.changeImg(1);
    }
  }
  private clearPdf() {
    if (timeId) {
      const canvas = document.getElementById('thisCanvas') as HTMLCanvasElement;
      const context = canvas?.getContext('2d');
      context?.clearRect(0, 0, canvas.width, canvas.height);
      clearTimeout(timeId);
      this.pdfViewService.onDestroy();
    }
  }

  /** 防抖函数 */
  debounce(sub) {
    this.toolTip.next(sub);
  }
  /**
   * 点击页码显示对应图片
   * @param sub
   */
  displayFilePage(sub) {
    const fileType = sub.file_info.filePath.substr(-3).toLowerCase();
    this.fileType = fileType;
    const pageIndex = sub.page_index;
    const files = this.fileList.filter((i) => {
      if (i.fileSourceId === sub.file_source_id) {
        return i;
      }
    });
    const { fileData } = files[0];

    if (fileType === MediaFileTypeEnum.PDF) {
      const pdfParam = {
        fileId: sub.file_info.fileId || '',
        filePath: sub.file_info.filePath || '',
      };
      this.clearPdf();
      timeId = setTimeout(() => {
        this.pdfViewService.m_init = false;
        this.pdfViewService.pdfToCanvas(this.xn.file.dragonView(pdfParam));
      });
    } else if (
      fileType === MediaFileTypeEnum.JPG ||
      fileType === MediaFileTypeEnum.PNG ||
      fileType === MediaFileTypeEnum.JPEG
    ) {
      this.changeImg(pageIndex, sub.file_info);
      this.loading.close();
    }

    fileData.map((i, index) => {
      if (sub.file_info.fileId === i.fileId) {
        this.source_file_info = fileData[index];
        this.file_source_id = sub.fileSourceId;
        this.fileData = fileData[index];
        this.total = fileData[index].length;
      }
    });

    // const item = { fileSourceId: sub.file_source_id, index, fileType};
  }
  /**
   * 切换图片
   * @param e 图片索引位置
   */
   changeImg(e: number, fileInfo?: any) {
    // console.log('changeImg', e);
    this.fileSrc = '';
    this.imgIndex = e;
    const imgParam = fileInfo ? fileInfo : this.fileData;
    setTimeout( () => {
      this.fileSrc =  this.xn.file.dragonView(imgParam);
    }, 0);
    this.cdr.markForCheck();
  }
  // 上一份文件
  preFile(){
    if(this.currentKey[1]<=0){
      this.xn.msgBox.open(false,'这是第一份文件');
      this.getCurrentFile(this.fileList[this.currentKey[0]].multiData[0],0,this.currentKey[0]);
    }else{
      this.getCurrentFile(this.fileList[this.currentKey[0]].multiData[this.currentKey[1]-1],this.currentKey[1]-1,this.currentKey[0])
    }
  }
  // 下一份文件
  nextFile(){
    let maxlength=this.fileList[this.currentKey[0]].multiData.length; //当前文件的长度
    if(this.currentKey[1]>=maxlength-1){// 判断如果是最后一份文件
      this.xn.msgBox.open(false,'这是最后一份文件');
      this.getCurrentFile(this.fileList[this.currentKey[0]].multiData[maxlength-1],maxlength-1,this.currentKey[0])
    }else{
      this.getCurrentFile(this.fileList[this.currentKey[0]].multiData[this.currentKey[1]+1],this.currentKey[1]+1,this.currentKey[0])
    }
  }

  /**
   * 上一份文件或pdf翻页
   */
  toPrev(){
    if(this.fileType === this.fileEnum.PDF) {
      // 当前pdf页码
      const pageNum = Number(this.pageNum.nativeElement.innerHTML);
      if(pageNum !== 1) {
        $('#prev').trigger("click");
      } else {
        this.preFile();
      }
    } else {
      this.preFile();
    }
  }

  /**
   * 下一份文件或pdf翻页
   */
  toNext(){
    if(this.fileType === this.fileEnum.PDF) {
      // 当前pdf页码
      const pageNum = Number(this.pageNum.nativeElement.innerHTML);
      // 当前pdf总页码
      const pageCount = Number(this.pageCount.nativeElement.innerHTML);
      if(pageNum < pageCount) {
        $('#next').trigger("click");
      } else {
        this.nextFile();
      }
    } else {
      this.nextFile();
    }
  }

  /**
   *
   * @param index 判断集合分类
   */
  judgedIdType(childOptionId = '') {
    if (childOptionId.indexOf(FileNatureChildOptionEnum.HT_PROJECT) > -1) {
      return FileNatureChildOptionEnum.FK_PROJECT;
    } else if (childOptionId.indexOf(FileNatureChildOptionEnum.HT_TRADE) > -1) {
      return FileNatureChildOptionEnum.FK_TRADE;
    } else if (
      childOptionId.indexOf(FileNatureChildOptionEnum.HT_SERVICE) > -1
    ) {
      return FileNatureChildOptionEnum.FK_SERVICE;
    } else if (
      childOptionId.indexOf(FileNatureChildOptionEnum.ONLINE_ORDER) > -1
    ) {
      return FileNatureChildOptionEnum.ONLINE_ORDER;
    } else {
      return '';
    }
  }
  /**
   * 一级选择: 选择/切换文件配置
   * @param index 文件配置id
   */
  choseFileType(index = 0) {
    const data = this.fileTypeList[index];
    this.fileTypeIndex = index;
    this.currentFileType = data;
    this.isAllCollapse = false;
    this.item_file_classify_id = [];
    this.cfgIndex = [];
    this.item_file_classify_id = [];
    // 一级: 暂存 file_type_name file_type_id product_id product_name ...
    this.file_type_name = data.file_type_name;
    this.file_type_id = data.file_type_id;
    this.file_nature_id = data.file_nature_id;
    this.file_nature_name = data.file_nature_name;
    this.product_id = data.product_id;
    this.product_name = data.product_name;
    this.fileClassifyCfg = [];
    let childOptionId = '';
    /** OLD */
    if (index === 1) {
      // 记录前个面板的child option id
      const beforeChildOption = this.judgedIdType(
        this.file_nature_child_option_id
      );
      // 判断规则集属于哪个分类
      this.currentOptions = data.fileNatureChildOptions.map((i) => {
        if (!!i.mainFlowId) {
          this.changeFileChildType(i.file_nature_child_option_id);
          const item = {
            label: i.file_nature_child_option_name,
            value: i.file_nature_child_option_id,
          };
          return item;
        } else {
          const optionId = i.file_nature_child_option_id;
          if (optionId.indexOf(beforeChildOption) > -1) {
            const item = {
              label: i.file_nature_child_option_name,
              value: i.file_nature_child_option_id,
            };
            this.file_nature_child_option_id =
              this.fileTypeList[index].file_nature_child_option_id || '';
            this.file_nature_child_option_name =
              this.fileTypeList[index].file_nature_child_option_name || '';
            this.rule_collection_code =
              this.fileTypeList[index].rule_collection_code || '';
            this.rule_collection_name =
              this.fileTypeList[index].rule_collection_name || '';
            this.fileClassifyCfg = [];
            childOptionId = this.file_nature_child_option_id;
            return item;
          }
        }
      });
    } else {
      this.currentOptions = data.fileNatureChildOptions.map((i) => {
        if (!!i.mainFlowId) {
          this.changeFileChildType(i.file_nature_child_option_id);
        } else {
          this.file_nature_child_option_id =
            this.fileTypeList[index].file_nature_child_option_id || '';
          this.file_nature_child_option_name =
            this.fileTypeList[index].file_nature_child_option_name || '';
          this.rule_collection_code =
            this.fileTypeList[index].rule_collection_code || '';
          this.rule_collection_name =
            this.fileTypeList[index].rule_collection_name || '';
          childOptionId = this.file_nature_child_option_id;
        }
        const item = {
          label: i.file_nature_child_option_name,
          value: i.file_nature_child_option_id,
        };
        return item;
      });
    }
    this.currentOptions = this.currentOptions.filter((i) => i?.label);
    if (childOptionId !== '') {
      this.changeFileChildType(childOptionId);
    }
  }
  /**
   * 二级选择: 下拉选择文件分类信息
   * @param file_nature_child_option_id 下拉选中的分类id
   */
  changeFileChildType(file_nature_child_option_id) {
    if (!file_nature_child_option_id) {
      return;
    }
    let fileClassifyCfg = null;
    this.cfgIndex = [];
    this.item_file_classify_id = [];
    this.currentFileType.fileNatureChildOptions.forEach((i, index) => {
      if (i.file_nature_child_option_id === file_nature_child_option_id) {
        this.fileNatureChildIndex = index;
        /**
         * 二级: 暂存
         * file_nature_child_option_name
         * file_nature_child_option_id
         * rule_collection_code
         * rule_collection_name
         */
        this.fileTypeList[this.fileTypeIndex].file_nature_child_option_id =
          i.file_nature_child_option_id;
        this.fileTypeList[this.fileTypeIndex].file_nature_child_option_name =
          i.file_nature_child_option_name;
        this.fileTypeList[this.fileTypeIndex].rule_collection_code =
          i.rule_collection_code;
        this.fileTypeList[this.fileTypeIndex].rule_collection_name =
          i.rule_collection_name;
        this.fileTypeList[this.fileTypeIndex].is_generate_contract = i.is_generate_contract;

        this.file_nature_child_option_id = i.file_nature_child_option_id;
        this.file_nature_child_option_name = i.file_nature_child_option_name;
        this.rule_collection_code = i.rule_collection_code;
        this.rule_collection_name = i.rule_collection_name;
        fileClassifyCfg = i.fileClassifyCfg.map((i) => {
          const item = {
            ...i,
            isCollapse: false,
            isSelect: false,
          };
          // 处理日期格式为后端规定的: yyyymmdd 格式
          item.indexItemList.map((i) => {
            if (i.data_type === 'date') {
              i.index_value = XnUtils.reverseFormateDate(i.index_value);
            }
            return i;
          });
          item.manualApprovalStandardList.map((i) => {
            // if (
            //   i.check_status === 0 ||
            //   !i.check_status ||
            //   (item.classifyResultList.length > 0 &&
            //     item.is_property_necessary !== 1)
            // ) {
            //   i.check_status = false;
            // } else {
            //   i.check_status = true;
            // }
            i.check_status = i.check_status === 0 ? false : true;
            return i;
          });
          item.classifyResultList.map((i) => {
            if (i.file_info !== '' && typeof i.file_info === 'string') {
              i.file_info = JSON.parse(i.file_info);
            }
          });
          return item;
        });
      }
    });
    const beforeChildOptionId = this.judgedIdType(
      this.fileTypeList[0].file_nature_child_option_id
    );
    if (
      this.fileTypeIndex === 1 &&
      file_nature_child_option_id.indexOf(beforeChildOptionId) === -1
    ) {
      this.fileClassifyCfg = [];
    } else {
      this.fileClassifyCfg = fileClassifyCfg;
    }
  }
  /**
   * 展开/折叠单个面板
   * @param item item中的折叠开关字段
   */
  collapasePannel(item: any, index: number) {
    this.fileClassifyCfg[index].isCollapse = !item.isCollapse;
  }
  /**
   * 展开/折叠所有面板
   */
  toggleAllCollapse() {
    this.isAllCollapse = !this.isAllCollapse;
    this.fileClassifyCfg.forEach((i) => {
      i.isCollapse = this.isAllCollapse;
    });
  }

  /**
   *
   * @param item 点选分类类别
   * @param key
   */
  targetClassify(item, key) {
    if (item.isSelect) {
      this.item_file_classify_id.push(item.file_classify_id);
      this.cfgIndex.push(key);
    } else if (!item.isSelect) {
      for (let i in this.item_file_classify_id) {
        if (this.item_file_classify_id[i] === item.file_classify_id) {
          this.item_file_classify_id.splice(+i, 1);
        }
      }
      for (let i in this.cfgIndex) {
        if (this.cfgIndex[i] === key) {
          this.cfgIndex.splice(+i, 1);
        }
      }
    }
  }
  handleEmitOK(res) {
    const {
      is_generate_contract,
      file_classify_name,
      indexNames,
      standardNames,
    } = res;
    const cfgItem = {
      file_classify_name,
      isPropertyNecessary: 0,
      is_manual_config: 1, // 手工新增的类别,该字段为1
      manualApprovalStandardList: standardNames.map((i) => {
        const item = {
          standard_name: i,
          file_classify_id: '',
          memo: '',
          check_status: false,
        };
        return item;
      }),
      indexItemList: indexNames.map((i) => {
        const item = {
          id: 1,
          index_name: i,
          file_classify_id: '',
          disabled_tag: 0,
          memo: '',
          index_code: '',
          index_value: '',
          mapping_field: '',
        };
        return item;
      }),
      classifyResultList: [],
      isCollapse: false,
      isSelect: false,
      is_generate_contract,
    };
    this.fileClassifyCfg.push(cfgItem);
    // 更新至对应的对象里
    this.fileTypeList[this.fileTypeIndex].fileNatureChildOptions[
      this.fileNatureChildIndex
    ].fileClassifyCfg = this.fileClassifyCfg;
    this.postAddFileClassify(cfgItem);
  }
  postAddFileClassify(cfgItem) {
    const rawData = XnUtils.deepClone(cfgItem);
    const extraData = {
      product_id: this.product_id,
      product_name: this.product_name,
      file_type_id: this.file_type_id, // 文件类型id
      file_type_name: this.file_type_name, // 文件类型名称
      file_nature_id: this.file_nature_id, // 文件性质id
      file_nature_name: this.file_nature_name, // 文件性质名称
      file_nature_child_option_id: this.file_nature_child_option_id, // 文件性质子选项id
      file_nature_child_option_name: this.file_nature_child_option_name, // 文件性质子选项名称
      rule_collection_code: this.rule_collection_code, // 规则集code
      rule_collection_name: this.rule_collection_name, // 规则集名称
      mainFlowId: this.mainFlowId,
    };
    let postData = XnUtils.deepClone(Object.assign(rawData, extraData));
    // 额外处理 字段
    postData.indexNames = rawData.indexItemList.map((i) => i.index_name);
    postData.standardNames = rawData.manualApprovalStandardList.map(
      (i) => i.standard_name
    );
    // 删除不需要传输的对象
    postData = _.omit(postData, [
      'indexItemList',
      'manualApprovalStandardList',
    ]);
    this.xn.dragon.post('/file_type/addFileClassify', postData).subscribe(
      (res) => {
        if (res.ret === 0) {
          this.file_nature_child_option_id =
            this.fileTypeList[this.fileTypeIndex].file_nature_child_option_id ||
            '';
          this.file_nature_child_option_name =
            this.fileTypeList[this.fileTypeIndex]
              .file_nature_child_option_name || '';
          this.rule_collection_code =
            this.fileTypeList[this.fileTypeIndex].rule_collection_code || '';
          this.rule_collection_name =
            this.fileTypeList[this.fileTypeIndex].rule_collection_name || '';
          this.xn.dragon
            .post('/file_type/loadFileType', {
              mainFlowId: this.mainFlowId,
            })
            .subscribe((res) => {
              if (res.ret === 0) {
                this.getFileType(res.data);
              }
            });
          this.ngModal.success({
            nzTitle: '提示',
            nzContent: '添加类别成功',
          });
        } else {
          this.ngModal.warning({
            nzTitle: '提示',
            nzContent: res.data,
          });
        }
      },
      (err) => {
        this.ngModal.warning({
          nzTitle: '提示',
          nzContent: '接口错误',
        });
      }
    );
  }
  /**
   * 确认删除分类类别
   */
  confirmDelFileClassify() {
    const hasSelect = this.fileClassifyCfg.filter((i) => i.isSelect);
    if (hasSelect.length === 0) {
      this.ngModal.warning({
        nzTitle: '提示',
        nzContent: '请先选择需要删除的分类类别',
      });
      return;
    }
    this.ngModal.confirm({
      nzTitle: '提示',
      nzContent: '是否确定删除所选类别?',
      nzOnOk: () => {
        this.delFileClassify(hasSelect);
      },
    });
  }
  /**
   * 删除分类类别
   */
  delFileClassify(hasSelect) {
    // const hasSelect = this.fileClassifyCfg.filter((i) => i.isSelect);
    if (hasSelect.length === 0) {
      this.ngModal.warning({
        nzTitle: '提示',
        nzContent: '请先选择需要删除的分类类别',
      });
      return;
    }
    for (let i in this.fileClassifyCfg) {
      for (let j in hasSelect) {
        if (hasSelect[j].is_manual_config !== 1) {
          this.ngModal.warning({
            nzTitle: '提示',
            nzContent: '不能删除默认文件类别',
          });
          this.fileClassifyCfg[i].isSelect = false;
          hasSelect[j] = {};
          return;
        }
        if (
          this.fileClassifyCfg[i].file_classify_name ===
          hasSelect[j].file_classify_name
        ) {
          this.fileClassifyCfg.splice(Number(i), 1);
          this.fileTypeList[this.fileTypeIndex].fileNatureChildOptions[
            this.fileNatureChildIndex
          ].fileClassifyCfg = this.fileClassifyCfg;
        }
      }
    }
    this.deleteFileClassify(hasSelect.map((i) => i.file_classify_id));
  }
  /**
   * 删除分类类别信息接口
   * @param infoIds 删除的数据
   */
  deleteFileClassify(infoIds) {
    if (infoIds.length < 1) {
      this.ngModal.success({
        nzTitle: '提示',
        nzContent: '删除成功',
      });
      return;
    }
    const params = {
      mainFlowId: this.mainFlowId,
      ids: infoIds,
    };
    this.xn.dragon.post('/file_type/deleteFileClassify', params).subscribe(
      (res) => {
        if (res.ret === 0) {
          this.xn.dragon
            .post('/file_type/loadFileType', {
              mainFlowId: this.mainFlowId,
            })
            .subscribe((res) => {
              if (res.ret === 0) {
                this.getFileType(res.data);
              }
            });
          this.ngModal.success({
            nzTitle: '提示',
            nzContent: '删除成功',
          });
        }
      },
      () => {
        this.xn.dragon
          .post('/file_type/loadFileType', {
            mainFlowId: this.mainFlowId,
          })
          .subscribe((res) => {
            if (res.ret === 0) {
              this.getFileType(res.data);
            }
          });
      }
    );
  }
  /**
   * 标记/分割文件
   */
  splitCurFile() {
    if (this.item_file_classify_id.length < 1) {
      this.ngModal.warning({
        nzTitle: '提示',
        nzContent: '请先点选需要标记的分类类别',
      });
      return;
    }
    const param = {
      mainFlowId: this.mainFlowId,
      product_id: this.product_id,
      file_classify_id: this.item_file_classify_id,
      file_source_id: this.file_source_id,
      // TODO:
      page_index:
        this.fileType !== 'pdf'
          ? this.imgIndex
          : +this.pageNum.nativeElement.innerHTML,
      source_file_info: this.source_file_info,
      file_type_id: this.file_type_id,
      file_nature_id: this.file_nature_id,
      file_nature_child_option_id:
        this.fileTypeList[this.fileTypeIndex].file_nature_child_option_id,
    };
    this.xn.dragon.post('/file_type/splitFile', param).subscribe((res) => {
      if (res.ret === 0) {
        const resData = res.data;
        this.item_file_classify_id.forEach((i) => {
          this.fileClassifyCfg.forEach((j) => {
            if (j.file_classify_id === i) {
              j.classifyResultList = [];
            }
          });
        });
        this.fileClassifyCfg.forEach((j) => {
          resData.forEach((i) => {
            if (i.file_classify_id === j.file_classify_id) {
              let file_info = null;
              if (i.file_info !== '' && typeof i.file_info === 'string') {
                file_info = JSON.parse(i.file_info);
              }
              const item = {
                ...i,
                file_info,
              };
              j.classifyResultList.push(item);
            }
          });
        });
        this.fileTypeList[this.fileTypeIndex].fileNatureChildOptions.forEach(
          (i) => {
            if (
              this.file_nature_child_option_id === i.file_nature_child_option_id
            ) {
              i.fileClassifyCfg = this.fileClassifyCfg;
            }
          }
        );
      }
    });
  }
  /**
   * 确认删除类别
   */
  confirmClearInfos() {
    this.ngModal.confirm({
      nzTitle: '提示',
      nzContent: '确认清除所有信息?',
      nzOnOk: () => {
        this.clearManualInfo().then((res) => {
          this.deleteFileClassify(res);
        });
      },
    });
  }
  /**
   * 清除所有录入信息
   */
  clearManualInfo() {
    return new Promise((resolve) => {
      let ids = [];
      this.fileClassifyCfg.forEach(async (item, key) => {
        if (item.is_manual_config === 1) {
          ids.push(item.file_classify_id);
        }
        item.indexItemList = item.indexItemList.map((subItem) => {
          subItem.index_value = '';
          return subItem;
        });
        item.manualApprovalStandardList = item.manualApprovalStandardList.map(
          (subItem) => {
            subItem.check_status = false;
            return subItem;
          }
        );
        await item.classifyResultList.map((subitem, i) => {
          this.deleteClassifyInfo(subitem, i, key, true);
        });
        resolve(ids);
      });
      this.fileTypeList[this.fileTypeIndex].fileNatureChildOptions[
        this.fileNatureChildIndex
      ].fileClassifyCfg = this.fileClassifyCfg;
    });
  }
  /**
   * 删除分类类别中的 classifyItem
   * @param item 表格项
   * @param index 表格项索引
   * @param key 父对象索引
   * @param isAll 是否清除所有项标识
   */
  deleteClassifyInfo(item, index, key, isAll) {
    let ids = [];
    if (isAll) {
      ids = this.fileClassifyCfg[key].classifyResultList.map(
        (subitem) => subitem.id
      );
    }
    // if (this.fileClassifyCfg[key].classifyResultList.length < 1) {
    //   this.getFileType(this.mainFlowId);
    //   return;
    // }
    this.xn.dragon
      .post('/file_type/deleteClassifyInfo', {
        mainFlowId: this.mainFlowId,
        ids: isAll ? ids : [item.id],
      })
      .subscribe((res) => {
        if (res.ret === 0) {
          if (isAll) {
            this.fileClassifyCfg[key].classifyResultList = [];
          } else {
            this.fileClassifyCfg[key].classifyResultList.splice(+index, 1);
          }
          // if (this.fileClassifyCfg[key].classifyResultList.length < 1) {
          //   this.getFileType(this.mainFlowId);
          // }
        }
      });
  }
  /**
   * 保存前做必填校验
   * @param isValidate 是否做校验规则
   */
  validateInfo(isValidate: boolean): any {
    const fileInfo = XnUtils.deepClone(this.fileTypeList);
    const validateArr = [];
    const fileTypeList = fileInfo.map((i) => {
      let fileClassifyData = [];
      i.fileNatureChildOptions.forEach((k) => {
        if (k.file_nature_child_option_id === i.file_nature_child_option_id) {
          k.fileClassifyCfg.forEach((j) => {
            const subItem = {
              ...j,
              file_type_id: i.file_type_id,
              file_type_name: i.file_type_name,
              file_nature_id: i.file_nature_id,
              file_nature_name: i.file_nature_name,
              file_classify_id: j.file_classify_id,
              file_classify_name: j.file_classify_name,
              file_nature_child_option_id: i.file_nature_child_option_id,
              file_nature_child_option_name: i.file_nature_child_option_name,
              rule_collection_code: i.rule_collection_code,
              rule_collection_name: i.rule_collection_name,
            };
            subItem.manualApprovalStandardList.map((e) => {
              e.check_status = e.check_status ? true : false;
              e.file_type_id = i.file_type_id;
              e.file_nature_id = i.file_nature_id;
              e.file_nature_child_option_id = i.file_nature_child_option_id;
              return e;
            });
            subItem.indexItemList.map((e) => {
              e.file_type_id = i.file_type_id;
              e.file_nature_id = i.file_nature_id;
              e.file_nature_child_option_id = i.file_nature_child_option_id;
              if (e.data_type === 'date' && e.index_value) {
                // TODO: 做日期格式转换
                e.index_value = XnUtils.formatDate(e.index_value, true);
              }
              if(e.data_type === 'money' && e.index_value) {
                e.index_value = Number(e.index_value);
              }
              return e;
            });
            fileClassifyData.push(subItem);
          });
        }
      });

      if (isValidate) {
        for (let j in fileClassifyData) {
          if (fileClassifyData[j].is_property_necessary === 1) {
            const indexItemList = fileClassifyData[j].indexItemList;
            for (let i in indexItemList) {
              if (
                indexItemList[i].index_value === '' ||
                indexItemList[i].index_value === undefined
                // indexItemList[i].disabled_tag === 1
              ) {
                validateArr.push({
                  isValidate: false,
                  file_classify_name: fileClassifyData[j].file_classify_name,
                  ...indexItemList[i],
                });
              }
            }
          }
        }
      }
      let item = {
        file_type_id: i.file_type_id,
        file_type_name: i.file_type_name,
        file_nature_id: i.file_nature_id,
        file_nature_name: i.file_nature_name,
        file_nature_child_option_id: i.file_nature_child_option_id,
        file_nature_child_option_name: i.file_nature_child_option_name,
        rule_collection_code: i.rule_collection_code,
        rule_collection_name: i.rule_collection_name,
        // FIXME: is_generate_contract 字段改为用接口返回值
        is_generate_contract: i.is_generate_contract,
        product_id: i.product_id,
        product_name: i.product_name,
        fileClassifyData,
      };
      return item;
    });

    if (validateArr.length > 0) {
      return validateArr;
    } else {
      return fileTypeList.filter(
        (i) => i.file_nature_child_option_id !== undefined
      );
    }
  }
  /**
   * 保存文件分类的信息
   */
  async saveFileSort(isValidate) {
    const fileTypeList = await this.validateInfo(isValidate);
    if (fileTypeList.find((i) => i.isValidate === false) && isValidate) {
      const template2 = fileTypeList.map((i, index) => {
        return `<p>${index + 1}:${
          i.file_classify_name + '->' + i.index_name
          }</P>`;
      });
      this.ngModal.warning({
        nzTitle: '提示:请完善以下必填信息',
        nzContent: ''.concat(...template2),
      });
      return;
    }

    const params = {
      mainFlowId: this.mainFlowId,
      product_id: this.product_id,
      product_name: this.product_name,
      save_type: isValidate ? 1 : 0,
      fileTypeList,
      ...this.saveParams,
    };
    this.xn.dragon.post('/file_type/saveFileSort2', params).subscribe((res) => {
      if (res.ret === 0) {
        this.ngModal.success({
          nzTitle: '提示',
          nzContent: isValidate ? '提交成功' : '保存成功',
          nzOnOk: () => {
            this.routerBack();
          },
        });
      }
    });
  }

  /**
   * 选中当前项check_status
   * @param key 父项index
   * @param subKey 当前项index
   * @param check_status 当前项 status
   */
  changeThisStatus(key, subKey, check_status) {
    this.fileClassifyCfg[key].manualApprovalStandardList[subKey].check_status =
      check_status;
  }
  /**
   * 设置为空
   * @param key 父项index
   * @param subKey 当前项index
   * @param index_value 当前项 value
   */
  setToNull(key, subKey, index_value) {
    this.fileClassifyCfg[key].indexItemList[subKey].index_value =
      index_value === null ? '' : null;
  }
  routerBack() {
    if(window.history.length > 1){
      this.xn.user.navigateBack();
    } else {
      this.xn.router.navigate([`vanke/record/todo/edit/${this.recordId}`])
    }
  }

  /**
   *  文件旋转
   * @param val 旋转方向 left:左转，right:右转
   */
  public rotateImg(val: string) {
    if (this.fileType !== this.fileEnum.PDF) {
      this.degree =
       val === FileRotateTypeEnum.LEFT ? this.degree - this.rotateAngle : this.degree + this.rotateAngle;
      this.tplViewer.instance.rotateTo(this.degree);
    }
  }

  /**
   *  文件缩放
   * @param params 放大缩小  large:放大，small:缩小
   */
  public scaleImg(params: string) {
    if (this.fileType !== this.fileEnum.PDF) {
      this.zoom =
       params === FileScaleTypeEnum.LARGE ? this.zoom + this.zoomRatio : this.zoom - this.zoomRatio;
      this.viewerZoom();
    }
  }

  public onViewerViewed() {
    this.zoom = 0.7;
    this.viewerZoom();
  }

  /**
   * 图片缩放
   */
  public viewerZoom() {
    if (this.fileType !== this.fileEnum.PDF) {
      this.tplViewer.instance.zoomTo(this.zoom);
    }
  }

  public checkSrc(src: any) {
    return src !== '/' && src !== null && src !== '';
  }

  /**
   * 鼠标移动
   * @param e Mousemove Event
   */
  public onMousemove(e: any){
    //计算出left值和top值
    let boxLeft = e.clientX - this.restLeft - $('#thisCanvas1').offset().left;
    let boxTop = e.clientY - this.restTop - $('#thisCanvas1').offset().top;
    if(this.restLeft && this.restTop){
      //设置left，top值
      $('#canvas-box').css( "left", `${boxLeft}px` );
      $('#canvas-box').css( "transform", `translateX(${0})` );
      $('#canvas-box').css( "top", `${boxTop}px` );
    }
  }

  /**
   * 按下鼠标开始拖动
   * @param e Event
   */
  public onMousedown(e: any){
    //计算出鼠标按下的点到canvas-box的左侧边缘和上侧边缘距离
    this.restLeft = e.clientX - $('#canvas-box').offset().left;
    this.restTop = e.clientY  - $('#canvas-box').offset().top;
  }

  /**
   * 松开鼠标结束拖动
   * @param e Event
   */
  public onMouseup(e: any){
    this.restLeft = 0;
    this.restTop = 0;
  }

  /**
   * 鼠标滚动 放大/缩小pdf
   * @param e WheelEvent
   */
  onWheelScroll(e: any){
    e.preventDefault();
    const delta = e.wheelDelta;
    if(delta > 0){
      // 向上滚,放大
      $("#large").trigger("click");
    } else {
      // 向下滚,缩小
      $("#small").trigger("click");
    }
  }

  /**
   * 指标 ‘设置为空’ 状态判断
   * @param indexValue 指标值
   * @returns
   */
  isNullValue(indexValue: any): boolean {
    return indexValue === null;
  }

  /**
   * 输入框内容去除前后空格
   * @param e Event
   * @param indexItem 指标分类
   */
  trimValue(e: any, indexItem: any){
    if(e.target.value){
      e.target.value = e.target.value.trim();
      indexItem.index_value = indexItem.index_value.trim();
    }
  }

  /**
   * 鼠标移入文件区域
   * @param e Event
   */
  onMouseEnterFile(e: any){
    this.showToolIcon = true;
  }

  /**
   * 鼠标移出文件区域
   * @param e Event
   */
  onMouseLeaveFile(e: any){
    this.showToolIcon = false;
  }

  /**
   * 汇融文件问题反馈
   */
  feedbackDocument() {
    const url = `${window.location.origin}/console/manage/vanke-document-feedback?mainFlowId=${this.mainFlowId}`;
    window.open(url, '_blank');
  }

  /**
   * 文件来源
   * @returns
   */
  getVankeFileSource(): string {
    if(this.fileData) {
      const { isVanke } = this.fileData;
      return isVanke ? '万科汇融' : '供应商文件'
    } else {
      return '';
    }
  }
}

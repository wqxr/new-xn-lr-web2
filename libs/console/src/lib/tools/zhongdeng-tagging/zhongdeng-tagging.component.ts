import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-zhongdeng-tagging',
  templateUrl: './zhongdeng-tagging.component.html',
  styles: [
    ` .tagstyle {
      width: 120px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      border: 1px solid #ccc;
    }
    .divtype{
      width:57%;
    }
    textarea:select{
        color: red;
        background: yellow ;
    }
    .editor{
      height: 800px;
      clear: both;
      border: 1px solid #ccc;
      margin: 15px;
      overflow-y: scroll;
      font-size:14px;
      width:99%;
      word-break: break-all;
    }
    .xn-control-label{
      font-size: 13px;
      color: #353535;
      padding-top: 7px;
      text-align: right;
    }
    .regis{
      display: flex;
      width: 400px;
      padding-left: 15px;
      align-items: center;
      margin-right: 40px;
    }
    .regis span{
      font-size:16px;
    }
    .divtype span{
      font-size:16px;
    }
    `
  ]
})
export class ZhongdengTaggingComponent implements OnInit, AfterViewInit {
  public pageTitle = '中登标注';
  @ViewChild('text') text: ElementRef;
  @ViewChild('text1') text1: ElementRef;
  public currentIndex = 0;
  public registerConfirmNumber = ''
  public zhongdengType: ZhongDengType[] = [
    {
      name: '特殊类别',
      color: 'default',
      clickColor: '#cd201f',
      checked: false,
      preText: '',
      afterText: '',
    },
    {
      name: '发票号码',
      clickColor: '#87d068',
      color: 'default',
      checked: false,
      preText: '',
      afterText: '',
    },
    {
      name: '合同编号',
      clickColor: 'rgb(2,125,180)',
      color: 'default',
      checked: false,
      preText: '',
      afterText: '',
    },
    {
      name: '合同名称',
      clickColor: 'rgb(184,116,26)',
      color: 'default',
      checked: false,
      preText: '',
      afterText: '',
    },
    {
      name: '债务人',
      clickColor: 'rgb(132,0,255)',
      color: 'default',
      checked: false,
      preText: '',
      afterText: '',
    },
    {
      name: '单笔资产描述段落',
      clickColor: 'grey',
      color: 'default',
      checked: false,
      preText: '',
      afterText: '',
    },
  ];
  public annotateData: AnnotateData[] = [];
  private copynews = this.zhongdengType;
  public self = this;
  public shows: any[] = [];
  public mainForm: FormGroup;
  public isFirstClick = false;

  constructor(private cdr: ChangeDetectorRef, private xn: XnService
  ) {
  }

  ngOnInit(): void {
    this.shows.push({
      checkerId: 'fontSize',
      required: false,
      type: 'select',
      title: '字号',
      options: { ref: 'fontSize' },
      value: '14'
    });
    this.buildChecker(this.shows);
    this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    this.mainForm.get('fontSize').valueChanges.subscribe(x => {
      this.self.text.nativeElement.style.fontSize = x + 'px';
    });

  }
  /**
   * 下载使用说明文档
   */
  downLoadTemp() {
    const a = document.createElement('a');
    a.href = '/assets/lr/doc/zhongdeng/中登NLP数据标注操作说明.pdf';
    a.target = '_blank';
    a.click();
  }
  checkChange(e: boolean, item: ZhongDengType, index: number): void {
    if (this.self.text.nativeElement.innerText !== '' && !this.isFirstClick) {
      $(this.self.text.nativeElement).attr('contenteditable', false);
      this.copynews[index].afterText = this.self.text.nativeElement.innerText;
      this.zhongdengType.forEach((x, index1) => {
        this.copynews[index1].preText = this.self.text.nativeElement.innerText;
      });
      this.self.text.nativeElement.innerHTML = this.self.text.nativeElement.innerText;
      this.isFirstClick = true;
    }
    this.zhongdengType = JSON.parse(JSON.stringify(this.copynews));
    if (e === true) {
      this.zhongdengType[index].color = this.zhongdengType[index].clickColor;
      this.zhongdengType[index].checked = true;
      this.currentIndex = index;
      this.self.text.nativeElement.innerHTML =
        this.zhongdengType[index].afterText !== '' ? this.zhongdengType[index].afterText : this.zhongdengType[index].preText;

    }

  }
  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }


  getText1() {
    if (this.self.text.nativeElement.innerText !== '' && !this.isFirstClick) {
      $(this.self.text.nativeElement).attr('contenteditable', false);
      this.self.text.nativeElement.innerHTML = this.self.text.nativeElement.innerText;
      this.isFirstClick = true;
    }
    const selecter = window.getSelection();
    const selectStr = selecter.toString();
    const selRange = selecter.getRangeAt(0);
    const clone = selRange.cloneRange();
    this.zhongdengType.forEach((x, index) => {
      this.copynews[index].preText = this.self.text.nativeElement.innerText;
    });
    if (selectStr !== '') {

      let starts = 0;
      if (selRange.startContainer.previousSibling === null) { // 当前标记处之前没有被标记的内容
        starts = selRange.startOffset;
        // 当前标记处之前有被标记的内容,标记之后也有标记内容
      } else if (selRange.startContainer.nextSibling?.nodeName === 'SPAN' && selecter.anchorNode.previousSibling?.nodeName === 'SPAN') {
        for (let i = 0; i < selRange.startContainer.parentNode.childNodes.length - 1; i++) {
          const getCurrent = selRange.startContainer.parentNode.childNodes[i];
          if (getCurrent.nodeValue !== selRange.startContainer.nodeValue) {
            if (getCurrent.nodeName === '#text') {
              starts += getCurrent.nodeValue.length;
            } else if (getCurrent.nodeName === 'SPAN') {
              const nn = getCurrent.childNodes[0].nodeValue.length;
              starts += nn;
            }
          } else {
            break;
          }
        }
        starts += selRange.startOffset;
        // 当前标记处之前有被标记的内容 ，标记之后没有标记内容
      } else {
        for (let i = 0; i < selRange.startContainer.parentNode.childNodes.length - 1; i++) {
          const nodeNames = selRange.startContainer.parentNode.childNodes[i];
          if (nodeNames.nodeName === '#text') {
            starts += nodeNames.nodeValue.length;
          } else if (nodeNames.nodeName === 'SPAN') {
            const nn = nodeNames.childNodes[0].nodeValue.length;
            starts += nn;
          }
        }
        starts += selRange.startOffset;
      }
      const checkEnds = starts + selectStr.length - 1;
      // 判断此时的标记重叠的部分是与后面标记处重叠
      let isSamecheck = true;
      this.annotateData.forEach(x => {
        if ((starts <= x.startPos && checkEnds >= x.startPos && x.type === this.currentIndex + 1)) {
          isSamecheck = false;
        }
      });
      const divText = this.self.text.nativeElement.innerText;
      //  标记重复文本
      if (!(selecter.anchorNode.previousSibling === null
        && selecter.anchorOffset === 0 && divText.substring(0, selecter.focusOffset) !== selectStr)) {
        // 判断标记重叠的部分与前面标记处重叠
        if ((divText.substr(starts, selectStr.length) === selectStr)) {
          if (isSamecheck) {
            const oDiv = document.createElement('span');
            try {
              oDiv.style.backgroundColor = this.zhongdengType.filter(x => x.checked === true)[0].color;
              oDiv.style.color = 'white';
              oDiv.id = starts + '-' + this.currentIndex;
            } catch (error) {
              this.xn.msgBox.open(false, '标记请选择类别');
              return;
            }
            oDiv.innerHTML = selectStr;
            this.annotateData.push(
              {
                text: selectStr,
                startPos: starts,
                endPos: checkEnds,
                type: this.currentIndex + 1
              });
            try {
              clone.surroundContents(oDiv);
            } catch (error) {
            }
            this.cdr.markForCheck();

          }
          this.zhongdengType.forEach((x, index) => {
            this.copynews[index].preText = this.self.text.nativeElement.innerText;
            if (x.checked === true) {
              this.copynews[index].afterText = this.self.text.nativeElement.innerHTML;
              this.copynews[index].preText = this.self.text.nativeElement.innerHTML;
            }
          });
        }
      }


    }
    const oSpan = this.text.nativeElement.children;
    for (let i = 0; i < oSpan.length; i++) {
      oSpan[i].onclick = (e) => {
        const starts = Number(e.target.id.split('-')[0]);
        $(e.target).prop('outerHTML', e.target.innerText);
        this.annotateData = _.reject(this.annotateData, { text: e.target.innerText, type: this.currentIndex + 1, startPos: starts });
        // this.self.text.nativeElement.innerHTML = this.self.text.nativeElement.innerHTML.replace(e.target.outerHTML, e.target.outerText);
        this.copynews[this.currentIndex].afterText = this.self.text.nativeElement.innerHTML;
      };
    }
  }

  submit() {
    if (this.registerConfirmNumber === '') {
      this.xn.msgBox.open(false, '请输入登记证明编号');
      return;
    }
    this.xn.api.dragon.post('/zhongdeng/zd/zdAnnotate',
      {
        annotateData: this.annotateData, registerConfirmNumber: this.registerConfirmNumber,
        textContent: this.self.text.nativeElement.innerText
      }).subscribe(x => {
        if (x.ret === 0) {
          this.xn.msgBox.open(true, '中登标注成功！', () => {
            this.clearText();
            this.registerConfirmNumber = '';
          });
        }

      });
  }

  ngAfterViewInit() {
  }
  // 清除文本内容
  clearText() {
    this.isFirstClick = false;
    this.self.text.nativeElement.innerHTML = '';
    $(this.self.text.nativeElement).attr('contenteditable', 'plaintext-only');
    this.annotateData = [];
    this.copynews.forEach(x => {
      x.afterText = '';
      x.preText = '';
    });

  }


}
interface ZhongDengType {
  name: string;
  color: string;
  clickColor: string;
  checked: boolean;
  preText: string;
  afterText: string;
}
interface AnnotateData {
  text: string;
  startPos: number;
  endPos: number;
  type: number;
}

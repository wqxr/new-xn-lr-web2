import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { JsonUtils } from "./parseJson";
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { isString } from 'util';
declare var $: any;

@Component({
  selector: 'xn-json-show',
  templateUrl: './json-show.component.html',
  styleUrls: ['./json-show.component.css']
})
export class JsonShowComponent implements OnInit {
  @Input() value: any;
  @ViewChild('jsonPre') jsonPre: ElementRef<any>;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    try{
      let json = XnUtils.parseObject(this.value, {});
      $(this.jsonPre.nativeElement).html(JsonUtils.jsonShowFn(json));   //json为要展示到页面的数据
    }catch(ex){
      $(this.jsonPre.nativeElement).html(this.value);
    }


  }

}

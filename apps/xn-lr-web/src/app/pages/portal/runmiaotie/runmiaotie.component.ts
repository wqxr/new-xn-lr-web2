import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../shared/services/store.service';

@Component({
  selector: 'app-runmiaotie',
  templateUrl: './runmiaotie.component.html',
  styleUrls: ['./runmiaotie.component.less']
})
export class RunmiaotieComponent implements OnInit {
  
  style: any = {
    'background-image': "url(assets/images/banner/banner-runmiaotie-detail.png)",
    height: "670px"
  };
  constructor(private router: Router, public store: StoreService) { }

  ngOnInit(): void {
  }

}
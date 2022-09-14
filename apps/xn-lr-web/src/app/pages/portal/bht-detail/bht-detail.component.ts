import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../shared/services/store.service';

@Component({
  selector: 'app-bht-detail',
  templateUrl: './bht-detail.component.html',
  styleUrls: ['./bht-detail.component.less']
})
export class BhtDetailComponent implements OnInit {
  
  style: any = {
    'background-image': "url(assets/images/banner/banner-baohantong-detail.png)",
    height: "670px"
  };
  constructor(private router: Router, public store: StoreService) { }

  ngOnInit(): void {
  }

}
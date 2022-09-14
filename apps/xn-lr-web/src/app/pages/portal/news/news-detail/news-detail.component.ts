import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { StoreService } from '../../shared/services/store.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.less']
})
export class NewsDetailComponent implements OnInit {
  news: any = {
    title: '',
    src: '',
  };
  constructor(private xn: XnService, private route: ActivatedRoute, public store: StoreService) { }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.xn.api.post('/portalsite/article_info', { id: data.id } ).subscribe((res: any) => {
        console.log('新闻详情', res);
        this.news = res.data.data;
        this.news.coverPhoto = JSON.parse(this.news.coverPhoto);
      });
    });

  }

}

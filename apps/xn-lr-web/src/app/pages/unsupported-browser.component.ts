import { Component } from '@angular/core';

@Component({
    selector: 'app-unsupported-browser-component',
    template: `
    <!-- Main content -->
    <section class="content">
      <div class="error-page">
          <h3><i class="fa fa-warning text-yellow"></i> 糟糕，我们已不再支持您的浏览器。</h3>

          <p>
            为获得更安全流畅的用户体验，链融科技供应链平台不再支持 IE 9 （含 IE 9）以下的浏览器，可将您的浏览器升级为 IE 10+ 的版本，或使用链融科技为您精心打造的<a alt="链融科技供应链服务平台" href="/assets/lrscft-setup-1.0.1.41.exe" >桌面应用程序</a>访问我们的平台。
          </p>

          <a href="https://www.lrscft.com/exe/lrscft-setup-1.0.2.exe">下载链融科技供应链服务平台桌面应用程序</a>

      </div>
      <!-- /.error-page -->
    </section>
    <!-- /.content -->
    `
})
export class UnsupportedBrowserComponent {}

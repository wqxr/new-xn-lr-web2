# Tooltip

## 使用方式

1. 基本使用方式：

```
  <i class="fa fa-fw fa-question-circle" tooltip="tooltip content"></i>
```

2. 在指令标签中设置属性：

```
  <i class="fa fa-fw fa-question-circle" tooltip="tooltip content" placement="top" show-delay="500"></i>
```

3. 传递配置对象：

```
  <i class="fa fa-fw fa-question-circle" tooltip="tooltip content" [options]="myOptions"></i>

  myOptions = {
	    'placement': 'left',
	    'show-delay': 500
	}
```

4. 自定义 tooltip 内容：

  ```
  <i tooltip="<p>Hello i'm a <strong>bold</strong> text !</p>">
  </i>
  ```

  ```
  <ng-template #HtmlContent>
    <p>Hello i'm a <strong>bold</strong> text!</p>
  </ng-template>

  <i [tooltip]="HtmlContent" content-type="template">
  </i>
  ```

## 属性

| name             | type                                | default | description                                 |
|------------------|-------------------------------------|---------|---------------------------------------------|
| placement        | "top", "bottom", "left", "right"    | "top"   | tooltip 显示的位置               |
| show-delay       | number                              | 0       | 延迟 n 毫秒显示 tooltip |
| hide-delay       | number                              | 300     | 延迟 n 毫秒隐藏 tooltip |
| hide-delay-mobile      | number                        | 1500    | 延迟 n 毫秒隐藏 tooltip (移动设备有效). |
| display          | boolean                             | true    | 是否显示 tooltip          |
| display-mobile   | boolean                             | true    | 是否在移动设备中显示 tooltip     |
| z-index          | number                              | 0       | tooltip 的 z-index                 |
| trigger          | "hover", "click"                    | "hover" | 指定触发 tooltip 的方式， "hide-delay" 控制隐藏时间 |
| tooltip-class    | string                              |         | 自定义 tooltip 样式        |
| animation-duration | number                            | 300     | 显示/隐藏 tooltip 的动画时间 |
| theme            | "dark", "light"                     | "light" | tooltip 背景和文本主题.       |
| shadow           | boolean                             | true    | 是否有投影效果                    |
| offset           | number                              | 8       | tooltip 相对于触发元素的偏移量    |
| max-width        | string                              | "200px" | tooltip 的最大宽度               |
| content-type     | "string", "html', "template"        | "string"| tooltip 内容类型    |

## 事件

| Event            | Description                                                                                 |
|------------------|---------------------------------------------------------------------------------------------|
| show             | tooltip 显示前事件                                           |
| shown            | tooltip 显示后事件                   |
| hide             | tooltip 隐藏前事件                                         |
| hidden           | tooltip 隐藏后事件                            |

## 方法

| Method           | Description                                                                                 |
|------------------|---------------------------------------------------------------------------------------------|
| show()           | 显示 tooltip                                                                           |
| hide()           | 隐藏 tooltip                                                                           |

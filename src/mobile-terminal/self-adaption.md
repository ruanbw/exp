## 核心思想
所有自适应方案的核心思想都是：**不要使用固定不变的像素单位（如 `px`），而是使用可以根据屏幕宽度进行缩放的相对单位。**

## 方案一：使用 `rpx` 单位（官方主推，最简单高效）

这是 Uni-app 官方最推荐、也是最核心的自适应方案。

### 1. 什么是 `rpx`？
`rpx`（responsive pixel）是响应式像素单位。Uni-app 的设计思想是，将所有设备的屏幕宽度，不管物理像素是多少，都统一规定为 `750rpx`。

*   **换算关系**：`屏幕总宽度 / 750 = 1rpx` 的实际大小。
*   **例如**：
    *   在 iPhone 6/7/8（宽度为 375px）上，`375px / 750 = 0.5px`，所以 `1rpx = 0.5px`。
    *   在 iPhone 6/7/8 Plus（宽度为 414px）上，`414px / 750 ≈ 0.552px`，所以 `1rpx ≈ 0.552px`。

### 2. 如何使用？
你只需要从UI设计师那里拿到一份**以 750px 宽度为基准的设计稿**。然后，设计稿上标注的任意尺寸（如宽度、高度、边距、字体大小），你直接将 `px` 单位换成 `rpx` 即可。

**示例：**
如果设计稿上一个按钮的尺寸是 `200px * 80px`，字体大小是 `32px`。

```css
/* style */
.my-button {
    width: 200rpx;
    height: 80rpx;
    font-size: 32rpx;
    border-radius: 40rpx; /* 圆角也同样使用 rpx */
}
```

### 3. 优缺点
*   **优点**：
    *   **极其简单**：只需遵循“设计稿px -> 代码rpx”的原则，无需任何计算。
    *   **官方支持**：Uni-app 底层完美支持，跨端表现一致。
    *   **精度高**：能自动处理小数像素，保证各端比例基本一致。
*   **缺点**：
    *   对于一些需要撑满全屏高度的场景，`rpx` 不太方便，因为 `rpx` 是基于宽度的。

> **小提示**：`upx` 是 `rpx` 的曾用名，在旧项目中可能会看到，它们是完全一样的。

---

## 方案二：Flex 布局（弹性盒子布局）

Flex 布局不是一个单位，而是一种布局模型。它与 `rpx` 结合使用，是实现复杂响应式布局的黄金搭档。

### 1. 什么是 Flex？
它允许容器内的子元素能够自动放大或缩小，以填充可用空间，非常适合移动端的多栏布局。

### 2. 如何使用？
通过设置 `display: flex;`，并利用 `flex-direction`、`justify-content`、`align-items` 和 `flex` 属性来控制元素的排列和空间分配。

**示例：**
实现一个顶部固定的导航栏，中间内容区自适应高度。

```html
<!-- template -->
<view class="container">
    <view class="header">顶部导航</view>
    <view class="content">
        <!-- 这里是滚动内容 -->
    </view>
    <view class="footer">底部菜单</view>
</view>
```
```css
/* style */
.container {
    display: flex;
    flex-direction: column; /* 垂直排列 */
    height: 100vh; /* 占满整个屏幕高度 */
}

.header, .footer {
    height: 100rpx;
    background-color: #f1f1f1;
}

.content {
    flex: 1; /* 这是关键，它会占据所有剩余空间 */
    overflow-y: auto; /* 如果内容超出自适应高度，则可以滚动 */
}
```

### 3. 优缺点
*   **优点**：
    *   **功能强大**：轻松实现各种对齐、均分、空间分配等复杂布局。
    *   **语义清晰**：布局逻辑非常清楚。
*   **缺点**：
    *   需要学习 Flex 布局的语法。

---

## 方案三：使用 `vw` / `vh` 单位

`vw` (viewport width) 和 `vh` (viewport height) 是视口单位，直接与设备的屏幕尺寸挂钩。

*   `1vw` = 1% 的视口宽度。
*   `1vh` = 1% 的视口高度。

### 1. 与 `rpx` 的区别
*   `rpx` 是基于 `750` 这个**固定设计宽度**的相对单位。
*   `vw/vh` 是基于**设备实际视口**的百分比单位。

### 2. 适用场景
*   **全屏元素**：如全屏背景、全屏弹窗等。`width: 100vw; height: 100vh;` 非常方便。
*   **不希望随宽度缩放的高度**：有时你希望某个元素的高度始终是屏幕高度的固定比例，这时用 `vh` 就比 `rpx` 合适。

**示例：**
制作一个占满屏幕一半高度的封面图。

```css
.cover-image {
    width: 100vw; /* 宽度撑满屏幕 */
    height: 50vh; /* 高度为屏幕的一半 */
}
```

---

## 方案四：通过 `uni.getSystemInfoSync()` 动态计算

当 CSS 无法满足一些极其复杂的动态布局需求时，可以通过 JavaScript 获取设备信息，然后动态设置样式。

### 1. 如何使用？
在页面的 `onLoad` 或 `onReady`生命周期中，调用 `uni.getSystemInfoSync()` API。

**示例：**
计算一个正方形的宽度，使其等于屏幕可用宽度的一半，并动态绑定到 style。

```html
<!-- template -->
<view :style="{ width: boxWidth + 'px', height: boxWidth + 'px' }" class="dynamic-box"></view>
```
```javascript
// script
export default {
    data() {
        return {
            boxWidth: 0
        };
    },
    onLoad() {
        const systemInfo = uni.getSystemInfoSync();
        // systemInfo.windowWidth 是屏幕可用宽度
        this.boxWidth = systemInfo.windowWidth / 2;
    }
}
```

### 2. 优缺点
*   **优点**：
    *   **极度灵活**：可以实现任何你能想到的动态布局逻辑。
    *   **信息丰富**：可以获取状态栏高度、安全区域等信息，用于做刘海屏、异形屏的适配。
*   **缺点**：
    *   **性能开销**：JS 计算和 DOM 操作比纯 CSS 性能差。
    *   **代码复杂**：增加了业务逻辑的复杂度。

---

## 方案五：条件编译和媒体查询（处理大差异）

当不同平台或不同尺寸范围（如手机 vs. 平板）的 UI 差异很大时，可以使用这两种方式。

### 1. 条件编译
这是 Uni-app 的特色功能，可以在编译时根据不同平台包含或排除代码块。

**示例：**
为小程序和 App 设置不同的样式。

```css
/* pages.css */
.title {
    font-size: 32rpx;
}

/* #ifdef MP-WEIXIN */
/* 这段样式只在微信小程序中生效 */
.title {
    color: blue;
}
/* #endif */

/* #ifdef APP-PLUS */
/* 这段样式只在 App 中生效 */
.title {
    color: red;
}
/* #endif */
```

### 2. 媒体查询 (`@media`)
标准的 CSS 功能，Uni-app 也支持。通常用于响应式布局，比如区分手机和Pad。

```css
/* 默认是手机样式 */
.container {
    width: 100%;
}

/* 当屏幕宽度大于等于 768px 时（通常认为是平板），应用此样式 */
@media (min-width: 768px) {
    .container {
        width: 750px;
        margin: 0 auto;
    }
}
```

## 最佳实践与总结

1.  **主要策略**：**以 `rpx` 为主，Flex 布局为辅**。这是最高效、最通用的组合，能解决 95% 以上的自适应问题。
2.  **设计稿规范**：强烈建议团队统一使用 **750px** 宽度的设计稿，这样可以无脑 `px` -> `rpx`。
3.  **全屏/视口比例场景**：当需要与屏幕视口尺寸强相关时，大胆使用 `vw` 和 `vh`。
4.  **特殊/动态场景**：对于 CSS 难以处理的复杂计算（如异形屏安全区域），使用 `uni.getSystemInfoSync()` 作为补充。
5.  **平台/大尺寸差异**：当不同平台或设备类型（手机/平板）UI 差异巨大时，才考虑使用**条件编译**或**媒体查询**。
6.  **图片自适应**：图片通常在其父容器内设置 `width: 100%; height: auto;` 或 `height: 100%; width: auto;` 即可自适应填充。

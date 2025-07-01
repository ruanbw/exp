## 输入网址到页面渲染完毕的过程

### 阶段一：导航 (Navigation) - "信使的旅程"
这是浏览器作为“信使”去服务器“取货”的过程。虽然很多环节发生在浏览器底层和网络层，但前端开发者必须理解它们，因为这直接影响到首字节时间 (TTFB - Time to First Byte)，是页面性能的起点。

#### 用户输入与 URL 解析

你在做什么？：在地址栏输入 google.com 或 https://www.google.com。

浏览器在做什么？

- 智能判断：浏览器会判断你输入的是一个搜索关键词还是一个 URL。如果是关键词，它会使用默认搜索引擎拼接成 URL。
- URL 标准化：浏览器会解析 URL，补充协议（如 http:// 或 https://）、主机名、端口号等。例如 google.com 会被解析为 https://www.google.com（因为 HSTS 策略，现代浏览器会优先尝试 HTTPS）。
- HSTS 检查：浏览器会检查 HSTS (HTTP Strict Transport Security) 列表。如果该域名在列表中，浏览器会强制使用 HTTPS 发起请求，即使用户输入的是 HTTP。这是个重要的安全和性能细节。

#### DNS 查询 (Domain Name System) - "查地址"

你要去哪？：计算机网络通信需要 IP 地址，而不是域名。DNS 的作用就是把 www.google.com 这个域名翻译成服务器的 IP 地址（比如 172.217.160.78）。

查询顺序 (前端需关注的缓存)：

- 浏览器缓存：浏览器会先看自己的缓存里有没有这个域名的 IP。
- 操作系统缓存：如果浏览器缓存没有，会查询操作系统的 hosts 文件和缓存。
- 路由器缓存：接着是路由器。
- ISP DNS 缓存：再到你的网络服务提供商（比如电信、联通）的 DNS 服务器。
- 根域名服务器查询：如果都没有，就会启动一个递归查询，从根服务器 ->顶级域（.com）服务器 -> 权威名称服务器（Google 的 DNS 服务器），最终找到 IP 地址。

> [!TIP]
> 前端视角：DNS 查询耗时可能达到几十甚至上百毫秒。DNS 预解析 (DNS Prefetch) 就是一项重要的前端性能优化技术。通过在 HTML 中添加 `<link rel="dns-prefetch" href="//other-domain.com">`，可以告诉浏览器提前解析未来可能用到的域名，减少实际请求时的延迟。

#### 建立 TCP 连接 - "打电话"
找到人了，开始通话：拿到了 IP 地址，浏览器需要和服务器建立一个可靠的连接来传输数据。对于 HTTP/1.1 和 HTTP/2，这通常是 TCP 连接。

TCP 三次握手：
- SYN：浏览器发送一个 SYN 包（同步序列编号）给服务器，请求建立连接。
- SYN-ACK：服务器收到后，回复一个 SYN-ACK 包（同步确认）。
- ACK：浏览器再发送一个 ACK 包（确认），连接建立成功。

> [!TIP]
> 前端视角：这个过程同样有时间开销。对于 HTTPS，情况更复杂，还需要进行 TLS 握手 来加密通信，这个过程耗时更长。HTTP/3 (QUIC) 协议的出现，很大程度上就是为了优化连接建立的延迟，它将 TCP 和 TLS 的握手过程合并，速度更快。

#### 发送 HTTP 请求 - "说出你的需求"
连接已建立，表明来意：浏览器向服务器发送一个 HTTP 请求报文。

报文内容：
- 请求行 (Request Line)：GET / HTTP/1.1 (方法, 路径, 协议版本)
- 请求头 (Headers)：包含大量信息，如 Host: www.google.com、User-Agent、Accept、Cookie 等。前端开发者经常和 Cookie, Cache-Control, Content-Type 等头部打交道。
- 请求体 (Body)：对于 GET 请求，请求体为空。POST 请求会在这里携带数据。

#### 服务器处理并响应 - "服务器的准备工作"

服务器（如 Nginx, Apache）接收到请求，根据请求路径和参数，可能会执行后端代码（如 Node.js, PHP, Java），查询数据库，最终生成一个 HTTP 响应报文。

#### 接收 HTTP 响应 - "拿到货了"

浏览器接收到服务器返回的响应报文。

报文内容：
- 状态行：HTTP/1.1 200 OK (协议版本, 状态码, 状态描述)。前端开发者必须熟悉 200, 301, 302, 304, 404, 500 等状态码的含义。304 Not Modified 尤其重要，它告诉浏览器可以直接使用本地缓存，极大提升加载速度。
- 响应头：包含 Content-Type: text/html（告诉浏览器这是个 HTML 文件）、Content-Encoding、Cache-Control 等。
- 响应体：最重要的部分，通常是 HTML 文件的文本内容。

> [!TIP]
>至此，导航阶段结束，浏览器拿到了第一个关键资源：HTML 文件。

### 阶段二：解析与渲染 (Parsing & Rendering) - "装修新房"

这是前端开发者的核心战场。浏览器要把一堆文本代码，变成我们能看到的、能交互的华丽页面。这个过程被称为关键渲染路径 (Critical Rendering Path)。
(一个简化的关键渲染路径示意图)

#### 解析 HTML，构建 DOM 树 (Document Object Model)

浏览器从上到下逐行读取 HTML 响应体，开始解析。它不是等整个文件下载完再解析，而是流式解析 (Streaming Parsing)。
解析器将 HTML 标签（如 `<html>`, `<body>`, `<div>`）转换成一个个“节点 (Node)”，并根据它们的层级关系，构建成一个树状结构——DOM 树。
document 对象就是这棵树的根节点，也是 JavaScript 操作页面的入口。

#### 解析 CSS，构建 CSSOM 树 (CSS Object Model)

在解析 HTML 的过程中，如果遇到 `<link rel="stylesheet" href="style.css">` 或 `<style>` 标签，浏览器会立即异步下载 CSS 文件，并开始解析它。
CSS 解析器会把 CSS 规则（如 body { font-size: 16px; }）转换成一个树状结构——CSSOM 树。这棵树描述了每个 DOM 节点应该应用什么样式。
关键点：CSS 的解析是 渲染阻塞 (Render-Blocking) 的。在 CSSOM 树构建完成之前，浏览器不会进入下一步的渲染环节。这就是为什么我们总是建议将 `<link>` 标签放在 `<head>` 里，让它尽早下载和解析。

#### JavaScript 的执行 - "不确定的装修工人"
当 HTML 解析器遇到 `<script>` 标签时，情况变得复杂：
默认情况 (无 async 或 defer)：HTML 解析会暂停！浏览器会立即下载并执行这个脚本。执行完毕后，才继续解析 HTML。
为什么暂停？ 因为 JavaScript 可能会修改 DOM（比如 document.write()），浏览器不知道后续的 HTML 是否还准确，只能停下来等 JS 执行完。
前端视角：这就是为什么“JS 是解析器阻塞 (Parser-Blocking) 的”这句话如此重要。如果一个很大的 JS 文件放在 `<head>` 里，页面将会出现长时间的白屏。
优化方案：async 和 defer
`<script async>`：异步下载脚本，下载过程不阻塞 HTML 解析。下载完成后，立即暂停 HTML 解析，执行脚本。多个 async 脚本的执行顺序不确定。
`<script defer>`：异步下载脚本，下载过程不阻塞 HTML 解析。下载完成后，等到 HTML 解析完毕（DOM 树构建完成）后，再按顺序执行所有 defer 脚本，且在 DOMContentLoaded 事件之前执行。
最佳实践：对于不依赖 DOM 的脚本用 async，对于需要操作 DOM 的脚本用 defer，并将它们放在 `<head>` 中，实现下载和解析的并行，最大化性能。

#### 构建渲染树 (Render Tree)
DOM 树和 CSSOM 树都准备好了，浏览器会将它们合并成渲染树 (Render Tree)。
渲染树只包含需要显示的节点。比如 display: none 的节点、`<head>` 标签等不会被包含在渲染树中。而 visibility: hidden 的节点会包含在内，因为它虽然不可见，但仍然占据空间。
渲染树的每个节点都包含了 DOM 内容和计算好的样式（Computed Style）。

#### 布局 (Layout / Reflow) - "规划家具位置"
有了渲染树，浏览器开始计算每个节点在屏幕上的确切位置和大小。这个过程称为布局或回流 (Reflow)。
浏览器从渲染树的根节点开始，递归地计算每个元素的几何信息（坐标、尺寸）。
这是一个非常消耗性能的步骤。页面首次加载时至少会发生一次 Layout。后续如果通过 JS 改变了元素的尺寸、位置，或者增删 DOM 节点，都可能触发 Reflow。

#### 绘制 (Paint / Repaint) - "刷油漆"
布局阶段完成后，浏览器知道了所有元素的位置和样式，接下来就要把它们绘制到屏幕上。
绘制过程是将渲染树中的每个节点转换成屏幕上的实际像素。它会遍历渲染树，调用图形库（如 Skia）来绘制文本、颜色、图像、边框等。
这个过程可能会发生在多个图层 (Layers) 上。

#### 合成 (Compositing) - "拼合图层"
浏览器会将不同图层按正确的顺序（比如 z-index）合并在一起，最终显示在屏幕上。
前端视角：这是一个关键的性能优化点。如果一个元素被提升为独立的合成层（比如使用 transform: translateZ(0) 或 will-change），那么对这个元素的变换（移动、缩放、旋转）将只需要在 GPU 中进行合成，而不需要触发布局和绘制 (Reflow & Repaint)。这就是为什么 CSS transform 和 opacity 动画性能远高于使用 left 和 top。
至此，页面首次渲染完成，用户看到了内容。

### 阶段三：交互 (Interactivity) - "房子住进人"

页面不是静态的，它是一个“活的”文档。

#### DOMContentLoaded 与 load 事件
DOMContentLoaded: 当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完成加载。这时，DOM 树已经可用，是执行 JS 逻辑（如绑定事件监听器、初始化应用）的绝佳时机。
load: 当整个页面及所有依赖资源（如样式表、图片）都已完成加载时，window.load 事件被触发。

#### JavaScript 框架的 "Hydration"
对于现代前端框架（如 React, Vue, Svelte），服务器可能会返回一个静态的 HTML（SSR - Server-Side Rendering）。页面显示后，客户端的 JS 会接管这些静态 DOM，为其附加事件监听器和状态，使其变得可交互。这个过程被称为注水 (Hydration)。

#### 用户的交互与动态更新
当用户滚动页面、点击按钮、输入文字时，会触发相应的事件。
事件处理函数（JS 代码）可能会：
发起新的网络请求（如 fetch API），获取数据。
修改 DOM，比如添加、删除或更新元素。
这些修改可能会再次触发回流 (Reflow) 和 重绘 (Repaint)，或者如果优化的好，只触发重绘或合成，从而更新页面视图。理解并最小化这些后续的渲染开销，是前端性能优化的核心日常工作。

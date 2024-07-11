<div>
  <h1 align="center">Doubao Translator Bob Plugin</h1>
</div>

## 简介

基于 [豆包Doubao API](https://www.volcengine.com/product/doubao) 的文本翻译、文本润色、语法纠错 Bob 插件。

### 语言模型

* `Doubao-pro-128k`（默认使用）
* `Doubao-pro-32k`
* `Doubao-pro-4k`
* `Doubao-lite-128k`
* `Doubao-lite-32k`
* `Doubao-lite-4k`
* `Doubao-embedding`
* `Moonshot-v1-128k`
* `Moonshot-v1-128k`
* `Moonshot-v1-128k`

## 使用方法

1. 安装 [Bob](https://bobtranslate.com/guide/#%E5%AE%89%E8%A3%85) (版本 >= 1.8.0)，一款 macOS 平台的翻译和 OCR 软件

2. 下载此插件: [bob-plugin-doubao-translate.bobplugin](https://github.com/djx30103/bob-plugin-doubao-translate/releases/latest)

3. 安装此插件

4. 去 [火山方舟控制台](https://console.volcengine.com/ark) 开通管理(开通服务) -> 模型推理(为每个模型创建接入点) -> API Key管理(创建 API Key)

5. 把 API Key、推理点ID 填入 Bob 偏好设置 > 服务 > 此插件配置界面对应的输入框中，选择你要使用的模型，点击保存即可。

## 感谢

本仓库参考部分其他优秀源码，感谢[bob-plugin-cohere](https://github.com/missuo/bob-plugin-cohere)、[bob-plugin-gemini-translate](https://github.com/BrianShenCC/bob-plugin-gemini-translate)。


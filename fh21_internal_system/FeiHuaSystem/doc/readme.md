飞华健康网 管理系统
===

## 目录结构

build                //编译后的网站文件，混淆的js文件，css文件。\
doc                  //app文档。\
public               //html文件，app信息文件。\
  index.html         // app页面。\
  manifest.json      // app信息文件.\
src                  //源码。\
  image              //图像文件. \
  script             //js 源码，处理前的。新增文件放到对应的目录，没有对应目录直接放到此目录下. \
    fh               // 飞华app结构源码。\
      shell          // app的壳.\
    model            // 功能模块源码。\
      login          // 登录。\
      navigator      //导航.\
      pages          //页面.\
      titleBar       //app首页头部。\
    sevice           //服务器文件和配置。\
    template         //jsx模板。\
    utils            //其他功能文件.\
  style              //样式表文件。处理前的，新增文件放到对应目录下，没有对应目录放到此目录下. \
  third_party        // 第三方文件，子目录保持原样，如果需要区分版本，可新建目录或带版本号. \
test                 //测试文件。\
package.json         // app控制文件，依赖包。\

## 编译和测试
### 安装工具
1. 安装node.js。
2. 安装Visual studio code ,可选。
3. 安装webpack 目前使用build
4. 安装nodejs依赖库
  1. 命令行进入工程根目录
  2. 运行npm install

### build 命令
编译主要是利用以下命令
npm start 监听和编译
npm run build 构建app

在运行前一定要编译。

### 测试、运行
  1. 在工程目录下运行 npm start
  2. 然后，在浏览器访问http://localhost:3000

## 代码规范
### 字符编码
  utf-8

### js/jsx

### 缩进
  两个空格。可在VS的Tools/options/text /editor/javascript中设定

### 模块
  全局对象作为模块，例如：fh_fetch
  其他模块如自定义组件，只有类

### 类和模块
类名采用驼峰格式，首字母大写。
一般来说，每个组件或类应位于独立的源文件内，文件名与类名相同。非公共类可不受此限制。

函数、方法、属性采用驼峰格式，首字母小写。

模块下可直接有函数和变量，自定义组件按照react规范。
模块下直接的函数变量放在与模块同名的源文件内。

### 全局变量
确需使用全局变量时，一般放在专门的模块中，如 fh_run.js用于存放运行时的临时全局变量。并适当注释。



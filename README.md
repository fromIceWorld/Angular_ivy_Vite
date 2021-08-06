# vite

1. 基于 ES Module，IE11以上浏览器

2. 按需编译，在项目使用模块时才请求编译所需模块

   ```typescript
   `有别于webpack`：
   
   `1.` webpack在项目启动时已经对所有的模块进行打包【因此比较慢】，vite是按需编译加载，在项目启动时不需要分析模块的依赖，不需要编      译，因此`启动非常快`，由于是按需加载，因此极大的缩减了编译时间，项目越复杂，模块越多，vite优势越明显
   `2.` HMR[热更新],当文件改变时，仅需要让浏览器重新请求该模块即可，有别于webpack需要把该模块的相关模块全部编译一次
   `3.`打包到生产环境时，vite使用Rollup，
   
   `因此 vite 的 优势主要在开发阶段`
   
   缺点：由于依赖于 ES Module，因此项目中 不可以使用 CommonJS。
   
   `问题1：`
    每次请求的文件路径如何确定
     main.ts -> app-tab ->index.ts[引入a.component.ts]
                          a.component.ts[引入b.component.ts]
                          b.component.ts
     请求到代理服务器后index/a/b路径查找问题。如何直到是从哪个文件找。
    【vite.config.js配置 使用绝对路径 alias '/@/':path.resolve(__dirname, './src')】
    
    
    `--Vite对按需编译的处理----------------------------------------------`
    import的 文件统一以'/@/'开头，'/@/'作为根路径。👆
    因此 请求的文件就分为：'/@/'开头的源代码导入
                       '/@modules/'开头的依赖导入
                       '.ico, .png, ...' 图片
    css 和 html                    
   ```

   

3. 依赖预编译

   ```typescript
   vite 会在 DevServer启动前对需要预编译的依赖进行编译，然后在分析模块导入的时候，应用编译过的依赖。
   
   `默认情况`会将 package.json中的  dependencies 进行预编译。然后将编译后的结果缓存在 node_modules/.vite下
   
   `优点`：解决依赖链过长，请求多次，由于浏览器并行请求数量有限制，过多会等待，造成浏览器阻塞的问题
          依赖可能不支持 ESModule，需要编译成支持ESModule
          
          
   `dependencies编译，遇到问题-----------`
     zone.js依赖的package.json 无 module 属性，只有browser指向 文件
   `预解析的依赖 模块间相互引用`  core：ApplicationModule【在A】
                             platform-browser-dynamic：引用 ApplicationModule【A】
                             platform-browser：引用 ApplicationModule【A】
    但是预解析依赖 会将 ApplicationModule  在三个文件都有                        
   ```

   

4. 4

   ```typescript
   
   ```


# Rollup

## 插件

### @rollup/plugin-node-resolve

```
解析 文件的 导入属性，并将导入属性打包。
```

# Angular问题

1. *@angular/platform-browser-dynamic*

   ```typescript
   引入 @angular/platform-browser-dynamic 时，替换内部的 from “语法” => from "/@modules/"，使 其解析失败。
   ```

   

2. Zone 需要 独立引入。

3. **.component.ts 

   ```typescript
   解析编译组件时，指令@Component将 元数据 添加到 class.metadata,但未进行转换。
   Angular 在解析时，styleUrls/templateUrl 已被【compiler-cli】转换成字符串。因此会报错
   ------------------------------------------
   Angular在编译前 有 updateDecoratorMetadata【compiler-cli】 解析
   ```

   

4. inject() must be called from an injection context

   ```typescript
   来源：platform-browser.js
   报错信息：`inject() must be called from an injection context`
   原因：_currentInjector赋值未生效。。。。
   ```

   

5. sd


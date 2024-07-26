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

   引入 @angular/platform-browser-dynamic 时，替换内部的 from “语法” => from "/@modules/"，会匹配到 【 EmitterVisitorContext.prototype.println】函数， 其解析失败。

   ```typescript
   EmitterVisitorContext.prototype.println = function (from, lastPart) {
       if (lastPart === void 0) { lastPart = ''; }
       this.print(from || null, lastPart, true);
   };
   `----------------------👇---------------------------`
   EmitterVisitorContext.prototype.println = function (from, lastPart) {
           if (lastPart === void 0) { lastPart = ''; }
           this.print(from '/@modules/| null, lastPart, true);
   };
   `-----匹配函数`：
   function rewriteImports(content) {
     return content.replace(/from\s*['|"]([^'"]+)['|"]/g, function ($0, $1) {
       if ($1.indexOf("/@/") !== 0) {
         console.log(`from '/@modules/${$1}'`);
         return `from '/@modules/${$1}'`;
       } else {
         return $0;
       }
     });
   }
   
   匹配函数正常情况下不会匹配到框架函数，出现这种情况的原因？？？？？？？
   
   ```

   

2. Zone 需要 独立引入，全局的styles也需要独立引入。

   ```
   对于需要独立引入的，后续在配置文件中配置？？？？
   ```

3. templateURL，stylesURL

   ```typescript
   解析编译组件时，指令@Component将 元数据 添加到 class.metadata,但未进行转换。
   Angular 在解析时，styleUrls/templateUrl 已被【compiler-cli】转换成字符串。因此会报错
   ------------------------------------------
   Angular在编译前 有 updateDecoratorMetadata【compiler-cli】 解析
   `解决：当解析到/@/开头的文件时，对styleUrls/templateUrl 进行替换`
   stylesURL需循环解析依赖【@import url(***)】
   ```

   

4. inject() must be called from an injection context

   ```typescript
   来源：platform-browser.js
   报错信息：`inject() must be called from an injection context`
   原因：Rollup打包时，解析impot一起打包了，导致多模块依赖同一个函数，这样就会有三个包，每个包都用同一个函数，使_currentInjector赋值未生效。。。。
   ```

   

5. component的 ɵcmp，ɵfac

   ```typescript
   `ɵcmp`，`ɵfac` 是 @Component 装饰器 给class 添加的静态属性
   无模块写法，是给 component 的 def属性添加 directiveDefs和 pipeDefs。
   因此顺序应该是 先执行 Component再执行 无模块赋值装饰器。
   ```

   

6. 指令，依赖注入报错

   ```typescript
   `报错信息`：ERROR Error: ASSERTION ERROR: token must be defined [Expected=> null != null <=Actual]
   `定位`：【return getOrCreateInjectable((/** @type {?} */ (tNode)), lView, resolveForwardRef(token), flags);】
   
   `例如`：constructor(@Optional() public tabs: TabbedPaneComponent) {}
    注入 TabbedPaneComponent，在解析时未收到 参数tabs[token]的值(null)，报错
    
   ` 原因`:在生成 指令的 ɵfac 函数时，未找到自动注入的服务，为null
          指令的【ctorParameters】属性为undifined【静态参数属性未添加】
          
         `【ctorParameters】 是 Angular-cli 使用ts的【design:paramtypes】 特殊处理的，esbuild转换.ts文件会丢失`
          
   `解决方法`：使用@Inject 参数装饰器，可获取注入的服务。
   
   `元数据反射`：
   design:paramtypes: 参数类型元数据
   design:paramtypes：类型元数据
   design:returntype：返回类型元数据
   ```

   

7. 使用 esbuild 转换 .ts，

   ```typescript
   Ⅰ 转换 参数templateUrl，styleUrls的路径为实际内容【自制URL解析器解决】
   Ⅱ 给class添加静态属性 ctorParameters【使用@Inject 参数装饰器可解决😁】
   ```

   

8. 热替换

   ```typescript
   `1.` 依赖的热替换 【处理依赖然后reload？？】
   `2.` 业务代码的热替换【模块级别的更新？？？？】
    `2.1` 模板的热替换
    `2.2` css文件的热替换。 
   
   
   在组件中 html，css,ts 修改时，热替换浏览器中的代码，更新到浏览器。
   
   -----------------------------------------------------------------
   `css 在编译时，Angular会将css编译到组件的$def.styles中，在组件渲染时会将style 插入到页面上`
   ① 在项目解析css依赖时，存储css依赖的路径，当css依赖修改时，判断修改的css 是否是依赖的css，如果是的话，直接使用websocket 请求对应css
   `问题`：组件有自己的封装类型，当使用默认封装时，css属性被限制到组件级别，需要组件的id
          shadow封装时，更有问题。
   ------------------------------------------------------------------------
   `html文件修改时，`
   ```

   

9. 路径问题

   ```typescript
   `需要根路径配置`
   
   在Angular旧有项目中，路径使用的是相对路径，如果使用Angular_ivy_vite,需要统一规范路径,在解析时容易拦截。
   
   `业务路径`：使用 /@/开头的绝对路径，在浏览器中会以/@/***的形式发出请求，服务端配置相对应的拦截路由【需根路径】
   `依赖路径`: 非/@/开头的都是import依赖，已经预解析,再返回时会以/@modules/重写。
   
   在业务代码中引入的除了绝对路径的业务代码，就是依赖了，在返回时需要对路径进行重写，以/@modules/开头。在浏览器请求时，直接去预解析区域查找，未找到就是衍生依赖，解析衍生依赖后存储。
   
   `后缀省略处理--------------------`
   import { TabbedPaneComponent } from "/@/src/app/tabbed-pane/tabbed-pane.component";
   在Angular项目中都是省略后缀的，因此在服务端接收请求后，需要判定请求的路由是文件夹还是文件，
   如果是文件夹就向下查找index(.js|.ts)
   如果是文件，就找到上级目录下的文件是否有tabbed-pane.component(.js|.ts)，
   
   ------------------------------------------------------------------------
   问题：迁移旧项目时需重写路径。
   优化：在启动项目时重写文件中的路径？？？？？？？？【会破坏原有项目】
   ```

   

10. 资源缓存

   ```
   在热重载时，如果第二次请求相同的未修改的文件，走缓存。
   
   ```

   

11. 热模块替换

    ```
    webpack使用【Server-Sent Events】单向通信[服务端->浏览器]
    vite使用【WebSocket】双向通信。
    ```

    

    


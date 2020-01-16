# study webpack.config && CSS预处理器

## 一. 初始操作
### 1. npm init 初始化 *package.json* 文件

### 2. webpack安装

* 局部安装 ` npm i webpack webpack-cli `  webpack4以上需要安装 `webpack-cli` 
* 全局安装 `sudo npm i webpack webpack-cli -g`  



### 3. 尝试执行

* 在 *package.json* 文件的script中添加 ```javascript```	

```json
"scripts":{
  "build":"webpack"
}
```

* 同时可以对于**开发环境**和**生产环境** 配置不同的webpack.config

  ```js
  "scripts":{
    // 在生产环境下使用build目录下的webpack.config.prod.js
    "build":"webpack --mode production --config build/wepback.config.prod.js",
    // 在开发环境下使用build目录下的webpack.config.dev.js
    "dev":"webpack --mode development --config build/webpack.config.dev.js"
    
    // 这样可以达到开发时和发布时使用不同的webpack配置
  }
  ```

  

* 不一定为 *build* ，名字可以随便取，*--mode production* 是配置为生产环境，也可以配置 --mode 为 development ，此为开发环境，打包时会根据--mode的不同，让打包的文件是否 ***压缩***

* 执行 *npm run build*  ,报错：`ERROR in Entry module not found: Error: Can't resolve './src' in '当前文件下'`

* 需要在当前文件目录下创建 ./src/index.js，就不会报这个错了



## 二. 配置 webpack.config.js 文件

### 1. 当前文件下新建 webpack.config.js 文件

### 2. 配置

```Javascrip
const path = require('path')    // 用node的path模块，配置绝对路径
module.exports = {
  entry:'./src/index.js',       // 配置入口文件， 入口一般为一个，但可用对象配置多个入口文件
  output:{
    path:path.resolve(__dirname,'dist'),    // ，打包后文件夹名为dist，文件名可随意配置
    filename:'cyj.js'           // 打包后文件名为cyj.js 如果不配置， 默认打包为 main.js
    // filename:'[name].[chunkhash:8].js' //打包后文件名是入口文件名name，加上hash值，只取8位
    // 添加hash值为了更新避免有缓存
  }
}
```

--config script/webpack.config.js	可以配置wepback的路径，为script文件下的webpack.config.js

## 三. 添加html文件

### 1. 安装 `html-webpack-plugin` 

* npm i html-webpack-plugin --save-dev, 在wepback.config.js中添加plugins对象

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry:'./src/index.js',
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'main.[chunkhash:8].js'
  },
  plugins:[
    new HtmlWebpackPlugin()
  ]
}
```

* 同样可以对plugins里面的HtmlWebpackPlugin进行配置

```javascript
plugins:[
    new HtmlWebpackPlugin({
      title:'webpack',							// title 为webpack
      filename:"cyj.html",					// 生成的html文件名为cyj.html
      template:'./src/index.html'		// 使用src文件下的index.html模版生成hmtl
    })
  ]
```

* 更多配置可以在 npmjs.com 搜索 html-webpack-plugin 查看

## 四. 添加样式

### 1. CSS

* npm i css-loader style-loader --save-dev
* 在main.js 里面引入css  import "css.css"

* 打包后不会独立生成一个css，若想要生成一个css需要安装plugin

* *for webpack 3* 及以下

  * 对于webpack3及以下，可以安装这个插件`extract-text-webpack-plugin` 
  * ![image-20200116164958296](/Users/cyj/Library/Application Support/typora-user-images/image-20200116164958296.png)

* *for webpack 4 及以上可以使用*  `mini-css-extract-plugin` 把生成css提取出来放到html中去

  * npm install --save-dev mini-css-extract-plugin

  * ![image-20200116170041988](/Users/cyj/Library/Application Support/typora-user-images/image-20200116170041988.png)

  * ![image-20200116170131820](/Users/cyj/Library/Application Support/typora-user-images/image-20200116170131820.png)

  * [ mini-extract-plugin 插件详情 ]:https://www.npmjs.com/package/mini-css-extract-plugin	"）"

### 2. Less

* 安装less-loader & less

* npm i less-loader less --save-dev

* 配置webpack.config.js

  * ```js
    rules:[
      {
        test:/\.less$/i,
        use:[
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
            	esModule: true,
            },
          },
          'css-loader',
          'less-loader'
        ]
      }
    ]
    ```

  * 

## 五. webpack-dev-server

### 1. 安装

* npm i webpack-dev-server --save-dev

* 配置scripts

  ```json
  scripts:{
    "serve":"webpack-dev-server --port 3000 --open --hot --mode development"
  }
  ```

* 也可以在webpack.config.js中配置

  * ```javascript
    devServer:{
      port:3000,
      open:true
    }
    ```

    

### 2. postcss-loader

* 安装postcss-loader `npm i postcss-loader --save-dev`

* 在webpack.config.js中的rules的use最后添加 *postcss-loader* 

  * ![image-20200116202415465](/Users/cyj/Library/Application Support/typora-user-images/image-20200116202415465.png)

* 创建 *postcss.config.js* 

  * ```javascrip
    module.export = {
    	plugins:[
    		require('autoprefixer')
    		require('postcss-nested')
    	]
    }
    ```

  * 需要什么插件安装什么 `npm i autoprefixer postcss-nested --save-dev` 

### 3. 处理资源文件(img audio ……)

`file-loader ` 和 ` url-loader `

* file-loader npm i file-loader -D

* webpack.config.js中配置一个新的规则
  * ![image-20200116205744601](/Users/cyj/Library/Application Support/typora-user-images/image-20200116205744601.png)
  * 需要启动http服务才能查看，使用webpack-dev-server，publicPath配置为根路径
* 使用 url-loader
* 配置新的规则
  * loader:'url-loader' limit: 1024 
  * 如果图片大小 小于limit的限制，将把图片转化为base64位，这是与file-loader的区别

### 4 . 处理html中的静态图片

* copy-webpack-plugin 

* ```javascript
  plugins: [
      new CopyPlugin([
        { from: 'src/common/img', to: 'common/img' }
      ]),
    ],
  ```

### 5. babel-loader 

* 将ES6新及语法转换为低级语法，兼容大多数浏览器

* `npm install -D babel-loader @babel/core @babel/preset-env` 

## 六. loader

### 1. 常用loader

- style-loader 将css添加到DOM的内联样式标签style里
- css-loader 允许将css文件通过require的方式引入，并返回css代码
- less-loader 处理less
- sass-loader 处理sass
- postcss-loader 用postcss来处理CSS
- autoprefixer-loader 处理CSS3属性前缀，已被弃用，建议直接使用postcss
- file-loader 分发文件到output目录并返回相对路径
- url-loader 和file-loader类似，但是当文件小于设定的limit时可以返回一个Data Url
- html-minify-loader 压缩HTML
- babel-loader 用babel来转换ES6文件到ES5

### 2. loader特性

* loader 从右到左地取值(evaluate)/执行(execute)
* loader 支持链式传递,链中的每个 loader 会将转换应用在已处理过的资源上
* loader 也可以内联显示指定
* loader 可以通过 options 对象配置
* 除了常见的通过 package.json 的 main 来将一个 npm 模块导出为 loader，还可以在 module.rules 中使用 loader 字段直接引用一个模块
* loader是webpack核心,用于对模块的源代码进行转换
* loader支持链式调用，从右至左执行，支持同步或异步函数
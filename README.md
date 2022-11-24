# Facebook 网页版登录加密 JS 还原

> 生成 Facebook 网页版登录时的 encpass 字段参数，用于爬虫模拟HTTP访问
> [![License](https://img.shields.io/badge/license-MIT-db5149.svg)](https://github.com/trry071/facebook-login-encpass/blob/master/LICENSE)

## 安装步骤

#### 1. 安装依赖

```ssh
npm install
```

#### 2. Webpack 打包生成 js 库文件（web + node 环境）

```ssh
#Node 环境
npx webpack --config webpack.node.config.js
```

```ssh
#Web 环境
npx webpack --config webpack.web.config.js
```

执行以上命令后，js 文件会生成在项目目录下的 build 文件夹中

## Web 网页使用例子

在 html 中引入打包好的 js，调用全局函数 fb(pwd, timeStamp, publicKey, keyId) 生成密文，注意，此函数返回的是一个 Promise 对象

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        font-family: sans-serif;
      }

      .boxA,
      .boxB {
        padding: 20px;
      }

      .item {
        margin-bottom: 5px;
      }

      span {
        display: block;
        margin-bottom: 5px;
      }

      input,
      textarea {
        outline: none;
        padding: 5px;
      }

      textarea {
        width: 100%;
        height: 100%;
      }

      .container {
        display: flex;
        justify-content: left;
      }

      .boxB {
        display: flex;
        flex-direction: column;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="boxA">
        <div class="item">
          <span>密码：</span>
          <input type="text" id="pwd" value="test@gmail.com" />
        </div>

        <div class="item">
          <span>时间戳：</span>
          <input type="text" id="timeStamp" value="1664277322" />
        </div>

        <div class="item">
          <span>公钥：</span>
          <input
            type="text"
            id="publicKey"
            value="3735eb9791b4dd28c701b4362a5612cb6e4980cdede028f2032ad3655f4fb207"
          />
        </div>
        <div class="item">
          <span>公钥ID：</span>
          <input type="text" id="keyId" value="51" />
        </div>

        <button id="generator">生成密文</button>
      </div>

      <div class="boxB">
        <span>生成结果：</span>
        <textarea id="result"></textarea>
      </div>
    </div>
  </body>
  <script src="./encpass.web.js"></script>
  <script>
    let generator = document.querySelector("#generator");
    generator.addEventListener("click", function (e) {
      let pwd = document.querySelector("#pwd").value;
      let timeStamp = document.querySelector("#timeStamp").value;
      let publicKey = document.querySelector("#publicKey").value;
      let keyId = document.querySelector("#keyId").value;
      let result = document.querySelector("#result");

      fb(pwd, timeStamp, publicKey, keyId).then((encrypted) => {
        result.value = encrypted;
      });
    });
  </script>
</html>
```

## Node 版使用例子

Node 版的是一个HTTP服务器程序，所以你只需直接运行即可  
这个程序会在本地 3000 端口上开启 Http 服务器，密文生成结果以 Http 接口形式返回

```ssh
#运行 http 服务器
node ./encpass.node.js
```

运行后，HTTP 服务也就启动了，你可以使用 Postman 或其他工具进行测试

请求地址：http://127.0.0.1:3000/encpass  
请求类型：POST

提交数据（JSON 格式）：

```json
{
  "data": {
    "pwd": "#include1",
    "timeStamp": "1664122212",
    "publicKey": "3735eb9791b4dd28c701b4362a5612cb6e4980cdede028f2032ad3655f4fb207",
    "keyId": "146"
  }
}
```

注意，提交的数据是 JSON 格式，里边的参数请自行查找，通常是在登录页面的源码中

请求返回 （JSON 格式）：

```json
{
  "encrypted": "#PWD_BROWSER:5:1664122212:AZJQAPSAQPDXljTyCMHvNEWv4KI4wYV5xx6Rg0O4zhjvfFdx3+IiEWSFANhuN47uLobwvD0ssPI2Xs6WnnGUbH+lFeOQkM1pWYlOi94K5kpzbCbplevo43Vyi/2U+iECZ5D3QRuk/FOLodBfow=="
}
```

## 打赏作者

开源不易，如果此项目对你有帮助，不妨可以打赏一下，金额不限，非常感谢！！！

<img src="https://s2.loli.net/2022/11/24/E4ernNydpBY3tCk.jpg" width = "20%" height = "20%"  /> <img src="https://s2.loli.net/2022/11/24/majpKl1g2q5O3GL.jpg" width = "20%" height = "20%"  />

## License

[MIT](LICENSE)  
这个项目是无人维护的。您可以使用它，但问题和拉取请求可能会被忽略。

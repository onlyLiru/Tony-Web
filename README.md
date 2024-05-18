# Unemate Web

UneMeta - 你的NFT好夥伴

## 💁 Tips

请尽量确保 `getServerSideProps` 中执行的请求都是无状态的

```ts
export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
  resolvedUrl,
}) => {
  // ❌ 错误
  const { data } = fetch('/someAuthApi', {
    headers: {
      Cookie: `session_id=${req.cookies.session_id}` // 请求需要session_id 都不能在服务端执行
    }
  })
  ...
};
```

进入未登录页面请在 `getServerSideProps` 中进行 `redirect`

```ts
export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
  resolvedUrl,
}) => {
  if (!req.cookies['some_jwt_value']) {
    return redirectLoginPage({ locale, resolvedUrl });
  }
  ...
};
```

`features` 目录与 `components` 目录的区别：

`components` 存放全局公用的组件，而 `features` 存放**「业务相关特性」**。

比如要开发「评论」模块，「评论」作为一个特性，与他相关的所有内容都存在于 `features/comments` 目录下。

「评论」模块中需要输入框，输入框这个通用组件来自于 `components` 目录。

所有 **「特性相关」** 的内容都会收敛到 `features` 目录下，具体包括：

特性导出的所有内容只能通过统一的入口调用:

```js
import { CommentBar } from "@/features/comments" // ✅

import { CommentBar } from "@/features/comments/components/CommentBar" // ❌ elint will throw error
```

## 🛠 Stack

- ✍️ 框架: [nextjs](https://nextjs.org)
- 👩‍🎤 UI：[chakra ui](https://chakra-ui.com/getting-started)
- 💄 css: [tailwindcss](https://tailwindcss.com/docs/installation)
- 🌏 国际化: [next-intl](https://next-intl-docs.vercel.app/docs/usage/messages) & [next.js i18n-routing](https://nextjs.org/docs/advanced-features/i18n-routing)
- 🪁 合约层: [ethers](https://github.com/ethers-io/ethers.js) & [wagmi](https://wagmi.sh/)
- 🪝 Hooks: [ahooks](https://ahooks.js.org/zh-CN)
- 🛠 Utils: [date-fns](https://date-fns.org/v2.29.2/docs) & [lodash](https://lodash.com/) ...
- 😀 图标库: [react-icons](https://react-icons.github.io/react-icons/search)
- 📈 Chart: [recharts](https://recharts.org/en-US)

> 请使用 `pnpm` 作为包管理工具!

## 项目结构

```bash
📦src
 ┣ 📂components # 基础公共组件
 ┣ 📂const # 公共常量文件
 ┣ 📂contract # 合约相关
 ┃ ┗ 📂abi # 合约abi
 ┣ 📂env # 环境变量
 ┣ 📂features # 特性内容
 ┣ 📂hooks # 公用hooks
 ┣ 📂i18n # 国际化相关
 ┣ 📂layout # 公用页面布局
 ┣ 📂lib # 二次导出的第三方库
 ┣ 📂pages # 页面文件
 ┃ ┣ 📂api # api 相关
 ┃ ┣ 📜_app.tsx # app入口文件
 ┃ ┣ 📜_document.tsx # 页面模版
 ┣ 📂services # 后端接口模块文件
 ┣ 📂styles # 全局样式
 ┃ ┣ 📜theme.ts # chakra主题配置文件
 ┣ 📂types # 全局类型文件
 ┗ 📂utils # 通用工具函数
 ┃ ┣ 📜request.ts # fetch封装文件
```

## 👩‍🎤 Dev

复制 `.env.exmaple` 改成 `.env`，按需修改dev环境参数

```bash
pnpm i # install deps
pnpm dev # start dev
```

## 🧑‍🍳 Branch Rule

一些分支管理的基本规则

- **main** 生产分支，只能通过 PR 进行代码合并
- **pre**  预发环境，测试完毕待发布的**开发分支**合并到该分支模拟生产环境进行功能验证
- **test** 暂定预览测试分支
- iter-xx 迭代分支，一般开发分支，例如第一期 `iter-001`
- feat-xx 特性分支，一般基于 `iter` 或 `main` 分支拉取
  - 基于 `main` 分支代表此需要紧急上线
  - 基于 `iter` 分支代表迭代评估时需要特别处理
- fix-xx 缺陷bug修复分支，一般基于 `main` 分支拉取，修复线上bug用

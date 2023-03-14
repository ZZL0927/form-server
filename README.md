# 大作业服务端

该作业核心功能参考金山表单进行实现。

## 运行

```bash
# 下载依赖
$ npm i
# 构建
$ npm run build
# 运行
$ npm run serve
```

## 需求

前端样式、交互以及提示等内容参考金山表单进行实现。
相较于金山表单，功能做了较多删减，这里是原型图[https://modao.cc/app/ZlAsY7aErb1kbbQZFPMz5](https://modao.cc/app/ZlAsY7aErb1kbbQZFPMz5)。

## 功能模块

- 用户模块

`注册`、`登录`、`退出`、设置用户信息、获取用户信息、修改密码

- 表单模块

`创建`、`填写`、`搜索`、`查看填写详情`，`分享`

- 问题模块

`收藏`、`取消收藏`、`获取收藏列表`

> 有背景色的为核心功能模块

## 要求

- 使用CRA创建一个项目名为`work-final`的工程，可以用custom-cra或者其他进行扩展
- 使用function component风格进行代码编写
- 使用SCSS以及CSS Module编写css
- 使用context替代mobx进行全局状态管理
- 合理划分模块、封装组件以及自定义hook
- 先完成核心功能，用户信息查看修改等功能为加分功能
- 在`README.md`中描述项目运行方式、模块划分、路由设计、编码风格以及遇到的问题及其解决方法等
- 于8月25日下午5点30分之前提交work-final文件夹中

## 接口列表

### Auth

- 注册

```ts
URL: /api/auth/register
Method: POST
Body: {
  account: string
  pwd: string
  confirmPwd: string
}
```

- 登录

```ts
URL: /api/auth/login
Method: POST
Body: {
  account: string
  pwd: string
}
```

- 退出登录

```ts
URL: /api/auth/logout
Method: POST
```

### User

- 获取用户信息

```ts
URL: /api/user/getInfo
Method: GET
```

- 设置用户信息

```ts
URL: /api/user/setInfo
Method: POST
Body: {
  nickname: string
  avatar: string
}
```

- 修改密码

```ts
URL: /api/user/changePwd
Method: POST
Body: {
  oldPwd: string
  pwd: string
  confirmPwd: string
}
```

### Form

- 获取列表

```ts
URL: /api/form/list
Method: POST
Body: {
  offset?: number
  limit?: number
  isStar?: boolean
}
```

- 创建表单

```ts
URL: /api/form/create
Method: POST
Body: {
  title: string
  subTitle: string
  problems: {
    title: string
    type: "input" | "singleSelect" | "multiSelect"| "pullSelect" | "date" | "time" | "score"
    required: boolean
    isNew: boolean
    setting?: {
      options: {
        title: string
        status: 1 | 2
      }[]
    }
  }[]
}
```

- 获取表单

```ts
URL: /api/form/get
Method: POST
Body: {
  id: string
}
```

- 删除表单

```ts
URL: /api/form/delete
Method: POST
Body: {
  id: string
}
```

- 表单标星

```ts
URL: /api/form/star
Method: POST
Body: {
  id: string
}
```

- 表单取消标星

```ts
URL: /api/form/cancelStar
Method: POST
Body: {
  id: string
}
```

- 填写表单

```ts
URL: /api/form/input
Method: POST
Body: {
  formId: string
  problems: {
    id: string
    title: string
    type: "input" | "singleSelect" | "multiSelect"| "pullSelect" | "date" | "time" | "score"
    required: boolean
    setting?: {
      options: {
        title: string
        status: 1 | 2
      }[]
    }
    result?: {
      value: string | number | {
          id: string
          title: string
        } | {
          id: string
          title: string
        }[]
    }
  }[]
}
```

- 获取表单填写详情

```ts
URL: /api/form/formResult/:formId
Method: GET
```

- 获取表单单个填写详情

```ts
URL: /api/form/detail/:id
Method: POST
```

- 开始收集表单

```ts
URL: /api/form/start
Method: POST
Body: {
  id: string
}
```

- 结束收集表单

```ts
URL: /api/form/end
Method: POST
Body: {
  id: string
}
```

### Problem

- 获取基础题目类型

```ts
URL: /api/problem/listType
Method: GET
```

- 获取基础题目

```ts
URL: /api/problem/listBasic
Method: GET
```

- 获取收藏的题目

```ts
URL: /api/problem/listStar
Method: POST
```

- 收藏题目

```ts
URL: /api/problem/star
Method: POST
Body: {
  problem: {
    title: string
    type: "input" | "singleSelect" | "multiSelect"| "pullSelect" | "date" | "time" | "score"
    required: boolean
    setting?: {
      options: {
        title: string
        status: 1 | 2
      }[]
    } 
  }
}
```

- 取消收藏题目

```ts
URL: /api/problem/cancelStar
Method: POST
Body: {
  id: string
}
```
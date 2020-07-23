> 这是一个用于教学的后端服务器，它为前端项目开发提供业务功能的支持

> 注意，该服务器仅考虑业务逻辑，它并不提供给外部访问。前端开发者应该自行开发一个中间服务器，用于提供客户端的访问
>
> <img src="http://mdrs.yuanjin.tech/img/20200723140903.png" alt="image-20200723140903696" style="zoom:50%;" />

> 该后端服务器是使用 `eggjs + mysql` 搭建的，有兴趣的同学可以自行阅读源码

# 服务器部署说明

在一个经典的前后端分离结构中，后端服务器仅提供业务功能，因此，它不适合把接口暴露在外网

因此，在部署时，需要把后端服务器与中间服务器部署到一个内网中，中间服务器对外，后端服务器对内。

绝大部分情况下，后端服务器的部署都不需要前端开发者参与，当后端开发者部署完成后，会提供两个地址供前端开发者访问，比如：

```shell
http://192.168.3.31:7000 # 这是开发环境访问的地址
http://172.16.205.118:7000 # 这是生产环境访问的地址
```

注意，根据前面的描述，上面两个地址**只能在内网访问**

> 在不同的公司，后端接口不一定只能在内网访问，具体情况要看公司的部署结构

但由于是远程教学，我无法把后端服务器部署到你们所在的内网中，因此，**在项目学习阶段**，部署后端服务器需要靠同学们自行完成。

## 开发环境的部署

### 准备

1. 安装`mysql`，并建立一个数据库，建议取名为`to-do-list`

2. 克隆后端服务器项目，安装依赖

   ```
   git clone https://github.com/yjisme/todolist-back-server
   cd todolist-back-server
   npm install
   ```

### 配置

1. 配置`config/config.local.js`，该配置会在开发环境中发挥作用

   ```js
   exports.sequelize = {
     host: "127.0.0.1", // 选填，数据库的主机名，默认值 127.0.0.1
     port: 3306, // 选填，数据库的端口号，默认值 3306
     database: "to-do-list", // 选填，数据库的名称（见准备阶段），默认值 to-do-list
     username: "root", // 必填，连接数据库的账号
     password: "123456", // 必填，连接数据库的密码
   };

   exports.cluster = {
     listen: {
       port: 7001, // 选填，后端服务器启动后的端口号，默认7001
     },
   };
   ```

2. 配置`database/config.json`

   ```json
   {
     "development": {
       // 配置开发阶段的数据库信息
       "username": "root", // 连接数据库的账号
       "password": "ybybdwyJ42.", // 连接数据库的密码
       "database": "to-do-list", // 数据库的名称（见准备阶段）
       "host": "127.0.0.1", // 数据库的主机名
       "dialect": "mysql" // 固定不变
     },
     "production": {
       // 暂时不动
       "username": "root",
       "password": "ybybdwyJ42.",
       "database": "to-do-list",
       "host": "127.0.0.1",
       "dialect": "mysql"
     }
   }
   ```

### 同步数据库结构

运行命令：

```shell
npm run mig
```

如果无误，你会得到类似下面的提示：

```shell
> todolist-back-server@1.0.0 mig /Users/yuanjin/repo/personal/to-do-list/todolist-back-server
> sequelize-cli db:migrate


Sequelize CLI [Node: 14.3.0, CLI: 6.2.0, ORM: 5.22.3]

Loaded configuration file "database/config.json".
Using environment "development".
== 20200716095420-create-user: migrating =======
== 20200716095420-create-user: migrated (0.020s)

== 20200716213207-create-category: migrating =======
== 20200716213207-create-category: migrated (0.016s)

== 20200717072718-create-setting: migrating =======
== 20200717072718-create-setting: migrated (0.015s)

== 20200718053748-task: migrating =======
== 20200718053748-task: migrated (0.030s)
```

说明数据库的表已经完成了同步，现在，使用`navicat`打开`to-do-list`数据库，即可看到它的表结构

<img src="http://mdrs.yuanjin.tech/img/20200723144311.png" alt="image-20200723144311616" style="zoom:50%;" />

### 添加测试数据

在开发阶段，我们通常需要很多测试数据

运行命令：

```shell
npm run seed
```

如果无误，会得到类似于下面的提示：

```shell
> todolist-back-server@1.0.0 seed /Users/yuanjin/repo/personal/to-do-list/todolist-back-server
> npm run seed:undo && sequelize-cli db:seed:all


> todolist-back-server@1.0.0 seed:undo /Users/yuanjin/repo/personal/to-do-list/todolist-back-server
> sequelize-cli db:seed:undo:all


Sequelize CLI [Node: 14.3.0, CLI: 6.2.0, ORM: 5.22.3]

Loaded configuration file "database/config.json".
Using environment "development".
== 20200718060211-create-task: reverting =======
== 20200718060211-create-task: reverted (0.003s)

== 20200716213753-demo-categories: reverting =======
== 20200716213753-demo-categories: reverted (0.003s)

== 20200716111103-demo-users: reverting =======
== 20200716111103-demo-users: reverted (0.002s)


Sequelize CLI [Node: 14.3.0, CLI: 6.2.0, ORM: 5.22.3]

Loaded configuration file "database/config.json".
Using environment "development".
== 20200716111103-demo-users: migrating =======
== 20200716111103-demo-users: migrated (0.017s)

== 20200716213753-demo-categories: migrating =======
== 20200716213753-demo-categories: migrated (0.055s)

== 20200718060211-create-task: migrating =======
== 20200718060211-create-task: migrated (0.593s)
```

该命令会创建 100 个用户，1000 个分类，10000 个随机任务

如果将来需要重置测试数据，仅需重新运行该命令即可

测试数据中，用户的密码统一为`123123`

### 启动服务器

前面的步骤完成后，今后你要做的仅仅是启动后端服务器即可

运行命令：

```shell
npm run dev
```

如果无误，你会看到类似于下面的提示：

```shell
2020-07-23 14:49:12,485 INFO 63330 [master] node version v14.3.0
2020-07-23 14:49:12,486 INFO 63330 [master] egg version 2.27.0
2020-07-23 14:49:13,186 INFO 63330 [master] agent_worker#1:63331 started (698ms)
2020-07-23 14:49:13,947 INFO 63330 [master] egg started on http://127.0.0.1:7001 (1461ms)
```

在提示的最后一行，你会看到后端服务器的访问基地址，我这里是：`http://127.0.0.1:7001`

现在，测试一下，访问http://localhost:7001/api/user，看是否能够得到一个json格式的数据

## 生产环境的部署

TODO: 完成生产环境的部署说明

# api 接口说明

所有的 api 接口均遵循以下规则：

- 所有的请求地址均为以`/api`开头

- 请求体格式建议使用`application/json`

- 所有的接口均会返回`json`格式的对象，并且格式统一如下：

  ```json
  {
    "code": number, // 错误消息码，0表示没有错误，如果要判断是否有错误，应使用此字段进行判断
    "msg": string, // 错误的详细信息，若没有错误，则为空字符串
    "data": any // 具体的响应信息，若有错误，则为null
  }
  ```

- **统一的错误消息码**

  当发生错误时，http 响应码也会做出相应改变

  - 422：验证错误

    如果发生验证错误，比如添加用户时，填写的信息有误，则会按照下面的格式返回消息：

    ```json
    {
      "code": 422,
      "msg": "loginId is required",
      "data": null // 由于发生了错误，因此响应信息为null
    }
    ```

  - 500：未知错误

    当服务器发生了一个未预料的错误时，会使用该错误码

    ```json
    {
      "code": 500,
      "msg": "internal server error", // 该消息固定
      "data": null // 由于发生了错误，因此响应信息为null
    }
    ```

  - 403：权限不足

    ```json
    {
      "code": 403,
      "msg": "this account is not enable", // 该账号已被禁用
      "data": null // 由于发生了错误，因此响应信息为null
    }
    ```

## 用户

后端服务器启动后，会自动添加一个管理员账号`admin`，密码为`123456`

### 查询用户

请求地址：/api/user

请求方法：GET

query：

| 参数名  |     类型      | 默认值 | 是否必填 |                       说明                       |
| :-----: | :-----------: | :----: | :------: | :----------------------------------------------: |
|  page   | 大于 0 的数字 |   1    |    否    |                       页码                       |
|  limit  | 大于 0 的数字 |   10   |    否    |                      页容量                      |
| keyword |  任意字符串   |   无   |    否    | 查询关键字，该关键字会用于对账号或邮箱的模糊查询 |
| enable  |    0 或 1     |   无   |    否    |            查询启用(1)或禁用(0)的账号            |
| isadmin |    0 或 1     |   无   |    否    |            查询管理员(1)或普通用户(0)            |

返回值示例：

```json
{
  "code": 0, // 无错误
  "msg": "", // 无错误详情
  "data": {
    "count": 100, // 总数据量
    "rows": [
      // 当前页数据
      {
        "createdAt": 1594903826000, // 用户创建时间
        "updatedAt": 1594903826000, // 用户更新时间
        "id": 1, // 用户 id
        "loginId": "account1", // 用户账号
        "email": "example1@qq.com", // 用户邮箱
        "isAdmin": false, // 是否是管理员
        "enable": true // 账号是否启用
      }
    ]
  }
}
```

说明：返回的用户数组，按照创建时间的降序排序

### 添加用户

请求地址：/api/user

请求方法：POST

body：

```json
{
  "loginId": "account351", // 账号，唯一
  "loginPwd": "123123", // 密码
  "email": "217902345@qq.com", // 邮箱，唯一
  "isAdmin": true // 可选，默认为false
}
```

返回值示例：

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "createdAt": 1594932264704,
    "updatedAt": 1594932264704,
    "isAdmin": false,
    "id": 111,
    "loginId": "account351",
    "email": "217902345@qq.com",
    "enable": true
  }
}
```

错误示例：

```json
{
  "code": 422,
  "msg": "loginId is existing",
  "data": null
}
```

### 登录

请求地址：/api/user/login

请求方法：POST

body：

```json
{
  "loginId": "account1", // 可以使用账号，也可以使用邮箱
  "loginPwd": "123123"
}
```

登录成功示例：

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "createdAt": 1594903826000,
    "updatedAt": 1594903826000,
    "id": 1,
    "loginId": "account1",
    "email": "example1@qq.com",
    "isAdmin": false,
    "enable": true
  }
}
```

登录失败示例：

```json
{
  "code": 0,
  "msg": "",
  "data": null
}
```

账号被禁用示例：

```json
{
  "code": 403,
  "msg": "this accout is not enable",
  "data": null
}
```

### 修改用户信息

请求地址：/api/user/:id

请求方法：PUT

body：

```json
{
  // 以下信息均可选填，要修改哪些填哪些，但只能修改这三项
  "email": "adggg@qq.com",
  "loginPwd": "321321",
  "enable": true
}
```

修改成功示例：

```json
{
  "code": 0,
  "msg": "",
  "data": true
}
```

修改错误示例：

```json
{
  "code": 422,
  "msg": "email is not a valid email",
  "data": null
}
```

### 获取单个用户

请求地址：/api/user/one

请求方法：GET

query：

| 参数名  |     类型      | 默认值 | 是否必填 |     说明     |
| :-----: | :-----------: | :----: | :------: | :----------: |
|   id    | 大于 0 的数字 |   无   |    否    |   用户编号   |
|  email  |  邮箱字符串   |   无   |    否    |   用户邮箱   |
| loginid |  任意字符串   |   无   |    否    | 用户登录账号 |

这三个值只需要给一个即可，如果给定了多个，优先顺序：id>email>loginid

成功示例 1：找到用户

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "createdAt": 1594903826000,
    "updatedAt": 1594933767000,
    "id": 1,
    "loginId": "account1",
    "email": "adggg@qq.com",
    "isAdmin": false,
    "enable": true
  }
}
```

成功示例 2：未找到用户

```json
{
  "code": 0,
  "msg": "",
  "data": null
}
```

## 全局配置接口

### 获取全局配置

请求地址：/api/setting

请求方法：GET

获取结果示例：

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "maxCategoryNumber": 10, // 每个用户最多可以添加多少个任务分类
    "siteName": "渡一云规划", // 网站的标题
    "siteLogo": "", // 网站的logo
    "siteDescription": "", // 网站的描述
    "siteKeywords": "", // 网站的SEO关键词
    "urgencyMinute": 60 // 默认情况下，距离任务期限多少分钟内会将任务标记为「紧急」
  }
}
```

### 更改全局配置

请求地址：/api/setting

请求方法：PUT

body：

```json
{
  "maxCategoryNumber": 5, // 每个用户最多可以添加多少个任务分类
  "siteName": "渡一云规划", // 网站的标题
  "siteLogo": "/logo.png", // 网站的logo
  "siteDescription": "sdaf", // 网站的描述
  "siteKeywords": "todolist,时间规划", // 网站的SEO关键词
  "urgencyMinute": 60 // 默认情况下，距离任务期限多少分钟内会将任务标记为「紧急」
}
// 以上字段均为选填，需要修改哪一个，填写哪一个
```

返回更改后的全局配置：

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "maxCategoryNumber": "5",
    "siteName": "渡一云规划",
    "siteLogo": "/logo.png",
    "siteDescription": "sdaf",
    "siteKeywords": "todolist,时间规划",
    "urgencyMinute": 60
  }
}
```

## 任务分类

### 获取所有任务分类

请求地址：/api/:userId/cate

- `:userId`：分类所属的用户 id

请求方法：GET

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "createdAt": 1595486692000,
      "updatedAt": 1595490799000,
      "deletedAt": null,
      "id": 2,
      "userId": 1,
      "name": "工作"
    },
    {
      "createdAt": 1595486692000,
      "updatedAt": 1595486692000,
      "deletedAt": null,
      "id": 3,
      "userId": 1,
      "name": "测试分类3"
    }
  ]
}
```

### 添加任务分类

请求地址：/api/:userId/cate

- `:userId`：用户的 id

请求方法：POST

body:

```json
{
  "name": "工作" // 分类名称
}
```

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "createdAt": 1595490168693,
    "updatedAt": 1595490168693,
    "deletedAt": null,
    "id": 1003,
    "userId": 1,
    "name": "工作"
  }
}
```

添加失败的返回示例：

```json
{
  "code": 422,
  "msg": "用户的分类数量不能超过设置的分类数量，目前该用户的分类数量是12，设置的最大分类数量是5",
  "data": null
}
```

### 修改任务分类

请求地址：/api/:userId/cate/:categoryId

- `:userId`：用户的 id
- `:categoryId`：分类的 id

请求方法：PUT

body：

```json
{
  "name": "工作2"
}
```

成功返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": true
}
```

失败返回示例：

```json
{
  "code": 422,
  "msg": "category is not exits", // 如果你尝试修改不属于该用户的分类，会得到此验证错误
  "data": null
}
```

### 删除分类

请求地址：/api/:userId/cate/:categoryId

- `:userId`：用户的 id
- `:categoryId`：分类的 id

请求方法：DELETE

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": true
}
```

说明：

- 如果删除的分类不存在，或者删除的是其他人的分类，会默默失败，不会有错误提示
- 这里的删除，是将其放入到废纸篓

## 任务

### 添加任务

请求地址：/api/:userId/task

- `:userId`：任务所属的用户 id

请求方法：POST

body:

```json
{
  "title": "开会", // 必填，任务标题
  "remark": "todolist项目首次会议", // 选填，任务描述、备注
  "deadLine": 1595492199646, // 选填，任务到期时间
  "urgencyMinute": 30, // 选填，距离到期时间多少分钟内为紧急任务
  "categoryId": 5 // 选填，任务所属的分类
}
```

成功返回示例：

```js
{
    "code": 0,
    "msg": "",
    "data": {
        "deadLine": 1595492199646, // 任务的到期时间
        "finishDate": null, // 任务完成的日期
        "isFinish": false, // 任务是否已完成
        "isUrgency": false, // 任务是否是紧急任务
        "isPass": true, // 任务是否已过期
        "createdAt": 1595492235229, // 任务创建时间
        "updatedAt": 1595492235229, // 任务修改时间
        "deletedAt": null, // 任务删除时间
        "id": 10001, // 任务编号
        "userId": 1, // 所属用户编号
        "categoryId": 5, // 所属分类编号
        "title": "开会", // 任务标题
        "remark": "todolist项目首次会议", // 任务描述
        "urgencyMinute": 30 // 距离到期时间多少分钟内为紧急任务
    }
}
```

失败返回示例：

```json
{
  "code": 422,
  "msg": "category is not exits", // 分类不存在
  "data": null
}
```

### 修改任务

请求地址：/api/:userId/task/:taskId

- `:userId`：任务所属的用户 id
- `:taskId`：要修改的任务 id

请求方法：PUT

body:

```json
{
  "title": "新的任务",
  "remark": "",
  "deadLine": 1595492737405,
  "categoryId": 2,
  "urgencyMinute": 10
}
```

以上字段均为选填，要修改哪个填哪个

成功返回示例：

```js
{
    "code": 0,
    "msg": "",
    "data": true
}
```

失败返回示例：

```json
{
  "code": 422,
  "msg": "category is not exits", // 你修改的分类不存在
  "data": null
}
```

### 删除任务

请求地址：/api/:userId/task/:taskId

- `:userId`：任务所属的用户 id
- `:taskId`：要修改的任务 id

请求方法：DELETE

成功返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": true
}
```

失败返回示例：

```json
{
  "code": 422,
  "msg": "task is not exits",
  "data": null
}
```

### 查询-今日任务

该接口可查询出某个用户今日需要完成的任务，这样的任务特点是：

- deadLine 有值
- deadLine 的值位于今日凌晨到明日凌晨之间
- 任务未完成

请求地址：/api/:userId/task/today

- `:userId`：用户的 id

请求方法：GET

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": [任务对象, 任务对象]
}
```

### 查询-计划中的任务

该接口可查询出某个用户将来需要完成的任务，这样的任务特点是：

- deadLine 有值
- deadLine 的值位于明日凌晨之后
- 任务未完成

请求地址：/api/:userId/task/schedule

- `:userId`：用户的 id

请求方法：GET

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "2020-08-17": [任务对象],
    "2020-09-18": [任务对象, 任务对象]
  }
}
```

返回结果按照「天」聚合每天的计划任务

### 查询-过期任务

该接口可查询出某个用户已经过期未完成的任务，这样的任务特点是：

- 任务未完成
- deadLine 有值
- deadLine 的值在当前时间之前

请求地址：/api/:userId/task/pass

- `:userId`：用户的 id

请求方法：GET

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": [任务对象, 任务对象, 任务对象]
}
```

### 查询-紧急任务

该接口可查询出某个用户需要紧急完成的任务：

- deadLine 有值
- deadLine 的值和当前时间点的差值小于 urgencyMinute
- 任务未完成

请求地址：/api/:userId/task/urgency

- `:userId`：用户的 id

请求方法：GET

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": [任务对象, 任务对象, 任务对象]
}
```

### 查询-日志薄

该接口可查询出某个用户的日志薄，这样的任务有以下特点：

- 任务已完成

请求地址：/api/:userId/task/notebook

- `:userId`：用户的 id

请求方法：GET

query：

| 参数名 |     类型      | 默认值 | 是否必填 |  说明  |
| :----: | :-----------: | :----: | :------: | :----: |
|  page  | 大于 0 的数字 |   1    |    否    |  页码  |
| limit  | 大于 0 的数字 |   10   |    否    | 页容量 |

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "count": 21, // 数据总量
    "data": {
      "2020-04": [任务对象, 任务对象],
      "2020-07": [任务对象, 任务对象]
    }
  }
}
```

返回的数据按照月份聚合

### 查询-分类任务

该接口可查询出某个用户某个分类下的未完成任务

请求地址：/api/:userId/task/cate/:categoryId

- `:userId`：用户的 id
- `:categoryId`：分类的 id

请求方法：GET

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": [任务对象, 任务对象]
}
```

### 查询-搜索任务

该接口课按关键字搜索某个用户的任务

请求地址：/api/:userId/task/search

- `:userId`：用户的 id

请求方法：GET

query：

| 参数名 |     类型      | 默认值 | 是否必填 |  说明  |
| :----: | :-----------: | :----: | :------: | :----: |
|  page  | 大于 0 的数字 |   1    |    否    |  页码  |
| limit  | 大于 0 的数字 |   10   |    否    | 页容量 |
|  key   |    字符串     |   无   |    否    | 关键字 |

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "count": 125,
    "rows": [任务对象, 任务对象]
  }
}
```

### 查询-汇总信息

该接口可查询出某个用户各种任务汇总信息：

请求地址：/api/:userId/task/summary

- `:userId`：用户的 id

请求方法：GET

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "summary": {
      // 概要信息
      "today": 2, // 今日未完成的任务数量
      "noteBook": 21, // 日志薄，已完成的任务数量
      "pass": 2, // 已过期的任务数量
      "urgency": 0, // 紧急的任务数量
      "schedule": 2 // 将来的任务数量
    },
    "category": {
      "2": 0, // 分类id为2的未完成任务数量
      "3": 0, // 分类id为3的未完成任务数量
      "4": 1,
      "5": 1,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 1,
      "1002": 0,
      "1003": 0
    }
  }
}
```

## 废纸篓

### 查询废纸篓

请求地址：/api/:userId/trash

- `:userId`：用户的 id

请求方法：GET

query：

| 参数名 |     类型      | 默认值 | 是否必填 |  说明  |
| :----: | :-----------: | :----: | :------: | :----: |
|  page  | 大于 0 的数字 |   1    |    否    |  页码  |
| limit  | 大于 0 的数字 |   10   |    否    | 页容量 |

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "count": 76,
    "row": [
      {
        "id": 83, // 原本的编号
        "type": "task", // 数据的类型 task-任务，category-分类
        "name": "新的任务", // 数据的名称
        "deletedAt": 1595493001000 // 删除时间
      },
      {
        "id": 1,
        "type": "category",
        "name": "测试分类1",
        "deletedAt": 1595490887000
      }
    ]
  }
}
```

### 恢复

请求地址：/api/:userId/trash/restore

- `:userId`：用户的 id

请求方法：POST

body：

```json
[
  {
    "id": 12, // 要恢复的数据id
    "type": "task" // 要恢复的数据类型 task-任务，category-分类
  },
  {
    "id": 1,
    "type": "category"
  },
  {
    "id": 9,
    "type": "task"
  },
  {
    "id": 77,
    "type": "task"
  }
]
```

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": true
}
```

### 彻底删除

请求地址：/api/:userId/trash/delete

- `:userId`：用户的 id

请求方法：POST

body：

```json
[
  {
    "id": 12, // 要彻底删除的数据id
    "type": "task" // 要彻底删除的数据类型 task-任务，category-分类
  },
  {
    "id": 1,
    "type": "category"
  },
  {
    "id": 9,
    "type": "task"
  },
  {
    "id": 77,
    "type": "task"
  }
]
```

返回示例：

```json
{
  "code": 0,
  "msg": "",
  "data": true
}
```

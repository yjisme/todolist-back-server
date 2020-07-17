> 这是一个用于教学的后端服务器，它为前端项目开发提供后端支持

> 注意，这只是一个业务服务器，仅考虑业务逻辑
>
> 关于安全、效率、缓存、权限等，均需要中间服务器根据情况自行处理

# 服务器启动说明

服务器启动后，会一些初始化操作：

- 初始化超级管理员

  如果服务器发现数据库中没有`admin`用户，则会自动初始化一个`admin`用户，其邮箱随机生成，密码默认为`123456`

  

# 服务器部署说明

## 准备

部署的计算机首先要安装`mysql`，并在`mysql`中创建好数据库`to-do-list`

## 克隆

```
git clone ???
```



- 开发服务器：该服务器专门为前端开发阶段提供服务
- 生产服务器：该服务器专门为前端生产环境提供服务

大部分情况下，这两台服务器**完全一致**，仅数据不同，开发服务器提供的是一些测试数据，生产服务器是真实的数据。

后端开发人员会提供两个服务器的访问地址，比如，我们这里提供的访问地址有两个：

- 开发服务器：http://todo-dev-server.yuanjin.tech
- 生产服务器：http://todo-server.yuanjin.tech

> 在真实的情况下，无论是开发服务器，还是生产服务器，都不会对外提供访问
>
> 但由于是远程教学，难以将服务器架设到内网，只能使用外网访问地址
>
> 为了避免恶意访问接口，在所有的请求头中必须加上`appkey:渡一开发平台的appkey`

# api 接口说明

## 通用说明

所有的api接口均遵循以下规则：

- 所有的请求地址均为以`/api`开头

- 消息体格式建议使用`application/json`

- 所有的接口均会返回`json`格式的对象，并且格式统一如下：

  ```json
  {
    "code": number, // 错误消息码，0表示没有错误，如果要判断是否有错误，应使用此字段进行判断
    "detail": any, // 错误的详细信息，若没有错误，则为null
    "data": any, // 具体的响应信息，若有错误，则为null
  }
  ```

- **统一的错误消息码**

  当发生错误时，http 响应码也会做出相应改变

  - 422：验证错误

    如果发生验证错误，比如添加用户时，填写的信息有误，则会按照下面的格式返回消息：

    ```json
    {
      "code": 422,
      "detail": [ // 错误的详细信息
        {"message": "loginId is required", "field": "loginId" }
      ],
      "data": null // 由于发生了错误，因此响应信息为null
    }
    ```

  - 500：未知错误

    当服务器发生了一个未预料的错误时，会使用该错误码

    ```json
    {
      "code": 500,
      "detail": "internal server error", // 该消息固定
      "data": null // 由于发生了错误，因此响应信息为null
    }
    ```

  - 403：权限不足
  
    ```json
    {
      "code": 403,
      "detail": "this account is not enable", // 该账号已被禁用
      "data": null // 由于发生了错误，因此响应信息为null
    }
    ```
  
    

## 用户接口

### 查询用户

请求地址：/api/user

请求方法：GET

query：

| 参数名  |     类型      | 默认值 | 是否必填 |                       说明                       |
| :-----: | :-----------: | :----: | :------: | :----------------------------------------------: |
|  query  | 大于 0 的数字 |   1    |   必填   |                       页码                       |
|  limit  |  大于0的数字  |   10   |    否    |                      页容量                      |
| keyword |  任意字符串   |   无   |    否    | 查询关键字，该关键字会用于对账号或邮箱的模糊查询 |
| enable  |     0或1      |   无   |    否    |            查询启用(1)或禁用(0)的账号            |
| isadmin |     0或1      |   无   |    否    |            查询管理员(1)或普通用户(0)            |

返回值示例：

```json
{
  "code": 0, // 无错误
  "detail": null, // 无错误详情
  "data": {
    "count": 100, // 总数据量
    "rows": [ // 当前页数据
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
  "loginId":"account351", // 账号，唯一
  "loginPwd":"123123", // 密码
  "email":"217902345@qq.com", // 邮箱，唯一
  "isAdmin":true // 可选，默认为false
}
```

返回值示例：

```json
{
    "code": 0,
    "detail": null,
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
  "detail": [
    {
      "message": "loginId is existing", // 账号已存在
      "field": "loginId"
    }
  ],
  "data": null
}
```

### 登录

请求地址：/api/user/login

请求方法：POST

body：

```json
{
  "loginId":"account1", // 可以使用账号，也可以使用邮箱
  "loginPwd":"123123"
}
```

登录成功示例：

```json
{
    "code": 0,
    "detail": null,
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
    "detail": null,
    "data": null
}
```

账号被禁用示例：

```json
{
    "code": 422,
    "detail": "this accout is not enable",
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
  "email":"adggg@qq.com",
  "loginPwd":"321321",
  "enable":true
}
```

修改成功示例：

```json
{
    "code": 0,
    "detail": null,
    "data":true
}
```

修改错误示例：

```json
{
    "code": 422,
    "detail": [
        {
            "message": "email is not a valid email",
            "field": "email"
        }
    ],
    "data": null
}
```



### 获取单个用户

请求地址：/api/user/one

请求方法：GET

query：

| 参数名  |     类型      | 默认值 | 是否必填 |                       说明                       |
| :-----: | :-----------: | :----: | :------: | :----------------------------------------------: |
|   id    | 大于 0 的数字 |   无    |   必填   |                       页码                       |
|  email  |  邮箱字符串   |   无   |    否    |                      页容量                      |
| loginid |  任意字符串   |   无   |    否    | 查询关键字，该关键字会用于对账号或邮箱的模糊查询 |

这三个值只需要给一个即可，优先顺序：id>email>loginid

成功示例1：找到用户

```json
{
    "code": 0,
    "detail": null,
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

成功示例2：未找到用户

```json
{
    "code": 0,
    "detail": null,
    "data": null
}
```




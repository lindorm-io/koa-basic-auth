# @lindorm-io/koa-basic-auth
Basic Auth middleware for @lindorm-io/koa applications

## Installation
```shell script
npm install --save @lindorm-io/koa-basic-auth
```

### Peer Dependencies
This package has the following peer dependencies: 
* [@lindorm-io/common](https://www.npmjs.com/package/@lindorm-io/common)
* [@lindorm-io/global](https://www.npmjs.com/package/@lindorm-io/global)
* [@lindorm-io/winston](https://www.npmjs.com/package/@lindorm-io/winston)
* [koa](https://www.npmjs.com/package/koa)

## Usage
```typescript
koaApp.addMiddleware(basicAuthMiddleware({
  username: "username",
  password: "password",
}))
```

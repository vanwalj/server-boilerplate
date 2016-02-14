'use strict';

const fs = require('fs');

const Router = require('koa-router');
const compose = require('koa-compose');

/**
 * Automatically generate routes based on folder tree
 */

module.exports.routes = () =>
  compose(
    fs.readdirSync(__dirname)
      .filter(file => fs.statSync(`${ __dirname }/${ file }`).isDirectory())
      .map(directory =>
        fs.readdirSync(`${ __dirname }/${ directory }`)
          .map(file => require(`${ __dirname }/${ directory }/${ file }`))
          .reduce((router, route) =>
            router[route.method](route.path, route.handler),
            new Router({ prefix: `/${directory}` })
          )
      )
      .map(router => compose([
        router.allowedMethods(),
        router.routes()
      ]))
  );

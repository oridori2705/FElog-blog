"use strict";

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::post.post");
//TODO : REST API 일때는 여기서 Post에 대한 Create,Update,Delete에 대한 추가 기능을 작성해야함(user정보가 같이 안들어가는 문제)

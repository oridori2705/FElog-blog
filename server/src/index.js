"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  // TODO : 아래 중복되는 코드 리팩토링 수행
  register({ strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension");

    const extension = () => ({
      resolvers: {
        Mutation: {
          //args : graphql로 보내준 데이터
          //'api::post.post' : Post에서 하나의 데이터를 가져오겠다.
          //{populate:{user:true}} : 연결된 데이터를 가져오겠냐에서 user데이터를 가져옴
          //ctx : request 객체와 헤더 정보를 담고있음,
          updatePost: async (_, args, ctx) => {
            const { toEntityResponse } = strapi
              .plugin("graphql")
              .service("format").returnTypes;
            const post = await strapi.entityService.findOne(
              "api::post.post",
              args.id,
              { populate: { user: true } }
            );
            //ctx에user 정보가 있는 이유는 토큰으로 인해 자동으로 넣어준다.
            if (post.user.id !== ctx.state.user.id) {
              //찾은 post의 아이디가 request로 온 id와 다르다면 수정을 못하도록 에러 발생
              throw new Error("You are not authorized to update this post");
            }

            const updatePost = await strapi.entityService.update(
              "api::post.post",
              args.id,
              args
            );
            return toEntityResponse(updatePost);
          },
          createPost: async (_, args, ctx) => {
            const { toEntityResponse } = strapi
              .plugin("graphql")
              .service("format").returnTypes;
            const post = await strapi.entityService.create("api::post.post", {
              data: {
                ...args.data,
                body: args.data.body,
                user: ctx.state.user.id,
              }, // 이 부분이 중요하다 data:{...}에 넣어서 user을 보내줘야하고, args는 이미 data에 감싸져있으므로 .data로 명시해야한다.
            });
            return toEntityResponse(post);
          },
          deletePost: async (_, args, ctx) => {
            const { toEntityResponse } = strapi
              .plugin("graphql")
              .service("format").returnTypes;
            const post = await strapi.entityService.findOne(
              "api::post.post",
              args.id,
              { populate: { user: true } }
            );
            if (post.user.id !== ctx.state.user.id) {
              throw new Error("You are not authorized to delete this post");
            }

            const deletePost = await strapi.entityService.delete(
              "api::post.post",
              args.id
            );
            return toEntityResponse(deletePost);
          },
          //Comment
          updateComment: async (_, args, ctx) => {
            const { toEntityResponse } = strapi
              .plugin("graphql")
              .service("format").returnTypes;
            const post = await strapi.entityService.findOne(
              "api::comment.comment",
              args.id,
              { populate: { user: true } }
            );

            if (post.user.id !== ctx.state.user.id) {
              throw new Error("You are not authorized to update this comment");
            }

            const updatePost = await strapi.entityService.update(
              "api::comment:comment",
              args.id,
              args
            );
            return toEntityResponse(updatePost);
          },
          createComment: async (_, args, ctx) => {
            const { toEntityResponse } = strapi
              .plugin("graphql")
              .service("format").returnTypes;
            const post = await strapi.entityService.create(
              "api::comment.comment",
              {
                data: { ...args.data, user: ctx.state.user.id },
              }
            );

            return toEntityResponse(post);
          },
          deleteComment: async (_, args, ctx) => {
            const { toEntityResponse } = strapi
              .plugin("graphql")
              .service("format").returnTypes;
            const post = await strapi.entityService.findOne(
              "api::comment.comment",
              args.id,
              { populate: { user: true } }
            );
            if (post.user.id !== ctx.state.user.id) {
              throw new Error("You are not authorized to delete this comment");
            }

            const deletePost = await strapi.entityService.delete(
              "api::comment.comment",
              args.id
            );
            return toEntityResponse(deletePost);
          },
        },
      },
    });
    //extensionService.use를 이용해서 만든 extension을 추가해줘야한다.
    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};

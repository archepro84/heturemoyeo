const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/auth-middleware");
const { Posts, Tags, sequelize, Sequelize } = require("../models");
const Joi = require("joi");

const postSchema = Joi.object({
  title: Joi.string().min(1).max(100).allow(null, "").required(),
  postImg: Joi.string().allow(null).required(),
  content: Joi.string().max(1000),
  maxMember: Joi.number().max(255).required(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  place: Joi.string(),
  bring: Joi.string(),
  public: Joi.boolean(),
  tag: Joi.array(),
});

const postPutSchema = Joi.object({
  postId: Joi.number().required(),
  title: Joi.string().min(1).max(100).allow(null, "").required(),
  postImg: Joi.string().allow(null).required(),
  content: Joi.string().max(1000),
  maxMember: Joi.number().max(255).required(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  place: Joi.string(),
  bring: Joi.string(),
  public: Joi.boolean(),
  tag: Joi.array(),
});

const postIdSchema = Joi.object({
  postId: Joi.number().required(),
});

router
  //  글 쓰기 api
  .route("/")
  .post(authmiddleware, async (req, res) => {
    try {
      const { userId } = res.locals.user;
      let {
        title,
        postImg,
        content,
        maxMember,
        startDate,
        endDate,
        place,
        bring,
        public,
        tag,
      } = await postSchema.validateAsync(req.body);

      const tagArray = Array();

      if (public === true) {
        public = 1;
      } else if (public === false) {
        public = 0;
      } else {
        res.status(412).send({
          errorMessage: "public의 값이 적절하지 않습니다.",
        });
      }

      const postId = await Posts.create({
        userId,
        title,
        postImg,
        content,
        maxMember,
        startDate,
        endDate,
        place,
        bring,
        public,
      }).then((post) => {
        return post.null;
      });

      if (Object.keys(tag).length) {
        for (const t of tag) {
          tagArray.push({ postId, tag: t });
        }
        await Tags.bulkCreate(tagArray);
      }

      res.send();
    } catch (error) {
      res.status(412).send({ errorMessage: "게시글 작성에 실패했습니다." });
    }
  })

  .get(authmiddleware, async (req, res) => {
    try {
      const { postId } = await postIdSchema.validateAsync(req.body);
      const tagArray = Array();

      let post = await Posts.findOne({
        where: { postId },
      }).then((postFind) => {
        if (!postFind) {
          res.status(412).send({
            errorMessage: "해당 post를 찾을 수 없습니다.",
          });
          return;
        }
        return postFind["dataValues"];
      });

      await Tags.findAll({
        where: { postId },
      }).then((tagFind) => {
        if (!tagFind) {
          res.status(412).send({
            errorMessage: "해당 tag를 찾을 수 없습니다.",
          });
          return;
        }
        for (const t of tagFind) {
          tagArray.push(t["dataValues"].tag);
        }
      });

      res.send({
        title: post.title,
        postImag: post.postImg,
        content: post.content,
        maxMember: post.maxMember,
        startDate: post.startDate,
        endDate: post.endDate,
        place: post.place,
        bring: post.bring,
        tag: tagArray,
      });
    } catch (error) {
      res.status(400).send({
        errorMessage: "postId의 형식이 잘못됐습니다.",
      });
    }
  })

  //   수정 api
  .put(authmiddleware, async (req, res) => {
    try {
      const { userId } = res.locals.user;

      let {
        postId,
        title,
        postImg,
        content,
        maxMember,
        startDate,
        endDate,
        place,
        bring,
        public,
        tag,
      } = await postPutSchema.validateAsync(req.body);

      const tagArray = Array();

      if (public === true) {
        public = 1;
      } else if (public === false) {
        public = 0;
      } else {
        res.status(412).send({
          errorMessage: "public의 값이 적절하지 않습니다.",
        });
      }

      await Posts.findOne({
        where: { userId, postId },
      }).then((user) => {
        if (!user) throw new Error("Post 작성자와 일치하지 않습니다.");
      });

      await Posts.update(
        {
          title,
          postImg,
          content,
          maxMember,
          startDate,
          endDate,
          place,
          bring,
          public,
        },
        {
          where: { userId, postId },
        }
      ).then((updateCount) => {
        if (updateCount < 1) {
          res.status(400).send({
            errorMessage: "데이터가 변경되지 않았습니다.",
          });
          return;
        }
      });

      if (Object.keys(tag).length) {
        await Tags.destroy({
          where: {
            postId,
          },
        }).then((deleteCount) => {
          if (deleteCount < 1) {
            res.status(400).send({
              errorMessage: "데이터가 삭제되지 않았습니다.",
            });
            return;
          }
        });

        for (const t of tag) {
          tagArray.push({ postId, tag: t });
        }
        await Tags.bulkCreate(tagArray);
      }

      res.send();
    } catch (error) {
      res
        .status(412)
        .send({ errorMessage: "데이터를 수정하는데 실패했습니다." });
    }
  })

  //   삭제 api
  .delete(authmiddleware, async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const postId = await postIdSchema.validateAsync(req.body.postId);

      await Posts.destroy({
        where: {
          postId,
          userId,
        },
      }).then((deleteCount) => {
        if (deleteCount < 1) {
          res.status(400).send({
            errorMessage: "데이터가 삭제되지 않았습니다.",
          });
          return;
        }
      });

      res.status(200).send();
    } catch (error) {
      res.status(412).send();
    }
  });

module.exports = router;

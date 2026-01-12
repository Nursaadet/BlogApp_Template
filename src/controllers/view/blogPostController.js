"use strict";
/* -------------------------------------------------------
    EXPRESSJS - BLOG Project with Mongoose
------------------------------------------------------- */

const BlogPost = require("../../models/blogPostModel");
const BlogCategory = require("../../models/blogCategoryModel");
const removeQueryParam = require("../../helpers/removeQueryParam");
// ------------------------------------------
// BlogPost
// ------------------------------------------

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(
      BlogPost,
      { isPublished: true },
      "blogCategoryId"
    );
    // res.status(200).send({
    //   error: false,
    //   count: data.length,
    //   details: await res.getModelListDetails(BlogPost,{isPublished:true}),
    //   result: data,
    // });
    const categories = await BlogCategory.find({});
    const recentPosts = await BlogPost.find()
      .sort({ createdAt: "desc" })
      .limit(3);
    const details = await res.getModelListDetails(BlogPost, {
      isPublished: true,
    });

    //req.originalUrl
    let pageUrl = "";
    const queryString = req.originalUrl.split("?")[1];
    if (queryString) {
      pageUrl = removeQueryParam(queryString, "page");
    }
    pageUrl = pageUrl ? "&" + pageUrl : "";

    res.render("index", {
      data,
      categories,
      posts: data,
      recentPosts,
      details,
      pageUrl,
    });
  },

  create: async (req, res) => {
    // res.status(201).send({
    //   error: false,
    //   body: req.body,
    //   result: data,
    // });
    if (req.method == "POST") {
      req.body.userId = req.session?.user.id;
      const data = await BlogPost.create(req.body);
      res.redirect("/");
    } else {
      const categories = await BlogCategory.find();
      //user:req.session?.user
      res.render("postForm", { categories, post: null });
    }
  },

  read: async (req, res) => {
    // req.params.postId
    // const data = await BlogPost.findById(req.params.postId)
    const data = await BlogPost.findOne({ _id: req.params.postId }).populate(
      "blogCategoryId"
    ); // get Primary Data

    // res.status(200).send({
    //   error: false,
    //   result: data,
    // });
    res.render("postRead", { post: data });
  },

  update: async (req, res) => {
    // const data = await BlogPost.findByIdAndUpdate(req.params.postId, req.body, { new: true }) // return new-data

    // res.status(202).send({
    //   error: false,
    //   body: req.body,
    //   result: data, // update infos
    //   newData: await BlogPost.findOne({ _id: req.params.postId }),
    // });

    if (req.method == "POST") {
      const data = await BlogPost.updateOne(
        { _id: req.params.postId },
        req.body,
        { runValidators: true }
      );
      res.redirect("/");
    } else {
      const data = await BlogPost.findOne({
        _id: req.params.postId,
      }).populate("blogCategoryId");
      const categories = await BlogCategory.find();
      res.render("postForm", { categories, post: data });
    }
  },

  delete: async (req, res) => {
    let url = req.get("Referrer");

    if (url === "/blog/post") {
      url = "/blog/post";
    } else if (url?.includes("filter")) {
      url = req.get("Referrer");
    }

    const post = await BlogPost.findOne({ _id: req.params.postId }).populate(
      "blogCategoryId"
    );
    await BlogPost.deleteOne({ _id: req.params.postId });

    const newUrl = `/blog/post?filter[blogCategoryId]=${post.blogCategoryId.id}`;
    //res.redirect("/");
    res.redirect(url || newUrl || "/blog/post");
  },
};

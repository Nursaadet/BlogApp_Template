"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */
// ROUTER INDEX:

// URL: /

// blogCategory:
router.use("/category", require("../api/blogCategoryRoute"));
// blogPost:
router.use("/post", require("./blogPostRoute"));
// user:
router.use("/user", require("./userRoute"));

router.use("/", require("./authRoute"));
module.exports = router;

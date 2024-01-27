const router = require("express").Router();
const requireAuth = require("../middleware/requireAuth");


const Article = require("../models/Articles.model");

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { title, text } = req.body;
    const createdArticle = await Article.create({ title, text, user: userId });
    res.status(201).json({ message: "Article created", data: createdArticle });
  } catch (err) {
    next(err);
  }
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const articles = await Article.find()
      .select({ title: 1, text: 1 })
      .populate("user", { _id: 0, email: 1 });
    res
      .status(201)
      .json({ message: "All articles successfully get", data: articles });
  } catch (error) {
    next(error);
  }
});

router.get("/:articleId", async (req, res, next) => {
  const articleId = req.params.articleId;
  try {
    const article = await Article.findById(articleId)
      .select({ title: 1, text: 1 })
      .populate("user", { _id: 0, email: 1 });
    res.status(201).json({ message: "Article found by ID", data: article });
  } catch (error) {
    next(error);
  }
});

router.put("/:articleId", async (req, res, next) => {
  const articleId = req.params.articleId;
  const { title, text } = req.body;
  const newArticle = { title, text };
  try {
    const article = await Article.findByIdAndUpdate(articleId, newArticle, {
      new: true,
    }).populate("user", { _id: 0, email: 1 });
    res
      .status(201)
      .json({ message: "Article successfully updated", data: article });
  } catch (error) {
    next(error);
  }
});

router.delete("/:articleId", async (req, res, next) => {
  const articleId = req.params.articleId;
  try {
    const article = await Article.findByIdAndDelete(articleId);
    res.status(201).json({ message: "Articles are deleted", data: article });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

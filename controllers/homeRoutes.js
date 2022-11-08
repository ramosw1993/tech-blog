const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../helpers/auth");

// Get all projects and JOIN with user data
router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      // attributes: ['id','title', 'content', 'date_created'],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const posts = postData.map((posts) => posts.get({ plain: true }));
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get("/post/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });
    const post = postData.get({ plain: true });
    res.render("post", {
      ...post,
      logged_in: req.session.logged,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });
    const newPost = postData.get({ plain: true });
    res.render("edit", {
      ...newPost,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/add', (req, res) => {
  if (req.session.logged_in) {
    res.render('add', {
      logged_in: req.session.logged_in,
    });
    return;
  }
  res.render('login');
});

  // If the user is already logged in, redirect the request to another route
router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("homepage");
    return;
  }
  res.render("login");
});

module.exports = router;

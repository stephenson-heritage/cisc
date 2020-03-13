const router = require("express").Router();
const pageModel = require("../model/pageModel");

// router.post("/login", async (req, res) => {
//   console.log(req.body);
//   res.send("body " + req.body.username);
// });

router.all("/", async (req, res) => {
  getPageWithDefault(req, res);
});

router.post("/add/", async (req, res, next) => {
  if (req.user !== undefined && req.user.auth) {
    let d = req.body;
    const result = await pageModel.addPage(
      d.pageKey,
      d.title,
      d.content,
      d.shownInMenu === "on",
      d.menuOrder
    );

    if (result.error !== undefined) {
      res.render("editedPageView", {
        page: { title: "Error Adding Page", pageKey: d.pageKey },
        user: req.user,
        error: result.error
      });
    } else {
      res.render("editedPageView", {
        page: { title: d.title, pageKey: d.pageKey },
        user: req.user,
        menu: await pageModel.getMenu()
      });
    }
  } else {
    next();
  }
});

router.get("/add/", async (req, res, next) => {
  if (req.user !== undefined && req.user.auth) {
    let menu = await pageModel.getMenu();
    res.render("editPageView", {
      page: { title: "Add Page" },
      menu: menu,
      user: req.user
    });
  } else {
    next();
  }
});

router.get("/edit/:page", async (req, res, next) => {
  if (req.user !== undefined && req.user.auth) {
    let menu = await pageModel.getMenu();
    res.render("editPageView", {
      page: { title: "Edit Page", key: req.params.page },
      menu: menu,
      user: req.user
    });
  } else {
    next();
  }
});

router.all("/:key", async (req, res) => {
  getPageWithDefault(req, res);
});

async function getPageWithDefault(req, res) {
  if (req.params.key === undefined) {
    req.params.key = "home";
  }
  let page = await pageModel.getPage(req.params.key);
  let menu = await pageModel.getMenu();

  //console.log(menu);
  if (page[0] !== undefined) {
    res.render("pageView", {
      page: page[0],
      menu: menu,
      user: req.user
    });
  } else {
    //res.statusMessage = "Page not available";
    res.status(404);
    res.render("statusView", { code: 404, status: "Not Found" });
  }
}

module.exports = router;

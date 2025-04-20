  import express from "express";
  import bodyParser from "body-parser";
  import pg from "pg";
  import dotenv from 'dotenv';
  dotenv.config();


  const app = express();
  const port = 3000;
  const dbPassword = process.env.DB_PASSWORD;


  const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Blog",
    password: dbPassword,
    port: 5432,
  });
  db.connect();

  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", async (req, res) => {
    try {
      res.render("index.ejs");
    } catch (err) {
      console.error("Error fetching blogs:", err);
      res.status(500).send("Error fetching blogs.");
    }
  });

  app.get("/create-blog", (req, res) => {
    res.render("create.ejs");
  });

  app.get("/see-blog", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM blogs ORDER BY id DESC");
      const newblog = result.rows;
      res.render("result.ejs", { blogs: newblog });
    } catch (err) {
      console.error("Error fetching blogs:", err);
      res.status(500).send("Error fetching blogs.");
    }
  });

  app.post("/submit-blog", async (req, res) => {
    const blogTitle = req.body.blogTitle;
    const blogContent = req.body.blog;
    try {
      await db.query(
        "INSERT INTO blogs (title, description) VALUES ($1, $2)",
        [blogTitle, blogContent]
      );
      res.redirect("/see-blog"); // Better to redirect than render directly
    } catch (err) {
      console.error("Error inserting blog:", err);
      res.status(500).send("Error saving blog.");
    }
  });

  app.post("/delete", async (req, res) => {
    const id = req.body.deleteBlogId;
    try {
      await db.query("DELETE FROM blogs WHERE id = $1", [id]);
      res.redirect("/see-blog"); // Better to redirect than render directly
    } catch (err) {
      console.error("Error deleting blog:", err);
      res.status(500).send("Error deleting blog.");
    }
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`); // Fixed template literal syntax
  });
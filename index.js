import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "11250816msk",
  port: 5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  
  try {
    const result = await db.query("select * from items order by id asc");
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch(err) {
    console.error(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try { 
    //items.push({ title: item });
    await db.query("insert into items (title) values ($1)",[item]);
    res.redirect("/");
  } catch(err) {
    console.error(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("update items set title = ($1) where id = ($2)",[item,id]);
    res.redirect("/");
  } catch(err) {
    console.error(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("delete from items where id = ($1)",[id]);
    res.redirect("/");
  } catch(err) {
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

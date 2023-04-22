
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const port = process.env.PORT || 2000;

//Starting Server
app.listen(port, () => {
  console.log("Server Listening on Port : ", port)
})


//Function to get Blog Categories
const getCategories = async () => {

  var temp = await axios.get(process.env.BLOG_URL);

  return temp.data.blogs;

}

const getArticlesForCategory = async (blog_id) => {

  var temp = await axios.get(`${process.env.ARTICLE_URL}/${blog_id}/articles.json?fields=id,title,body_html,author,published_at,summary_html,image`);

  return temp.data;

}

const groupArticles = async (blogCategories) => {

  const promises = blogCategories.map(async (category) => {

    const tempArticles = await getArticlesForCategory(category.id);

    return {
      blog_title: category.title,
      blog_id: category.id,
      articles: tempArticles.articles,
    };

  });

  const articles = await Promise.all(promises);

  return articles;

};


//GET Requests for fetching Data
app.get("/getBlogs", async (req, res) => {

  const blogCategories = await getCategories();

  const response = await groupArticles(blogCategories);

  res.json(response);
})

app.use('/assets', express.static('assets'));
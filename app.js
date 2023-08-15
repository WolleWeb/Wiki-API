//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


main().catch(err => console.log(err));
async function main(){
    console.log("Database Connec init")
    await mongoose.connect("mongodb://127.0.0.1/wikiDB")
    console.log("Database connected succesfully!")
};

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

    .get(function(req, res){
        Article.find().then((foundArticles)=>{
            res.send(foundArticles)
        });
    })

    .post((req, res)=>{
        let postTitle = req.body.title;
        let postContent = req.body.content;
        
        const newArticle = new Article ({
            title: postTitle,
            content: postContent
        });
    
        newArticle.save().then(()=>{
            console.log("succesfully saved to Databse");
            res.redirect("/articles");
        }).catch((err)=>{
            console.log(err);
        })
    
    
    })
    
    .delete((req, res)=>{
        Article.deleteMany({}).then(()=>{
            res.send("succesfully deleted all Articles");
        }).catch((err)=>{console.log(err)});
    }
);

app.route("/articles/:article")

.get((req, res)=>{
    Article.findOne({title: req.params.article}).then((foundArticle)=>{

        if (foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No Articles where found!")
        }
    }).catch((err)=>{console.log(err)});
})

.put((req,res)=>{
    let article = req.params.article;
    Article.findOneAndUpdate(
        {title: article},
        {title: req.body.title, content: req.body.content},
        {overwrite: true}
        )
        
        
        .then((foundArticle)=>{
       
       
       
       
            if (foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No Articles where found!")
        }
    res.redirect("articles");
    }).catch((err)=>{console.log(err)});
})

.delete();



app.listen(3000, function() {
    console.log("Server started on port 3000");
});
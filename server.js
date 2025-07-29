const postgres = require("postgres");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const corsOptions ={
    origin: ["http://localhost:3000","http://localhost:8080","https://my-webpage-7b83.onrender.com"],
}

app.use(cors(corsOptions));


const sql = postgres(process.env.DB_CONN);


app.get("/api", (req,res) => {
    res.json({"conn": "backend is connected"});
});

app.get("/api/aboutme/:getset", async (req, res) =>{
    
    try{
        var result;
        switch (req.params.getset){
            case "aboutme":
                result = await sql`SELECT id, summary FROM my_summary WHERE id=2 LIMIT 1`;
                break;
            case "freetime":
                result = await sql`SELECT id, summary FROM my_summary WHERE id=3 LIMIT 1`;
                break;
            case "status":
                result = await sql`SELECT id, summary FROM my_summary WHERE id=4 LIMIT 1`;
                break;
            default:
                result = await sql`SELECT id, summary FROM my_summary WHERE id=1 LIMIT 1`;

        }
        res.status(201).json(result);
    } catch (e){
        res.status(500).send("Error");
    }
})

app.get("/api/skills/:skillset", async (req, res) =>{
    try{
        const result = await sql`SELECT skillnameinitial, skillname, description FROM my_skill WHERE skillset=${req.params.skillset} ORDER BY display_order`;
        
        res.status(201).json(result);
    } catch (e){
        res.status(500).send("Error");
    }
})

app.get("/api/skills/detail/:skill", async (req, res) =>{
    try{
        const skillId = req.params.skill;
        const result = await sql`SELECT skillnameinitial, skillname, detail, example, STRING_AGG(link,',') AS gallery FROM my_skill 
                                LEFT JOIN gallery_links ON my_skill.skillnameinitial=gallery_links.group 
                                WHERE skillnameinitial=${skillId}
                                GROUP BY skillnameinitial, skillname, detail, example`;
        res.status(201).json(result);
    } catch (e){
        res.status(500).send(e);
    }
})


app.listen(8080, () =>{
    console.log("server started");
})
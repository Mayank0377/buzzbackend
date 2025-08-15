import dotenv from "dotenv";
import connectDb from "./db/db.js";
import { app } from "./app.js"; 

dotenv.config({ path: "./.env" }); 
connectDb() // this will import the connectDb function from db/index.js and call it to connect to the database
.then(()=> {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server Started !!!  ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.error("failed!!!", error);
});
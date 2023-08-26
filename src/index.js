import express from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import {engine} from "express-handlebars";
import { Server } from "socket.io";
import * as path from "path";
import __dirname from "./utils.js";
import ProductManager from "../src/controllers/ProductManager.js";


const app = express();
const PORT = 4000;
const product = new ProductManager();


const serverExpress = app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`)
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "./views"))

app.use("/", express.static(__dirname + "/public"))

const io = new Server(serverExpress)
const prods = []

io.on("connection", (socket) => {
    console.log("Servidor Socket.io conectado");
    socket.on("mensajeConexion", (info) => {
        console.log(info);
    })
})


app.get("/static", async (req, res) => {
    let allProducts = await product.getProducts()
    res.render("realTimeProducts", {
        title: "Preentrega Talavera 26/08/2023",
        css: "style.css",
        js: "realTimeProducts.js",
        products : allProducts,
    })
});



app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)
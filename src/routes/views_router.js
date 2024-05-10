const Router = require("express").Router;
const router = Router();
const CartsManager = require("../dao/CartsManager.js"); //Agregado en After Class
const productManager = require("../dao/ProductManagerMONGO.js");
const { isValidObjectId } = require("mongoose");
const ProductManager = new productManager();

const cartsManager = new CartsManager(); //Agregado en After Class

router.get("/chat", (req, res) =>{
    datos = {   title:"Bienvenido a mi Chat - Hecho con WebSocket 2024 GFR",
                    nombre:"Gonzalo",
                    description:`Utilización de plantillas Handlebars y websocket
                    para crear mi primer Chat Online - Curso de BankEnd de CoderHouse`,
                    keywords:"Chat, WebSocket, Plantillas, handlebars, JS, Coderhouse, Cursos BackEnd",
                    author:"Gonzalo Flores"
                }
    res.setHeader("Content-Type","text/html");
    return res.status(200).render("chat",{datos});
});

router.get("/home", async(req, res) => {
    let {id} = req.query;
    if(!id){
        try { 
            let {docs:productos} = await ProductManager.getProducts();
            datos = {   
                title:"Página de Productos",
                description:"Lista de productos",
                keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
                author:"Gonzalo Flores"
            };
            res.setHeader("Content-Type","text/html");
            return res.status(200).render("home",{productos, datos});
        } catch(error){ 
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`Error inesperado en el servidor`});
        }
    } 
    else {
        if(!isValidObjectId(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:"Ingrese un ID Valido para MongoDB"});
        } else {
            datos = {   
            title:"Página de Producto seleccionado",
            description:"Producto seleccionado por el ID",
            keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
            author:"Gonzalo Flores"
            };
            try {
                producto = await ProductManager.getProductBy({_id:id});
                res.setHeader("Content-Type","text/html");
            return res.status(200).render("home",{producto, datos, id});
            } 
            catch (error){
                console.log(error);
                res.setHeader('Content-Type','application/json');
                return res.status(500).json({error:`Error inesperado en el servidor`});
            }
        }
    }
});

router.get("/realtimeproducts", async(req, res) => {
    datos = {   title:"Bienvenido a mi primera plantilla Handlebars 2024 JS",
                nombre:"Gonzalo",
                description:"Utilización de plantillas Handlebars en el curso de bankEnd de CoderHouse",
                keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
                author:"Gonzalo Flores"
    }
    
    try { 
        //let productos = await ProductManager.getProducts();
        let {docs:productos} = await ProductManager.getProducts(20,1);
        res.setHeader("Content-Type","text/html");
        return res.status(200).render("realTimeProducts",{productos, datos});
    } catch(error){ 
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor`});
    }
});

router.get("/products", async(req, res) => {
    let {limit, page} = req.query;
    if(page){
        page = Number(page); 
        if(isNaN(page)){
            page = 1;
        }
    }
    if(limit){
        limit = Number(limit); 
        if(isNaN(limit)){
            limit = 10;
        }
    }
    let carrito = await cartsManager.getCarritos(1); //recibo array con un producto
    
    datos = {   title:"Bienvenido a mi primera plantilla Handlebars 2024 JS",
                nombre:"Gonzalo",
                description:"Utilización de plantillas Handlebars en el curso de bankEnd de CoderHouse",
                keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
                author:"Gonzalo Flores"
    }
    try { 
        let {docs:productos} = await ProductManager.getProducts(limit,page);

        res.setHeader("Content-Type","text/html");
        return res.status(200).render("products",{productos, datos, carrito});
    } catch(error){ 
        console.log(error.message);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor`});
    }
});

router.get("/carrito/:cid", async(req, res) => {
    let {cid} = req.params;
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:"Ingrese un ID Valido para MongoDB"});
    }
    datos = {   title:"Carrito - Productos en el carrito",
                nombre:"Gonzalo",
                description:"Utilización de plantillas Handlebars en el curso de bankEnd de CoderHouse",
                keywords:"Plantilla, handlebars, JS, Coderhouse, Cursos BackEnd",
                author:"Gonzalo Flores"
    }
    try { 
        let carrito = await cartsManager.getCarritoById({_id:cid});
        res.setHeader("Content-Type","text/html");
        return res.status(200).render("carrito",{carrito, datos});
    } catch(error){ 
        console.log(error.message);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor`});
    }
});

router.get("/carrito", async(req, res) => {
    res.setHeader('Content-Type','application/json');
    return res.status(404).json({error:"Error 404"});
});

module.exports = router;
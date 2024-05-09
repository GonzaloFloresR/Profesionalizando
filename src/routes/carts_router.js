const Router = require("express");
const router = Router();
const CartsManager = require("../dao/CartsManager.js");
const ProductManager = require("../dao/ProductManagerMONGO.js");
const {isValidObjectId} = require("mongoose");


const entorno = async() => { 
    const cartManager = new CartsManager();
    const productManager = new ProductManager();

    router.get("/", async (request, response) => {
        try {
            let carrito = await cartManager.getCarritos();
            if(carrito){
                response.setHeader('Content-Type','application/json');
                return response.status(200).json(carrito);
            } else {
                response.setHeader('Content-Type','application/json');
                return response.status(400).json({error:`No hay carritos activos ❌`});
            }
        }
        catch(error){
            console.log(error);
            response.setHeader('Content-Type','application/json');
            return response.status(500).json({
                error:"Error inesperado en el servidor - intente más tarde",
                detalle:`${error.message}`});
            
        } 
    });

    router.get("/:cid", async(request, response) => {
        let {cid} = request.params;
        
        if(!isValidObjectId(cid)){
            response.setHeader('Content-Type','application/json');
            return response.json({error:"Ingrese un ID Valido de Mongo"});
        } else {
            try {
                let carrito = await cartManager.getCarritoById({"_id":cid});
                if(carrito){
                    response.setHeader('Content-Type','application/json');
                    return response.status(200).json(carrito.products);
                } else {
                    response.setHeader('Content-Type','application/json');
                    return response.status(400).json({error:`No existe carrito con el ID ${cid}`});
                }
            }
            catch(error){
                console.log(error);
                response.setHeader('Content-Type','application/json');
                return response.status(500).json({
                    error:"Error inesperado en el servidor - intente más tarde",
                    detalle:`${error.message}`});
            } 
        }
    });

    router.post("/", async(request, response) => {
        let {products} = request.body;  //{products:[{productId:"",quantity:1},{products:[{productId:"",quantity:1}]}
        if(!products){
            response.setHeader('Content-Type','application/json');
            return response.status(400).json({status:"error", error:"Debe Agregar productos al carrito"});
        }
        //const {quantity} = products;
        try {
            //await productManager.updateProduct(pid, {"$inc":{"stock":-cantidad}});  //Funciona
            let agregado = await cartManager.crearCarrito({products});
            if(agregado){
                response.setHeader('Content-Type','application/json');
                return response.status(200).json(agregado);
            } else {
                response.setHeader('Content-Type','application/json');
                response.status(400).json({status:"error", message:"El producto no se pudo agregar"})
            }
        } 
        catch(error){
            console.log(error);
            response.setHeader('Content-Type','application/json');
            return response.status(500).json({
                error:"Error inesperado en el servidor - intente más tarde",
                detalle:`${error.message}`});
        }
        
    });

    router.put("/:cid/products/:pid", async(request, response) => {
        let {cid,pid }= request.params
        let cantidad = request.body;
        if(!cantidad || typeof cantidad != Number){
            cantidad = 1;
        }
        
        if(!isValidObjectId(cid) || !isValidObjectId(pid) ){
            response.setHeader('Content-Type','application/json');
            return response.status(400).json({error:"Ingrese un ID de Carrito y ID de Producto validos"});
        } 
        let carrito;
        try {
            carrito = await cartManager.getCarritoById({_id:cid});
            if(!carrito){
                response.setHeader('Content-Type','application/json');
                return response.status(400).json({error:`El carrito con ID: ${cid} no existe`});
            }
        }
        catch(error) {
            console.log(error.message)
        }
        let producto;
        try {
            producto = await productManager.getProductBy({_id:pid});
            if(!producto){
                response.setHeader('Content-Type','application/json');
                return response.status(400).json({error:`El producto con ID: ${pid} no existe`});
            }
        }
        catch(error) {
            console.log(error.message)
        }
        //Confirmado existencia de carrito y de producto
        //Verificar si el carrito ya cuenta con el producto
        const ProductoEnCarrito = carrito.products.find(produ => produ.productId._id == pid);
        if(ProductoEnCarrito){
            //Pasar una "cantidad" del stock actual al "quantity" del producto del carrito
            try {
                await productManager.updateProduct(pid, {"$inc":{"stock":-cantidad}});  //Funciona
                ProductoEnCarrito.quantity += cantidad;
            }
            catch(error){error.message} 
            
        } else {
            carrito.products.push({"productId": pid, "quantity":cantidad});
        }
            try {
                let resuelto = await cartManager.updateCart(cid, carrito);
                if(resuelto){
                    response.setHeader('Content-Type','application/json');
                    return response.status(200).json({status:"succes", message:`Producto ${pid} Agregado en carrito ${cid} `});
                }
            }
            catch(error){
                error.message
                response.setHeader('Content-Type','application/json');
                return response.status(400).json({status:"error", message:`Producto ${pid} no se logro agregar en carrito ${cid}`});
            }
    });

    router.delete("/",(req, res) => {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({status:"error", message:"Debe ingresar un ID de Carrito Para eliminar"});
    });

    router.delete("/:cid", async(req, res) => {
        let {cid} = req.params;
        if(isValidObjectId(cid)){
            try {
                let Eliminado = await cartManager.deleteCarrito(cid);
                if(Eliminado){
                    res.setHeader('Content-Type','application/json');
                    return res.status(200).json({status:"succes", Eliminado});
                } else {
                    res.setHeader('Content-Type','application/json');
                    return res.status(400).json({erro:`No existe carrito con ID ${cid}`});
                }
            }
            catch(error){
                console.log(error);
            }
        }
    });

} //cerrando entorno async

entorno();

module.exports = router;
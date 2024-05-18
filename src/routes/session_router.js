const { Router } = require("express");
const router = Router();
const UsuarioManager = require("../dao/UsersManager.js");
const { generaHash } = require("../utils.js");
const CartsManager = require("../dao/CartsManager.js");
const usuarioManager = new UsuarioManager();
const cartsManagar =new CartsManager();
const auth = require("../middleware/auth.js");

router.post("/registro", async (req, res) => {
    let {nombre:first_name, apellido:last_name, edad:age, email, password, rol, web} = req.body;
    if(!first_name || !email || !password){
        if(web){
            return res.redirect("/registro?error=Faltan datos para el correcto registro");
        }
        else {
            res.setHeader("Content-Type","application/json");
        return res.status(400).json({error:"Faltan datos para el correcto registro de usuario"});
        }
        
    }
    
    try {
        let emailCheck = await usuarioManager.getUsuarioBy({email});
        if(emailCheck){
            if(web){
                return res.redirect(`/registro?error=Ya existe usuario con ${email}`);
            }
            else {
                res.setHeader("Content-Type","application/json");
                return res.status(400).json({error:`Ya existe usuario con ${email}`});
            }
        }
    } catch(error){
        console.log(error);
        res.setHeader("Content-Type","application/json");
        return res.status(500).json({error:`Error inesperado en el servidor`});
    }
    try {
    let cart = await cartsManagar.crearCarrito();
    password = generaHash(password);
    let usuario = {first_name,last_name,age, email, password, rol, cart};
        let nuevoUsuario = await usuarioManager.createUsuario(usuario);
        if(nuevoUsuario){
            nuevoUsuario = {...nuevoUsuario}
            delete nuevoUsuario.password;
            if(web){
                return res.redirect(`/login?message=Registro exitoso ${nuevoUsuario.first_name}`);
            }
            else {
                res.setHeader('Content-Type','application/json');
                res.status(200).json({message: "Registro correcto...!!!", nuevoUsuario});
            }
        }
    } catch(error){
        console.log(error.message);
        res.setHeader("Content-Type","application/json");
        return res.status(500).json({error:"Error inesperado en el servidor"});
    }
    
});


router.post("/login", async (req, res) => {
    let {usuario, password, web} = req.body;
    if(!usuario || !password){
        if(web){
            return res.redirect("/login?error=Debe Ingresar Email y Contraseña");
        }
        else {
            res.setHeader("Content-Type","application/json");
            return res.status(400).json({error:"Debe ingresar Email y contraseña"});
        }
        
    }
    
    let existeUsuario;
    password = generaHash(password);
    usuario = usuario.trim()
    try { 
        existeUsuario = await usuarioManager.getUsuarioBy({"email":usuario, password});
        if (existeUsuario){
            let usuario = {...existeUsuario};
            delete usuario.password;
            delete usuario.createdAt;
            delete usuario.updatedAt;
            req.session.usuario = usuario;
            if(usuario.rol == "admin"){
                return res.redirect(`/products?mensaje=${usuario.first_name}&rol=true`);
            }
            if(web){
                return res.redirect(`/products?mensaje=${usuario.first_name}`);
            }
            else {
                res.setHeader("Content-Type","application/json");
                return res.status(200).json({payload:"Login Correcto", usuario});
            }
        }
    } 
    catch(error){
        console.log(error)
        res.setHeader("Content-Type","application/json");
        return res.status(500).json({error:"Error inesperado en el servidor"});
    }
    if(web){
        return res.redirect("/login?error=Credenciales Invalidas");
    }
    else {
        res.setHeader("Content-Type","application/json");
    return res.status(403).json({error:"Error Usuario y contraseña no coinciden"});
    }
    
});

router.get("/logout", auth, (req, res) => {
    req.session.destroy(error => {
        if(error){console.log(error);
            res.setHeader("Content-Type","application/json");
            return res.status(500).json({error:"Error inesperado en el servidor", detalle:`${error.message}`});
        }
    })

    res.setHeader("Content-Type","application/json");
    return res.status(200).json({payload:"Logout exito"});

});




router.get("/crearcookie", async (req, res) => {
    let datos = {nombre:"Paulina", deporte:"Crossfit"};
    res.cookie("cookie1","Valor Cookie 1", {});
    res.cookie("cookie2", datos,{});
    res.cookie("cookie3", "Vive 5 segúndos",{maxAge:5000});
    res.cookie("cookie4", "Con fecha de expiración",{expires:new Date(2024,4,15)});

    let MisCookies = req.cookies;

    console.log(MisCookies);
    if(req.session.contador){req.session.contador++}else{req.session.contador = 1}
    res.setHeader("Content-Type","text/html");
    res.status(200).send(`<h1>Estamos en Session</h1> <br><h2>Creando Cookies</h2><h3></h3>${req.session.contador}`);
});

router.get("/leercookie", async (req, res) => {
    let MisCookies = req.cookies;
    
    res.setHeader("Content-Type","text/html");
    res.status(200).send(`<h1>Estamos en Session</h1><br><h2>leyendo Cookies</h2>`);
    console.log(MisCookies);
});

router.get("/borrarcookie", (req, res)=>{
    res.clearCookie("cookie1");
    res.setHeader("Content-Type","text/html");
    res.status(200).send(`<h1>Estamos en Session</h1><br><h2>Cookie1 Borrada</h2>`);
});

module.exports = router;

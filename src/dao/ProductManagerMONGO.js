const productoModelo = require("../dao/models/ProductModel");

class ProductManagerMONGO{

    async getProducts(limit=10,page=1){
        try {
            //return await productoModelo.find().limit(limit).lean();
            return await productoModelo.paginate({},{limit, page, lean:true});
        }
        catch(error){
            console.log(error,"Error desde getProducts");
        }
        
    }

    async addProduct(nuevoProducto){ 
        try {
                return await productoModelo.create(nuevoProducto);
            }
        catch(error){
                console.log(error,"Error desde addProduct");
            }
    }

    async getProductBy(filtro){
        try {
            return await productoModelo.findOne(filtro).lean();
        } catch(error){
            console.log(error,"Error desde getProductBy")
        }
    } 

    async updateProduct(id, Update){
        try {
            //Ejemplo incrementar 1 {"$inc":{"stock": 1}}
            return await productoModelo.findByIdAndUpdate({"_id":id},Update,{runValidators:true, returnDocument:"after"});
        }
        catch(error){
            console.log(error, "Error desde updateProduct");
        }
    }

    async deleteProduct(pid){
        try {
            return await productoModelo.deleteOne(pid);
        }
        catch(error){
            console.log(error,"Error desde deleteProduct")
        }
    }

}

module.exports = ProductManagerMONGO;

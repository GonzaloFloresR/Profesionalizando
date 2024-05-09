const comprar = async(pid) => {
    let inputCarrito = document.getElementById("carrito");
    let cid = inputCarrito.value;

    console.log(`Codigo Producto ${pid} / Código Carrito es ${cid}`);

    let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`,{method:"put"});
    if(respuesta.status === 200){
        let datos = await respuesta.json();
        console.log(datos);
    }
}

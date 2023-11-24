const { Product } = require("../db");
const { products } = require('../apis/products.json');

const getProducts = async (req, res) => {
  try {
    const product = products.map((product) => {
      return {
        name: product.name,
        img: product.img,
        status: product.status,
        price: product.price,
        description: product.description,
      }
    })
    // Consultar todos los productos en la base de datos
    let productsFromDB = await Product.findAll();

    // Verificar si no se encontraron productos
    if (productsFromDB.length === 0) {
      await Product.bulkCreate(product)
    }

    // Verificar si se proporciona un nombre de producto
    if (req.query.name) {
      // Filtrar los productos cuyo nombre coincida con el nombre proporcionado en la consulta
      const searchName = req.query.name.toLowerCase();
      productsFromDB = productsFromDB.filter((product) =>
        product.name.toLowerCase().startsWith(searchName)
      );
      return res.status(404).json({ message: "Product not found" });
    }

    // Filtro ascendente
    if (req.query.sort === "asc") {
      productsFromDB = productsFromDB.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Filtro descendente
    if (req.query.sort === "desc") {
      productsFromDB = productsFromDB.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Responder con los datos de todos los productos
    res.status(200).json(productsFromDB);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { getProducts };
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
// In-memory database for products.
const products = [];
app.get("/products", (_req, res) => {
    res.status(200).json(products);
});
app.post("/products", (req, res) => {
    const { id, product_name, product_description, product_price } = req.body;
    if (typeof id !== "number" ||
        typeof product_name !== "string" ||
        typeof product_description !== "string" ||
        typeof product_price !== "number") {
        return res.status(400).json({
            message: "Invalid payload. Required fields: id(number), product_name(string), product_description(string), product_price(number).",
        });
    }
    const existingProduct = products.find((product) => product.id === id);
    if (existingProduct) {
        return res.status(409).json({ message: "A product with this id already exists." });
    }
    const newProduct = {
        id,
        product_name,
        product_description,
        product_price,
    };
    products.push(newProduct);
    return res.status(201).json(newProduct);
});
app.get("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((item) => item.id === id);
    if (!product) {
        return res.status(404).json({ message: "Product not found." });
    }
    return res.status(200).json(product);
});
app.put("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const productIndex = products.findIndex((item) => item.id === id);
    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found." });
    }
    const { product_name, product_description, product_price } = req.body;
    if (typeof product_name !== "string" ||
        typeof product_description !== "string" ||
        typeof product_price !== "number") {
        return res.status(400).json({
            message: "Invalid payload. Required fields: product_name(string), product_description(string), product_price(number).",
        });
    }
    products[productIndex] = {
        ...products[productIndex],
        product_name,
        product_description,
        product_price,
    };
    return res.status(200).json(products[productIndex]);
});
app.delete("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const productIndex = products.findIndex((item) => item.id === id);
    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found." });
    }
    const deletedProduct = products.splice(productIndex, 1)[0];
    return res.status(200).json({ message: "Product deleted.", product: deletedProduct });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

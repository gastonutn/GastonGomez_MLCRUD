const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		res.render('products',
		{products,toThousand});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const product = products.find(product=>product.id === +req.params.id)
		res.render('detail',{...product, toThousand});
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		const {name,price,discount,description,category} =req.body
		let newProduct ={
			id: products[products.length -1].id +1,
			name: name.trim(),
			price: +price,
			discount: +discount,
			category,
			description: description.trim(),
			image: null	
		}
		products.push(newProduct);
		fs.writeFileSync(productsFilePath,JSON.stringify(products,null, 3),'utf8')
		return res.redirect("/products")
	},

	// Update - Form to edit
	edit: (req, res) => {
		const product = products.find(product=>product.id === +req.params.id)
		res.render('product-edit-form',{...product});
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		const {name,price,discount,description,category} =req.body
		const productModify = products.map(product =>{
			if (product.id === +req.params.id){
				product.name= name.trim();
				product.price= +price;
				product.discount= +discount;
				product.category=category;
				product.description= description.trim();
			}
			return product
		})
		products.push(productModify);
		fs.writeFileSync(productsFilePath,JSON.stringify(products,null, 3),'utf8')
		return res.redirect("/products")
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const productModify = products.filter(product=>product.id !== +req.params.id)
		
		fs.writeFileSync(productsFilePath,JSON.stringify(productModify ,null, 3),'utf8')
		return res.redirect("/products")

		// Do the magic
		
	}
};

module.exports = controller;
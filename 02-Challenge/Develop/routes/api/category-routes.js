const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  //here we want to find all data within the category, as well as including the Product from the product model file.
  //we want it to display if it works and if it doesnt the user will recieve a 500 error
 await Category.findAll({
  attributes: ["id", "category_name"],
  include: [{
    model: Product,
    attributes: ["id", "product_name", "price", "stock", "category_id"]
  }]
 })
 .then((categories) => {
  res.join(categories);
 })
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  //we want to find items by their specific id, when the item is found it will display, if no item is found the error message will appear
await Category.findByPk(req.params.id, {
  attributes: ["id", "category_name"],
    include: [
    {
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"]
    }
  ],
})
.then((category) => {
  res.json(category)
})
});

router.post('/', async (req, res) => {
  // create a new category
  //here we will create a new category, and it will upload into the category body.
  await Category.create(req.body)
    .then((newCategory) => res.status(200).json(newCategory))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  //here we update the category, and it will be updated in the body, where the list of other categories are
 await Category.update(req.body, {
  where: {
    id: req.params.id,
  },
 })
 .then(cat => Category.findByPk(req.params.id))
 .then((updateCategory) => res.status(200).json(updateCategory))
 .then((err) => {res.json(err);
});
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  //here we will destroy, where the id matches. If no id matches the error message will display, if it does match then it will be deleted.
  await Category.destroy({
		where: {
			id: req.params.id,
		},
	})
	.then((rmvdCategory) => {
		res.json(`The category has been removed from database`);
	})
	.catch((err) => {
		res.json(err);
	});
});

module.exports = router;

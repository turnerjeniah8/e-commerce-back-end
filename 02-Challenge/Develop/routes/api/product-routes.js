const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  //we want to include all products within the model category. We also want to include the tage associated with the products
  //then if it works the response would be the server status of 200, anything else will recieve an error message
  await Product.findAll({
		attributes: ["id", "product_name", "price", "stock", "category_id"],
		include: [
			{
				model: Tag,
				attributes: ["id", "tag_name"],
				through: "ProductTag",
			},
			{
				model: Category,
				attributes: ["id", "category_name"],
			},
		],
	})
		.then((productData) => {
			res.json(productData);
		})
		.catch((err) => {
			res.json(err);
		});
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  //we want to find the item by including all products within the category model. 
  Product.findByPk(req.params.id, {
		include: [
			{
				model: Tag,
				attributes: ["id", "tag_name"],
				through: "ProductTag",
			},
			{
				model: Category,
				attributes: ["id", "category_name"],
			},
		],
	})
		.then((specificProduct) => {
			res.json(specificProduct);
		})
		.catch((err) => {
			res.json(err);
		});
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }else{
         // if no product tags, just respond
      res.status(200).json(product);
      }
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({tag_id}) => !req.body.tagIds.includes(tag_id))
        .map(({id}) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  //we first want the product to delete by matching it with its ID. 
  //if it works then the item will delete, if it doesnt work then the user will be presented with the error message
  let deletedProduct = Product.findByPk(req.params.id);
	Product.destroy({
		where: {
			id: req.params.id,
		},
	})
	.then((product) => {
		res.json(`${deletedProduct} has been removed from the database`);
	})
	.catch((err) => {
		res.json(err);
	});
});

module.exports = router;

const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  await Tag.findAll({
    attributes: ["id", "tag_name"],
    include: [{
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"],
      through: "ProductTag",
    }, ],
  })
  .then((parsedTagData) => {
    res.json(parsedTagData);
  })
  .catch((err) => {
    res.json(err);
  });
//we want to find all the information pertaining tags, we want to include the products as well as the tag. 
//If successful the information will display. If not then the error will occur
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findByPk(req.params.id, {
    include: [{
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"],
      through: "ProductTag",
    }],
  })
  .then((retrievedTag) => {
    res.json(retrievedTag);
  })
  .catch((err) => {
    res.json(err);
  });
});

router.post('/', async (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name,
  })
  .then((tag) => {
    res.json(tag);
  })
  .catch((err) => {
    res.json(err);
  });
});

router.put('/:id',async (req, res) => {
  // update a tag's name by its `id` value
  Tag.update({
    tag_name: req.body.tag_name,
  },{
    where: {
      id: req.params.id,
    },
  })
  .then((tag) => {
    res.json(tag);
  })
  .catch((err) => {
    res.json(err);
  });
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  //we want to find the tag by its id and delete it
  //if the tag does not match with an id then the error message would be displayed. 
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((qtyRemoved) => {
    res.json(`${qtyRemoved} tag were removed from the database`);
  })
  .catch((err) => {
    res.json(err);
  });

});

module.exports = router;

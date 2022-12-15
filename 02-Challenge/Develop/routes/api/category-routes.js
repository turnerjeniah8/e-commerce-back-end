const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  //here we want to find all data within the category, as well as including the Product from the product model file.
  //we want it to display if it works and if it doesnt the user will recieve a 500 error
  try {
    const categoryData = await Category.findall ({
      include: [{ model: Product }]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  //we want to find items by their specific id, when the item is found it will display, if no item is found the error message will appear
try {
  const categoryData = await Category.findByPk(req.params.id, {
    include: [{ model: Product }]
  });

  if (!categoryData) {
    res.status(404).json({message: 'No Category found with this id.'})
    return;
  }
  res.status(200).json(categoryData);
} catch (err) {
  res.status(500).json(err);
}
});

router.post('/', async (req, res) => {
  // create a new category
  //here we will create a new category, and it will upload into the category body.
  try{
    const categoryData = await Category.create({
      category_name: req.body.category_name
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  //here we update the category, and it will be updated in the body, where the list of other categories are
  try{ 
    const categoryData = await Category.update(
      {
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id
      }
    }
    );
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id'});
    return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  //here we will destroy, where the id matches. If no id matches the error message will display, if it does match then it will be deleted.
  try{
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

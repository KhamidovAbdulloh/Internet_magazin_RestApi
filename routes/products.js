const {Router} = require('express')
const {
	getAllProducts,
	getMyProducts,
	addProduct,
	getProductById,
	updateProduct,
	deleteProduct

} = require('../controllers/products.controller')
const upload = require('../utils/fileUpload')
const router = Router()
const { protected } = require('../middleware/auth')

router.get('/', getAllProducts)
router.get('/myproducts', protected, getMyProducts)
router.get('/:id', getProductById)
router.post('/', protected, upload.single('image'), addProduct)
router.patch('/:id', protected, updateProduct)
router.delete('/:id', protected, deleteProduct)


module.exports = router
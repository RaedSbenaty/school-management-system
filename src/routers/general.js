var express = require('express')
var multer = require('multer')
var sharp = require('sharp')
var router = express.Router()
var Class = require('../models/class')
var Account = require('../models/account')
var auth = require('../middlewares/auth')
const Category = require('../models/category')
const SubjectInYear = require('../models/SubjectInYear')

router.post('/login', async (req, res) => {
    try {
        var account = await Account.findByCriteria(req.body.email, req.body.password)
        account.dataValues.token = account.generateAuthToken()
        res.status(201).send(account)
    } catch (e) {
        console.log(e)
        res.status(400).send('Unable to log in.')
    }
})

router.get('/classes', async (req, res) => {
    try {
        var classes = await Class.findAll()
        await res.send(classes)
    } catch (e) {
        res.status(500).send('Failed to fetch classes')
    }
})

router.get('/categories', async(req, res) => {
    try {
        var categories = await Category.findAll()
        await res.status(200).send(categories)
    } catch (e) {
        res.status(500).send('Failed to fetch categories')
    }
})

router.get('/subjects', async(req, res) =>{
    try {
        var {startYear, endYear} = req.params
        var subjectsInYear = await SubjectInYear.findAll({include: Category})
        await res.status(200).send(subjectsInYear)
    } catch (e) {
        res.status(500).send('Failed to fetch subjects in year: '+ startYear+'-'+endYear)
    }
})

var image = multer({
    limits: {fileSize: 4194304},
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/))
            return cb(new Error('Please upload an image.'))

        cb(undefined, true)
    }
})

router.post('/me/image', auth, image.single('image'), async (req, res) => {
    req.account.image = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    await req.account.save({attributes: ['image']})
    res.send('Image was added successfully.')
}, (error, req, res, next) => {
    res.status(400).send(error.message)
})

router.delete('/me/image', auth, async (req, res) => {
    await req.account.update({image: 0})
    res.send('Image was deleted successfully.')
})

router.get('/accounts/:id/image', async (req, res) => {
    try {
        var account = await Account.findByPk(req.params.id, {attributes: ['image']})
        if (!account || !account.image) throw new Error()
        res.set('Content-Type', 'image/png')
        res.send(account.image)
    } catch (e) {
        res.status(404).send('Image not found.')
    }
})

module.exports = router

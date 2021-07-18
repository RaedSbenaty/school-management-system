const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const Account = require('../models/account')
const Class = require('../models/class/class')
const Category = require('../models/subject/category')
const ExamType = require('../models/subject/examType')
const Day = require('../models/day')
const AnnouncementType = require('../models/announcement/announcementType')
const Announcement = require('../models/announcement/announcement')
const Attachment = require('../models/announcement/attachment')


router.post('/login', async (req, res) => {
    try {
        const account = await Account.findByCriteria(req.body.email, req.body.password)
        account.dataValues.token = await account.generateAuthToken()
        res.status(201).send(account)
    } catch (e) {
        console.log(e)
        res.status(400).send('Unable to log in.')
    }
})

router.get('/classes', async (req, res) => {
    try {
        await res.send(await Class.findAll())
    } catch (e) {
        res.status(500).send('Failed to fetch classes.')
    }
})

router.get('/categories', async (req, res) => {
    try {
        await res.status(200).send(await Category.findAll())
    } catch (e) {
        res.status(500).send('Failed to fetch categories.')
    }
})

router.get('/examTypes', async (req, res) => {
    try {
        await res.send(await ExamType.findAll())
    } catch (e) {
        res.status(500).send('Failed to fetch exam types.')
    }
})

router.get('/days', async (req, res) => {
    try {
        await res.send(await Day.findAll())
    } catch (e) {
        res.status(500).send('Failed to fetch days.')
    }
})

router.get('/announcementTypes', async (req, res) => {
    try {
        await res.send(await AnnouncementType.findAll())
    } catch (e) {
        res.status(500).send('Failed to fetch announcement types.')
    }
})

router.get('/getFile', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '.', '..', '..', req.body.path))
    } catch (e) {
        console.log(e)
        res.status(500).send('Failed to get file')
    }
})



//IMAGE (Temp)
// const image = multer({
//     limits: {fileSize: 4194304},
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(png|jpg|jpeg)$/))
//             return cb(new Error('Please upload an image.'))
//
//         cb(undefined, true)
//     }
// })
//
// router.post('/me/image', auth(), image.single('image'), async (req, res) => {
//     req.account.image = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
//     await req.account.save({attributes: ['image']})
//     res.send('Image was added successfully.')
// }, (error, req, res) => {
//     res.status(400).send(error.message)
// })
//
// router.delete('/me/image', auth(), async (req, res) => {
//     await req.account.update({image: 0})
//     res.send('Image was deleted successfully.')
// })
//
// router.get('/accounts/:id/image', async (req, res) => {
//     try {
//         const account = await Account.findByPk(req.params.id, {attributes: ['image']})
//         if (!account || !account.image) throw new Error()
//         res.set('Content-Type', 'image/png')
//         res.send(account.image)
//     } catch (e) {
//         res.status(404).send('Image not found.')
//     }
// })

module.exports = router

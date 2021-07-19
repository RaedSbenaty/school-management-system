const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()

const auth = require('../middlewares/auth')
const teacherBelongsTo = require('../middlewares/teacherBelongsToSchool')
const studentBelongsTo = require('../middlewares/studentBelongsToSchool')

const Attachment = require('../models/announcement/attachment')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '.', '..', '../uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits: {fileSize: 4194304},
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/))
            return cb(new Error('Please upload an image or a pdf.'))
        cb(undefined, true)
    }
})

/*
post announcement
/alhbd/2020-2021/announcements/add
"json": {
    "destinationStudentInClassId":1,
    "heading": "head",
    "body": "body",
    "date": "1-1-2020",
    "announcementTypeId" :1
}
*/

router.post('/:siteName/:startYear-:endYear/announcements/add', auth(['School'])
    , upload.array('uploads'), async (req, res) =>
        await Attachment.handleCreateAnnouncementRequest(req, res, {sourceSchoolId: req.account.school.id})
    , (error, req, res) => res.status(400).send(error.message)
)


router.post('/teachers/:teacherId/:siteName/:startYear-:endYear/announcements/add', auth(['Teacher'])
    , teacherBelongsTo, upload.array('uploads'), async (req, res) =>
        await Attachment.handleCreateAnnouncementRequest(req, res, {sourceTeacherInYearId: req.teacherInYear.id})
    , (error, req, res) => res.status(400).send(error.message)
)


router.post('/students/:studentId/:siteName/:startYear-:endYear/announcements/add', auth(['Student'])
    , studentBelongsTo, upload.array('uploads'), async (req, res) =>
        Attachment.handleCreateAnnouncementRequest(req, res, {sourceStudentInClassId: req.studentInClass.id}),
    (error, req, res) => res.status(400).send(error.message))


module.exports = router
const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const Account = require('../../models/account')
const Student = require('../../models/student/student')
const SchoolClass = require('../../models/class/schoolClass')
const StudentInSchool = require('../../models/student/studentInSchool')
const StudentInClass = require('../../models/student/studentInClass')


// post New Student
// /alhbd/2020-2021/students/add
/*
{
        "fatherName": "Aamer",
        "motherName": "Hanaa",
        "lastSchoolAttended": "Bla",
        "schoolClassId":3,
        "account": {
        "email": "abd@hbd.com",
        "password": "12345678",
        "phoneNumber": "+961994418888"
        },
        "personalInfo": {
        "firstName": "Raghad",
        "lastName": "Al-Halabi",
        "birthDate": "04-17-2001",
        "residentialAddress": "Damascus"
        }
}
*/

router.post('/:siteName/:startYear-:endYear/students/add', auth, async (req, res) => {
    try {
        const schoolClass = await SchoolClass.findByPk(req.body.schoolClassId)
        if (!schoolClass || schoolClass.schoolId !== req.account.school.id)
            throw new Error('schoolClassId doesn\'t belong to this school.')

        if (schoolClass.startYear != req.params.startYear
            || schoolClass.endYear != req.params.endYear)
            throw new Error('schoolClassId doesn\'t belong to this year.')


        req.body.account.user = 'Student'
        req.body.classId = schoolClass.classId
        delete req.body.schooClasslId

        const student = await Student.create(req.body, {include: ['account', 'personalInfo']})
        const studentInSchool = await StudentInSchool.create({studentId: student.id, schoolId: req.account.school.id})
        await StudentInClass.create({
            studentInSchoolId: studentInSchool.id, schoolClassId: schoolClass.id,
            classroomId: req.body.classroomId
        })

        res.status(201).send(student)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

// post Existing Student
// /alhbd/2020-2021/students/addExisting
//{ "id":4,"email":"abd@hbd4.com", "schoolClassId":1}
router.post('/:siteName/:startYear-:endYear/students/addExisting', auth, async (req, res) => {
    try {
        const account = await Account.findByIdAndEmail(req.body.id, req.body.email)
        if (!account || !account.student) return res.status(404).send('Invalid student criteria.')

        const activeRecords = await StudentInSchool.count({
            where: {'$student.id$': account.student.id, active: true}, include: 'student'
        })
        if (activeRecords) return res.status(401).send('Student is already registered in a school.')

        await account.student.assignClassId(req.body.schoolClassId)
        const studentInSchool = await StudentInSchool.createIfNotFound(account.student.id, req.account.school.id)
        await studentInSchool.createStudentInClass({schoolClassId: req.body.schoolClassId})

        account.student.dataValues.account = {email: req.body.email}
        res.send(account.student)
    } catch (e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

module.exports = router
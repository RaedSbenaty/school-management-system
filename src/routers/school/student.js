const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

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


module.exports = router
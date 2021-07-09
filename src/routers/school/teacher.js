const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const Teacher = require('../../models/teacher/teacher')
const TeacherInSchool = require('../../models/teacher/teacherInSchool')
const TeacherInClass = require('../../models/teacher/teacherInClass')
const SchoolClass = require('../../models/class/schoolClass')
const Account = require('../../models/account')


// post New Teacher
// /alhbd/2020-2021/teachers/add
/*
{
    "schoolClassId": [1,2],
    "certification": "PHD. HBD",
    "personalInfo":{
    "firstName": "Raneem",
    "lastName": "Alhassan",
    "birthDate": "05-22-1999",
    "residentialAddress": "Damascus"
    },
    "account" : {
        "email": "raneem@hbd.com",
        "password": "12345678",
        "phoneNumber": "+963945587149"
    }
}
*/

router.post('/:siteName/:startYear-:endYear/teachers/add', auth(['School']), async (req, res) => {
    try {

        req.body.account.user = 'Teacher'
        const teacher = await Teacher.create(req.body, {include: ['account', 'personalInfo']})
        const teacherInSchool = await TeacherInSchool.create({teacherId: teacher.id, schoolId: req.account.school.id})
        const classIds = req.body.schoolClassId

        for (const item of classIds) {

            const schoolClass = await SchoolClass.findByPk(item)
            if (!schoolClass || schoolClass.schoolId !== req.account.school.id)
                throw new Error('schoolClassId doesn\'t belong to this school.')

            if (schoolClass.startYear != req.params.startYear || schoolClass.endYear != req.params.endYear)
                throw new Error('schoolClassId doesn\'t belong to this year.')


            await TeacherInClass.create({teacherInSchoolId: teacherInSchool.id, schoolClassId: schoolClass.id})
        }

        res.status(201).send(teacher)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

//post Existing Teacher
// /alhbd/2020-2021/teachers/addExisting
// { "id":1,"email":"raneem@hbd.com", "schoolClassId":[1,2]}
// router.post('/:siteName/:startYear-:endYear/teachers/addExisting', auth(['School']), async (req, res) => {
//     try {
//         const account = await Account.findByIdAndEmail(req.body.id, req.body.email)
//         if (!account || !account.teacher) return res.status(404).send('Invalid teacher criteria.')
//
//         const activeRecords = await TeacherInSchool.count({
//             where: {'$teacher.id$': account.teacher.id, active: true}, include: 'teacher'
//         })
//         if (activeRecords) return res.status(401).send('Teacher is already registered in a school.')
//
//         const classIds = req.body.schoolClassId
//         for (const item of classIds) {
//             await account.teacher.assignClassId(item)
//             const teacherInSchool = await TeacherInSchool.activateAccount(account.teacher.id, req.account.school.id)
//             await teacherInSchool.createTeacherInClass({schoolClassId: req.body.schoolClassId})
//         }
//
//         account.teacher.dataValues.account = {email: req.body.email}
//         res.send(account.teacher)
//     } catch (e) {
//         console.log(e)
//         res.status(500).send({error: e.message})
//     }
// })


// get Teachers In a School (in a year)
// /alhbd/2020-2021/teachers
router.get('/:siteName/:startYear-:endYear/teachers', auth(['School'])
    , async (req, res) => TeacherInSchool.handleGetTeachersRequest(req, res))

module.exports = router
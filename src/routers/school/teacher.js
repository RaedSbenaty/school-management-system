const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const Teacher = require('../../models/teacher/teacher')
const TeacherInSchool = require('../../models/teacher/teacherInSchool')
const TeacherInClass = require('../../models/teacher/teacherInClass')
const SchoolClass = require('../../models/class/schoolClass')

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

        classIds.forEach( async (item) => {
            console.log(item)
            
            const schoolClass = await SchoolClass.findByPk(item)
            if (!schoolClass || schoolClass.schoolId !== req.account.school.id)
                throw new Error('schoolClassId doesn\'t belong to this school.')

            if (schoolClass.startYear != req.params.startYear
                || schoolClass.endYear != req.params.endYear)
                throw new Error('schoolClassId doesn\'t belong to this year.')

           req.body.classId = schoolClass.classId
           // delete req.body.schooClasslId

            await TeacherInClass.create({
                teacherInSchoolId: teacherInSchool.id, schoolClassId: schoolClass.id})
            console.log("finish")
        });

        res.status(201).send(teacher)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

// get Teachers In a School (in a year)
// /alhbd/2020-2021/teachers
router.get('/:siteName/:startYear-:endYear/teachers', auth(['School'])
    , async (req, res) => TeacherInSchool.handleGetTeachersRequest(req,res))

module.exports = router
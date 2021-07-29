const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const Teacher = require('../../models/teacher/teacher')
const TeacherInSchool = require('../../models/teacher/teacherInSchool')
const TeacherInYear = require('../../models/teacher/teacherInYear')
const TeacherInClass = require('../../models/teacher/teacherInClass')
const SchoolClass = require('../../models/class/schoolClass')
const Account = require('../../models/account')


// post New Teacher
// /alhbd/2020-2021/teachers/add
/*
{
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

        teacherInSchool = await TeacherInSchool.create({teacherId: teacher.id, schoolId: req.account.school.id})
        await TeacherInYear.create({
            teacherInSchoolId: teacherInSchool.id,
            startYear: req.params.startYear,
            endYear: req.params.endYear
        })

        console.log("teacher was added to the school")
        res.status(201).send(teacher)

    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

//post Existing Teacher
// /alhbd/2020-2021/teachers/addExisting
//{ "accountId":from postman ,"email":"raneem@hbd.com" }
router.post('/:siteName/:startYear-:endYear/teachers/addExisting', auth(['School']), async (req, res) => {
    try {
        const account = await Account.findByIdAndEmail(req.body.accountId, req.body.email)
        if (!account || !account.teacher) return res.status(404).send('Invalid teacher criteria.')
    
        let where ={
            teacherId: account.teacher.id, 
            schoolId: req.account.school.id
        }
        let teacherInSchool = await TeacherInSchool.findOne({where, include: 'teacher'})

        if(!teacherInSchool)
            teacherInSchool = await TeacherInSchool.create(where)

        where ={
            teacherInSchoolId: teacherInSchool.id,
            startYear: req.params.startYear,
            endYear: req.params.endYear
        }        
        let teacherInYear = await TeacherInYear.findOne({where, include: 'teacherInSchool'})

        if(teacherInYear) return res.status(401).send('Teacher was already added in this year.')

        teacherInYear = await TeacherInYear.create(where)

        account.teacher.dataValues.account = {email: req.body.email}
        console.log("Teacher was added to the school")
        res.send() 
    } catch (e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

// add teacher to classes
// /alhbd/2020-2021/teachers/addInClass
//{ "teacherInYearId":1 , "schoolClassIds": [1,2]}
router.post('/:siteName/:startYear-:endYear/teachers/addInClass', auth(['School']), async (req, res) => {
    try {
        const teacherInYear = await TeacherInYear.findOne({ where: {id: req.body.teacherInYearId} })
        if(!teacherInYear) return res.status(400).send('Teacher is not existed in this year.')

        let schoolClassIds = req.body.schoolClassIds
        for(let element of schoolClassIds) {
            console.log(element)

            let schoolClass = await SchoolClass.findByPk(element)
            if (!schoolClass || schoolClass.schoolId !== req.account.school.id)
                return res.status(400).send('schoolClassId doesn\'t belong to this school.')

            if (schoolClass.startYear != req.params.startYear || schoolClass.endYear != req.params.endYear)
                return res.status(400).send('schoolClassId doesn\'t belong to this year.')
      
            let teacherInClass = await TeacherInClass.findOne({ where: {teacherInYearId: req.body.teacherInYearId, schoolClassId: element} })
             if(teacherInClass) return res.status(400).send('Teacher is already added to this class.')

            teacherInClass = await TeacherInClass.create({ teacherInYearId: req.body.teacherInYearId, schoolClassId: element })

        }
        res.send('teacher was added to the classes') 

    } catch (e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

// get Teachers In a School (in a year)
// /alhbd/2020-2021/teachers
router.get('/:siteName/:startYear-:endYear/teachers', auth(['School'])
    , async (req, res) => TeacherInSchool.handleGetTeachersRequest(req, res))

//get Teacher Classes in a school (in a year)
// /alhbd/2020-2021/teachers/1/classes
router.get('/:siteName/:startYear-:endYear/teachers/:teacherInYearId/classes', auth(['School'])
    , async (req, res) => TeacherInSchool.getTeacherClasses(req, res))

module.exports = router
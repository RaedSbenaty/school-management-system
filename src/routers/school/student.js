const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const Account = require('../../models/account')
const Student = require('../../models/student/student')
const SchoolClass = require('../../models/class/schoolClass')
const StudentInSchool = require('../../models/student/studentInSchool')
const StudentInClass = require('../../models/student/studentInClass')
const Payment = require('../../models/student/payment')

// post New Student
// /alhbd/2020-2021/students/add
/*
{
        "fatherName": "Aamer",
        "motherName": "Hanaa",
        "lastSchoolAttended": "Bla",
        "schoolClassId":1,
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
        },
        "inLocoParentis": {
        "account": {
        "user":"InLocoParentis",
        "email": "inLocoParentis@gmail.com",
        "password": "57239000",
        "phoneNumber": "+963994418888"
        },
        "personalInfo": {
        "firstName": "Bayan",
        "lastName": "Al-Halabi",
        "birthDate": "04-09-1997",
        "residentialAddress": "Damascus"
        }
        }
}
*/

router.post('/:siteName/:startYear-:endYear/students/add', auth(['School']), async (req, res) => {
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

        const student = await Student.create(req.body, {
            include: [{association: 'account'}, {association: 'personalInfo'},
                {association: 'inLocoParentis', include: ['account', 'personalInfo']}]
        })
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
router.post('/:siteName/:startYear-:endYear/students/addExisting', auth(['School']), async (req, res) => {
    try {
        const account = await Account.findByIdAndEmail(req.body.id, req.body.email)
        if (!account || !account.student) return res.status(404).send('Invalid student criteria.')

        const activeRecords = await StudentInSchool.count({
            where: {'$student.id$': account.student.id, active: true}, include: 'student'
        })
        if (activeRecords) return res.status(401).send('Student is already registered in a school.')

        await account.student.assignClassId(req.body.schoolClassId)
        const studentInSchool = await StudentInSchool.activateAccount(account.student.id, req.account.school.id)
        await studentInSchool.createStudentInClass({schoolClassId: req.body.schoolClassId})

        account.student.dataValues.account = {email: req.body.email}
        res.send(account.student)
    } catch (e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

// get Students In a School (in a year)
// /alhbd/2020-2021/students
router.get('/:siteName/:startYear-:endYear/students', auth(['School'])
    , async (req, res) => StudentInSchool.handleGetStudentsRequest(req, res))

// patch Disable Student In School
// /alhbd/2020-2021/students/disable
// {"studentId":1}

router.patch('/:siteName/:startYear-:endYear/students/disable', auth(['School']),
    async (req, res) => {
        try {
            const updateRows = await StudentInSchool.update({active: false},
                {where: {schoolId: req.account.school.id, studentId: req.body.studentId}})
            if (!updateRows[0]) return res.status(404).send('Student not found in this school.')
            res.send('Account has been disabled.')
        } catch (e) {
            console.log(e)
            res.status(500).send('Disabling failed.')
        }
    })

/*
 post payment
 /alhbd/2020-2021/students/payments/add
 {
    "studentInClassId": 1,
    "value": 1000,
    "date": "1-1-2020"
 }
 */
router.post('/:siteName/:startYear-:endYear/students/payments/add', auth(['School']), async (req, res) => {
    try {
        await Payment.create(req.body)
        res.send('Adding a payment is done.')
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e.message)
    }
})

// get payments
// /alhbd/2020-2021/students/1/payments
router.get('/:siteName/:startYear-:endYear/students/:studentId/payments', auth(['School']), async (req, res) => {
    try {
        const studentInClass = await StudentInClass.getStudentInClass(req.params.studentId
            , req.account.school.id, req.params.startYear, req.params.endYear)
        if (!studentInClass) return res.status(400).send('Invalid student id.')
        const payments = await StudentInClass.getPayments(studentInClass.id)
        res.send(payments)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})


module.exports = router
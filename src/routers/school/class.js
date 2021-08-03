const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const School = require('../../models/school/school')
const SchoolClass = require('../../models/class/schoolClass')
const Classroom = require('../../models/class/classroom')
const StudentInSchool = require('../../models/student/studentInSchool')
const StudentInClass = require('../../models/student/studentInClass')
const TeacherInSchool = require('../../models/teacher/teacherInSchool')


/* post Classes
/alhbd/2020-2021/classes/add
{"classes":[1,3,5]}
 */
router.post('/:siteName/:startYear-:endYear/classes/add', auth(['School']), async (req, res) => {
    try {
        const school = req.account.school
        school.schoolClasses = await school.getSchoolClasses()

        await school.createSchoolClasses(req.params.startYear, req.params.endYear, req.body.classes)
        res.send(`Classes with id: ${req.body.classes} were added.`)
    } catch (e) {
        console.log(e)
        res.status(400).send({error: e.message.split(',')})
    }
})


/* get Classes
/alhbd/2020-2021/classes
 */
router.get('/:siteName/:startYear-:endYear/classes', auth(['School']), async (req, res) => {
    try {
        const school = await School.findByCriteriaInPeriod(req.account.school.id
            , req.params.startYear, req.params.endYear)

        res.send({schoolClasses: school.schoolClasses})
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e.message)
    }
})


/*
 patch schoolClasses (for fees)
 /alhbd/2020-2021/classes/addFees
 [
    { "id": 1, "fees": 5000 },
    { "id": 2, "fees": 6000 }
 ]
*/
router.patch('/:siteName/:startYear-:endYear/classes/addFees', auth(['School']), async (req, res) => {
    try {
        const promises = []
        req.body.forEach(({id, fees}) => promises.push(SchoolClass.update({fees}, {where: {id}})))
        await Promise.all(promises)
        res.send('Adding fees is done.')
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e.message)
    }
})


// get Students In a class (in a year)
// /alhbd/2020-2021/classes/Second_Grade/students
router.get('/:siteName/:startYear-:endYear/classes/:className/students', auth(['School'])
    , async (req, res) => StudentInSchool.handleGetStudentsRequest(req, res))


// post Sort Students to classroom
// /alhbd/2020-2021/classes/Preschool/sortStd
//  [{"id":1,"classroomNumber":180},
//  {"id":2,"classroomNumber":250}]
router.post('/:siteName/:startYear-:endYear/classes/:className/sortStd', auth(['School'])
    , async (req, res) => {
        try {
            for (const student of req.body) {
                const {id, classroomNumber} = student
                const classroom = await Classroom.findByCriteria(req.account.school.id, req.params.startYear,
                    req.params.endYear, req.params.className, classroomNumber)
                if (classroom)
                    await StudentInClass.update({classroomId: classroom.id}, {where: {id}})
            }
            res.send('Sorting is done.')
        } catch (e) {
            console.log(e)
            res.status(500).send('Sorting students failed.')
        }
    })

// distribute students through classrooms according to sortType
/*
example
/alhbd/2020-2021/classes/Second_Grade/sortStd/auto
[
    {
        "studentsNumber": 1,
        "classroomNumber": 1
    },
    {
        "studentsNumber": 1,
        "classroomNumber": 2
    }
]
*/
router.patch('/:siteName/:startYear-:endYear/classes/:className/sortStd/auto/:sortType*?', auth(['School']), async (req, res) => {

    const className = req.params.className.replace('_', ' ')
    var msg = ""
    try {
        var studentsInSchool = await StudentInSchool.getStudents(req.account.school.id, req.params.startYear, req.params.endYear, className)

        if (req.params.sortType === 'alpha') {

            studentsInSchool.sort((a, b) => {
                var aPersonalInfo = a.dataValues.student.dataValues.personalInfo
                var bPersonalInfo = b.dataValues.student.dataValues.personalInfo
                var res = aPersonalInfo.dataValues.firstName.localeCompare(bPersonalInfo.dataValues.firstName)
                if (!res)
                    return aPersonalInfo.dataValues.lastName.localeCompare(bPersonalInfo.dataValues.lastName)
                return res
            })
            msg = "students classrooms for " + className + " class have been updated according to alphabetical order."
        }

        let studentsInClass = []
        for (let student of studentsInSchool) {
            var studentInClass = student.dataValues.studentInClasses
            studentsInClass.push(studentInClass)
        }

        var i = 0;
        element = req.body[i]
        for (let studentInClass of studentsInClass) {

            if (element.studentsNumber === 0) {
                i++
                element = req.body[i]
            }
            var classroomId = element.classroomNumber

            await studentInClass[0].update({"classroomId": classroomId})

            element.studentsNumber--
        }

        if (msg === "")
            msg = "students classrooms for " + className + " class have been updated according to their registiration date."

        res.status(201).send(msg)
    } catch (e) {
        console.log(e)
        res.status(400).send('Updating failed.')
    }
})

// get Teachers In a class (in a year)
// /alhbd/2020-2021/classes/Fifth_Grade/teachers
router.get('/:siteName/:startYear-:endYear/classes/:className/teachers', auth(['School'])
    , async (req, res) => TeacherInSchool.handleGetTeachersRequest(req, res))

module.exports = router

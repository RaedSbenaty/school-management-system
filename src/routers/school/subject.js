const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const SchoolClass = require('../../models/class/schoolClass')
const SubjectInYear = require('../../models/subject/subjectInYear')
const SubjectInSemester = require('../../models/subject/subjectInSemester')

//adding subjects from possible categories to a school class through specific semesters
/*
example
/alhbd/2020-2021/Second_Grade/subjects/add

{
    "subjects": [
        {
            "categoryId": 1,
            "name": "ck",
            "subjectInSemesters": [
                {"semester": 1},
                {"semester": 3}
            ]
        }
    ]
}
*/
router.post('/:siteName/:startYear-:endYear/:className/subjects/add', auth, async (req, res) => {
    try {
        const className = req.params.className.replace('_', ' ')

        const schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className)

        if (!schoolClass.id)
            return res.status(404).send('This school does not have a ' + className + ' class')


        await schoolClass.checkSubjectsExist(req.body.subjects)

        for (let subject of req.body.subjects)
            await schoolClass.createSubjectInYear(subject, { include: [SubjectInSemester] })
        res.status(201).send('Subjects were added for ' + className + ' class')

    } catch (e) {
        console.log(e)
        res.status(400).send(e.message.split(','))
    }
})

//get subjects for a school in a specific year and semester for some class
/*
example
/alhbd/2020-2021/Second_Grade/1/subjects
*/
router.get('/:siteName/:startYear-:endYear/:className/:semester/subjects', auth, async (req, res) => {
   return SubjectInSemester.handleGetSubjectsRequests(req, res)
})
    // async (req, res) => StudentInSchool.handleGetStudentsRequest(req, res))
    //(schoolId, startYear, endYear, className, semester, categoryName, name)



router.get('/subjects3', async (req, res) => {
    try
    {var subjects = SubjectInSemester.findAll({include: {all: true, nested: true}})
    res.send(subjects)

}
    catch(e)
    {
        console.log(e);
    }
})




module.exports = router
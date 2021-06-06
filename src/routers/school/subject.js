const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const SchoolClass = require('../../models/class/schoolClass')
const SubjectInYear = require('../../models/subject/subjectInYear')
const SubjectInSemester = require('../../models/subject/subjectInSemester')

//adding subjects from possible categories to a school class through specific semesters
/*
example
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
router.post('/:schoolName/:startYear-:endYear/subjects/:className/add', auth, async (req, res) => {
    try {
        const className = req.params.className.replace('_', ' ')

        const schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className)

        if (!schoolClass)
            return res.status(404).send('This school does not have a ' + className + ' class')

        for (let subject of req.body.subjects)
            await schoolClass.createSubjectInYear(subject, {include: [SubjectInSemester]})

        res.status(201).send('Subjects were added for this class.')
    } catch (e) {
        console.log(e)
        res.status(400).send('Unable to add all subjects.')
    }
})

//getting a school subjects
/*
example
{{url}}/Raghad/subjects
*/
router.get('/:siteName/subjects', async (req, res) => {
    try {
        const schoolName = req.params.siteName
        const school = await SubjectInYear.findAll({
            include: {
                association: 'schoolClass',
                include: {
                    association: 'school', where: {schoolName}
                }
            }
        })
        res.status(200).send(school)
    } catch (e) {
        console.log(e)
        res.status(500).send('Failed to fetch subjects for ' + schoolName)
    }
})


module.exports = router
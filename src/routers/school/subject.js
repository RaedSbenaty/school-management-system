const express = require('express')
const router = express.Router()

const SubjectInYear = require('../../models/subject/subjectInYear')


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
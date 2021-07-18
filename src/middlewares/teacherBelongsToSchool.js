const School = require('../models/school/school')
const TeacherInYear = require('../models/teacher/teacherInYear')

module.exports = async (req, res, next) => {
    const school = await School.findOne({include: {association: 'account', where: {siteName: req.params.siteName}}})

    const teacherInYear = await TeacherInYear.getTeacherInYear(req.params.teacherId,
        school.id, req.params.startYear, req.params.endYear)

    if (!teacherInYear) res.status(401).send('Teacher does\'nt belong to this school in this year.')

    req.teacherInYear = teacherInYear
    req.teacherInClassIds = teacherInYear.teacherInClasses.map(element => element.id)
    next()
}
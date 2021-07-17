const School = require('../models/school/school')
const StudentInClass = require('../models/student/studentInClass')

module.exports = async (req, res, next) => {
    const school = await School.findOne({include: {association: 'account', where: {siteName: req.params.siteName}}})

    const studentInClass = await StudentInClass.getStudentInClass(req.params.studentId,
        school.id, req.params.startYear, req.params.endYear)

    if (!studentInClass) res.status(401).send('Student does\'nt belong to this school in this year.')

    req.studentInClass = studentInClass
    next()
}
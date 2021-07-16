const School = require('../models/school')
const StudentInClass = require('../models/student/studentInClass')

module.exports = async (req, res, next) => {
    const school = await School.findOne({include: {association: 'account', where: {siteName: req.params.siteName}}})

    const studentInClass = await StudentInClass.findOne({
        subQuery: false, attributes: ['id', 'schoolClassId', 'classroomId'],
        include: [{association: 'classroom', attributes: []}, {
            attributes: [], association: 'schoolClass',
            where: {startYear: req.params.startYear, endYear: req.params.endYear}
        }, {association: 'studentInSchool', where: {studentId: req.params.studentId, schoolId: school.id}}]
    })

    if (!studentInClass) res.status(401).send('Student does\'nt belong to this school in this year.')

    req.studentInClass = studentInClass
    next()
}
import authService from './authService'

export function signUpStudent(student) {
    let newStudent = {
        student: {
            fatherName: student.fatherName,
            motherName: student.motherName,
            lastSchoolAttended: student.lastSchoolAttended,
            lastDegree: student.previousClass,
        },
        personal_info: {
            firstName: student.firstName,
            lastName: student.lastName,
            birthDate: student.birthDate,
            residentialAddress: student.address
        },
        account: {
            email: student.email,
            password: student.password,
            phoneNumber: student.phoneNumber
        }
    }
    return authService.post("http://localhost:3000/signup/students", newStudent)
}
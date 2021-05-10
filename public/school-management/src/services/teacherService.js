import authService from './authService'

export function signUpTeacher(teacher) {
    let newTeacher = {
        personal_info: {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            birthDate: teacher.birthDate,
            residentialAddress: teacher.address
        },
        studying_data: {
            certification: teacher.specification
        },
        account: {
            email: teacher.email,
            password: teacher.password,
            phoneNumber: teacher.phoneNumber
        }
    }
    console.log(JSON.stringify(newTeacher))
    return authService.post("http://localhost:3000/signup/teachers", newTeacher);
}


/**
 *
 * {
    "student": {
        "fatherName": "Aamer",
        "motherName": "Hanaa",
        "lastSchoolAttended": "Bla",
        "lastDegree": "bachleor"           //optional
    },
    "personal_info": {
        "firstName": "Raghad",
        "lastName": "Al-Halabi",
        "birthDate": "04-17-2001",
        "residentialAddress": "Damascus"
    },
    "account": {
        "email": "abd@hbd.com",
        "password": "12345678",
        "phoneNumber": "+961994418888",
        "personalImage": ""                 //optional

    }
}
 */
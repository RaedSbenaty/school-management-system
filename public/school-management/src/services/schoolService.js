/*{
    "schoolInfo": {
        "schoolName": "Raghad",
        "location": "midan",
        "foundationDate": "08-05-2021",                            //optional
        "facebookPage": "https://www.facebook.com/AlHudoodNet/"    //optional
    },
    "account": {
        "email": "dodeh@hbd.com",
        "password": "100009078",
        "phoneNumber": "+963944656499"
    }
}*/

import authService from './authService';

export function signUpSchool(school) {
    let newSchool = {
        schoolInfo: {
            schoolName: school.name,
            location: school.location,
            foundationDate: school.openingDate,
            facebookPage: school.facebookPage
        },
        account: {
            email: school.email,
            password: school.password,
            phoneNumber: school.phoneNumber
        }
    }
    console.log(JSON.stringify(newSchool));
    return authService.post("http://localhost:3000/signup/schools", newSchool);
}


// const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

const validEmailRegex = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
const ValidPhoneRegex = RegExp(/^\d{10}$/);


export const validate = (errors, name, value) => {
    switch (name) {
        case 'firstname':
            if (value === '' || value.length === 0) {
                errors.firstName = 'First Name is required'
            } else {
                errors.firstName = null;
            }
            break;
        case 'lastname':
            if (value === '' || value.length === 0) {
                errors.lastName = 'Last Name is required'
            } else {
                errors.lastName = null;
            }
            break;
        case 'email':
            if (value === '' || value.length === 0) {
                errors.email = 'Email is required'
            } else if (!validEmailRegex.test(value)) {
                errors.email = 'Email is not valid'
            } else {
                errors.email = null;
            }
            break;

        case 'notificationEmail':
            if (value === '' || value.length === 0) {
                errors.notificationEmail = null;
            }else if(!validEmailRegex.test(value)){
                
                errors.notificationEmail = 'Email is not valid'
            }else {
                errors.notificationEmail = null;
            }
            break;
        case 'password':
            if (value === '' || value.length === 0) {
                errors.password = 'Password is required'
            } else {
                errors.password = null;
            }
            break;
        case 'phone':
            if (value === '' || value.length === 0) {
                errors.phone = null;
            } else if (!ValidPhoneRegex.test(value)) {
                errors.phone = 'Contact Number is not valid'
            } else {
                errors.phone = null;
            }
            break;

            case 'notificationPhoneNum':
                if (value === '' || value.length === 0) {
                    errors.notificationPhoneNum = null;
                }else if(!ValidPhoneRegex.test(value)){
                    
                    errors.notificationPhoneNum = 'Contact Number is not valid'
                }else {
                    errors.notificationPhoneNum = null;
                }
                break;
        case 'rolename':
            if (value === '' || value.length === 0) {
                errors.rolename = 'Role name is required'
            } else {
                errors.rolename = null;
            }
            break;
        case 'description':
            if (value === '' || value.length === 0) {
                errors.description = 'Role description is required'
            } else {
                errors.description = null;
            }
            break;

        default:
            break;
    }

    return errors;
}


export const validateForm = (type,errors) => {
    let valid = true;
    if(type === 'changepersonalinfo'){
        if(errors.firstName || errors.lastName || errors.email || errors.phone){
            valid = false;
        }
    }else if(type === 'changepassword'){
        if(errors.cpassword || errors.npassword || errors.cnpassword){
            valid = false;
        }
    }else if(type === 'changenotification'){
        if(errors.notificationEmail || errors.notificationPhoneNum){
            valid = false;
        }
    }
    

    return valid;

}
import bcrypt from 'bcryptjs';
class User {
    constructor(userID, fName, lName, email, password, role, gender, createdAt, updatedAt) {
        this.userID = userID;
       this.setFName(fName);
        this.setLName(lName);
        this.setEmail(email);
        this.setPassword(password);
        this.setRole(role);
        this.setGender(gender);
        this.setCreatedAt(createdAt);
        this.setUpdatedAt(updatedAt);
    }

    // Getters

    getFName() {
        return this.fName;
    }

    getLName() {
        return this.lName;
    }

    getEmail() {
        return this.email;
    }

    getPassword() {
        return this.password;
    }

    getRole() {
        return this.role;
    }

    getGender() {
        return this.gender;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getUpdatedAt() {
        return this.updatedAt;
    }

    // Setters with validation and error throwing
    
   setFName(value) {
        
        this.fName = value;
    }

  setLName(value) {
        
        this.lName = value;
    }

    setEmail(value) {
        
        this.email = value;
    }

    setPassword(value) {
       
        this.password = this.hashPassword(value);
    }

    hashPassword(password) {

        const passwordStr = String(password);
        if (!passwordStr) {
            throw new Error('Password cannot be empty or undefined.');
        }
        
        // Convert password to string to avoid the error
       
        
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(passwordStr, salt);
    }
    
    

    setRole(value) {
        /*if (!['A', 'M','E'].includes(value)) { // Example: 'A' for admin, 'U' for user
            throw new Error("Invalid role, Either A, M or E");
        }*/
        this.role = value;
    }

    setGender(value) {
        /*const genderChar = String(value).charAt(0); // Convert value to a string and get the first character
    
        if (!['M', 'F'].includes(genderChar)) {
            throw new Error("Invalid gender, either F or M");
        }*/
    
        this.gender = value;
    }
    
    

    setCreatedAt(value) {
        if (!(value instanceof Date)) {
            throw new Error("CreatedAt must be a valid Date object");
        }
        this.createdAt = value;
    }

    setUpdatedAt(value) {
        if (!(value instanceof Date)) {
            throw new Error("UpdatedAt must be a valid Date object");
        }
        this.updatedAt = value;
    }
}

export default User;

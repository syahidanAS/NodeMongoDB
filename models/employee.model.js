const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: 'Kolom nama harus diisi'
    },
    email:{
        type: String
    },
    mobile:{
        type: String
    },
    city:{
        type: String
    }
});

//Kustom Validasi untuk Input email
employeeSchema.path('email').validate((val)=>{
    emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
},'Format email salah');

mongoose.model('Employee',employeeSchema);


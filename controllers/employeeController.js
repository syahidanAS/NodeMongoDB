const { response } = require('express');
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/',(req,res)=>{
    res.render("employee/addOrEdit",{
        viewTitle:"Insert Employee"
    });
});
//untuk routing, jika data kosong maka jalankan perintah tambah data, jika tidak ada tampilkan perintah update data
router.post('/',(req,res)=>{
    if(req.body._id=='')
    masukkanData(req,res);
    else
    updateRecord(req,res);
});
//Function untuk menambahkan data baru
function masukkanData(req,res){
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    //Query untuk tambah data
    employee.save((err, doc)=>{
        //Jika proses tidak ada masalah maka redirect ke halaman list
        if(!err)
        res.redirect('employee/list');
        else{
            //Jika ada kesalahan kembalikan ke halaman addOrEdit
            if(err.name == 'ValidationError'){
            handleValidationError(err, req.body);
            //render adalah fungsi untuk menampilkan halaman html
            res.render("employee/addOrEdit",{
                employee:req.body
            });
        }
            else
            console.log('Error during record insertion : '+err);
        }
    });
}
//Function untuk menampilkan seluruh data karyawan pada halaman list
router.get('/list',(req,res)=>{
    Employee.find((err,docs)=>{
        if(!err){
            res.render("employee/list",{
                list:docs
            });
        }
        else{
            console.log('Gagal memuat data karyawan: '+err);
        }
    })
    .lean();
});
//Handle untuk validasi kolom input nama dan email
function handleValidationError(err,body){
    for (field in err.errors)
    {
        switch (err.errors[field].path){
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
                case 'email':
                    body['emailError'] = err.errors[field].message;
                    break;
                    default:
                        break;
        }
    }
}
//Fungsi untuk edit data
function updateRecord(req,res){
    //Query untuk update data
    Employee.findOneAndUpdate({_id: req.body._id}, req.body,{new: true},(err, doc)=>{
        //Jika proses update berhasil maka redirect ke halaman list
        if(!err){res.redirect('employee/list');}
        else{
            if(err.name=='ValidationError'){
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit",{
                    viewTitle:'Update Employee',
                    employee:req.body
                });
            }
            else{
                console.log('Error during record update : '+err);
            }
        }
    });
}
//Untuk mendapatkan data yang diklik untuk diedit berdasarkan _id
router.get('/:id',(req,res)=>{
    Employee.findById(req.params.id,(err, doc)=>{
        if(!err){
            //Jika proses get data untuk diedit berhasil maka fetch data ke dalam form edit
            //render untuk mengganti header halaman menjadi Update Employe
            res.render("employee/addOrEdit",{
                viewTitle: "Update Employee",
                employee:doc
            })
        }
    }).lean();
});
//Untuk mendapatkan data yang diklik untuk dihapus berdasarkan _id
router.get('/delete/:id',(req,res)=>{
    //Query untuk menghapus data
    Employee.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(!err){
            //Jika proses penghapusan tidak ada masalah kembalikan ke halaman list
            res.redirect('/employee/list');
        }else{
            //tampilkan error di console log
            console.log('Error in employee delete :'+err)
        }
    });
});

module.exports = router;

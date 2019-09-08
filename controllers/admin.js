const path = require('path');
const fs = require('fs');

module.exports = function (formidable, Club) {
    return {
        SetRouting: function (router) {
            router.get('/dashboard', this.adminPage);

            router.post('/uploadFile', this.uploadFile);
            router.post('/dashboard', this.adminPostPage);
        },
        adminPage: function (req, res) {
            res.render('admin/dashboard');
        },
        adminPostPage: function (req, res) {
            const newClub = new Club();
            newClub.name = req.body.club;
            newClub.country = req.body.country;
            newClub.image = req.body.upload;
            newClub.save((err) => { res.render('admin/dashboard') });
        },
        uploadFile: function (req, res) {
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, '../public/uploads');
            form.on('file', (field, file) => {
                fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
                    if (err) throw err;
                    console.log('file rename successfully');
                })
            })
            form.on('error', (err) => {
                console.log(err);
            })
            form.on('end', () => {
                console.log('File upload is successful');
            })
            form.parse(req);
        },
    }
}
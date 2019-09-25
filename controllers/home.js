module.exports = function (async, Club, _, Users) {
    return {
        SetRouting: function (router) {
            router.get('/home', this.homePage);
            router.post('/home', this.postHomePage);
        },
        homePage: function (req, res) {
            async.parallel([
                function (callback) {
                    Club.find({}, (err, results) => {
                        callback(err, results);
                    });
                },
                function (callback) {
                    Club.aggregate([{
                        $group: {
                            _id: "$country"
                        }
                    }], (err, newResults) => {
                        callback(err, newResults);
                    })
                },
                function (callback) {
                    Users.findOne({ 'username': req.user.username })
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                }
            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const res3 = results[2];
                const dataChunk = [];
                const chunkSize = 2;
                for (let i = 0; i < res1.length; i += chunkSize) {
                    dataChunk.push(res1.slice(i, i + chunkSize));
                }
                const res2Sort = _.sortBy(res2, '_id');
                res.render('home', { title: 'Chat - Home', user: req.user, chunks: dataChunk, country: res2Sort, data: res3 });
            })
        },
        postHomePage: function (req, res) {
            async.parallel([
                function (callback) {
                    Club.update({
                        '_id': req.body.id,
                        'fans.username': { $ne: req.user.username },
                    }, {
                        $push: {
                            fans: {
                                username: req.user.username,
                                email: req.user.email,
                            }
                        }
                    }, (err, count) => {
                        callback(err, count);
                    })
                },
            ], (err, results) => {
                return res.redirect('/home');
            })
        },
    }
}
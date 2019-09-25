module.exports = function (Users, async) {
    return {
        SetRouting: function (router) {
            router.get('/group/:name', this.groupPage);
            router.post('/group/:name', this.groupPostPage);
        },
        groupPage: function (req, res) {
            const name = req.params.name;
            async.parallel([
                function (callback) {
                    Users.findOne({ 'email': req.user.email })
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                }
            ], (err, result) => {
                const result1 = result[0];
                //console.log(result[0].request[0].userId);
                res.render('groupChat/group', { title: 'Chat - Group', user: req.user, groupName: name, data: result1 });
            })

        },
        groupPostPage: function (req, res) {
            async.parallel([
                function (callback) {
                    if (req.body.receiverName) {
                        Users.update({
                            'username': req.body.receiverName,
                            'request.userId': { $ne: req.user._id },
                            'friendsList.friendId': { $ne: req.user._id },
                        }, {
                            $push: {
                                request: {
                                    userId: req.user._id,
                                    username: req.user.username,
                                }
                            },
                            $inc: { totalRequest: 1 }
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                },
                function (callback) {
                    if (req.body.receiverName) {
                        Users.update({
                            'username': req.user.username,
                            'sentRequest.username': { $ne: req.body.receiverName },
                        }, {
                            $push: {
                                sentRequest: { username: req.body.receiverName },
                            }
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                }
            ], (err, results) => {
                res.redirect('/group/' + req.params.name);
            });
            async.parallel([
                //update friendlist of receiver
                function (callback) {

                    if (req.body.senderId) {
                        console.log('accept');
                        Users.update({
                            '_id': req.user._id,
                            'friendsList.friendId': { $ne: req.body.senderId },
                        }, {
                            $push: {
                                friendsList: {
                                    friendId: req.body.senderId,
                                    friendName: req.body.senderName,
                                }
                            },
                            $pull: {
                                request: {
                                    userId: req.body.senderId,
                                    username: req.body.senderName,
                                }
                            },
                            $inc: { totalRequest: -1 },
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },
                //update friendslist of sender and delete sentrequest
                function (callback) {
                    if (req.body.senderId) {
                        Users.update({
                            '_id': req.body.senderId,
                            'friendsList.friendId': { $ne: req.user._id },
                        }, {
                            $push: {
                                friendsList: {
                                    friendId: req.user._id,
                                    friendName: req.user.username,
                                }
                            },
                            $pull: {
                                sentRequest: {
                                    userId: req.user._id,
                                    username: req.user.username,
                                }
                            },
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },
                //update receiver
                function (callback) {
                    if (req.body.user_Id) {
                        Users.update({
                            '_id': req.user._id,
                            'request.userId': { $eq: req.body.user_Id },
                        }, {
                            $pull: {
                                request: {
                                    userId: req.body.user_Id,
                                }
                            },
                            $inc: { totalRequest: -1 }
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                },
                //update sender
                function (callback) {
                    if (req.body.user_Id) {
                        Users.update({
                            '_id': req.body.user_Id,
                            'sentRequest.username': { $eq: req.user.username },
                        }, {
                            $pull: {
                                sentRequest: {
                                    username: req.user.username,
                                }
                            },
                        }, (err, count) => {
                            //console.log(count);
                            callback(err, count);
                        });
                    }
                },
            ], (err, results) => {
                res.redirect('/group/' + req.params.name);
            });
        },
    }
}
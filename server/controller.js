const path = require('path');
const model = require('./model');

const hashing = require(path.join(__dirname, 'config', 'hashing.js'));
const salt = require(path.join(__dirname, 'config', 'db.json')).salt;


const AWS = require('aws-sdk');
const { ManagedUpload } = require('aws-sdk/clients/s3');
AWS.config.loadFromPath(
    path.join(__dirname, 'config', 'awsConfig.json')
);

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const now_date = moment().format('YYYY-MM-DD HH:mm:ss');

const user_ip = require("ip");

const nodeMailer = require('nodemailer');

const mailPoster = nodeMailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'duddndtncks@gmail.com',
        pass : 'shtncks1!@'
    }
});

const mailOpt = (user_data, title, contents) => {
    const mailOptions = {
        from : 'duddndtncks@gmail.com',
        to : user_data.email,
        subject : title,
        text : contents
    };

    return mailOptions;
}

const sendMail = (mailOption) => {
    mailPoster.sendMail(mailOption, function(error, info){
        if(error) {
            console.log('Error ' + error);
        }
        else {
            console.log('전송 완료 ' + info.response);
        }
    });
}

module.exports = {
    needs: () => upload,
    api: {
        /*
        getData : (req, res) => {
            model.api.getData( data => {
                console.log(req.body);
                return res.send(data)
            })
        },

        addData : (req, res) => {
            const body = req.body;
            model.api.addData( body,data => {
                return res.send(data)
            })
        },

        modifyData : (req, res) => {
            const body = req.body;
            model.api.modifyData( body,data => {
                return res.send(data)
            })
        },

        deleteData : (req, res) => {
            const body = req.body;
            model.api.deleteData( body,data => {
                return res.sendStatus(200)
            })
        },
        */
        sendPw : (req, res) => {
            const body = req.body;
            const hash = hashing.enc(body.id, body.password, salt);

            model.api.searchInfo(body, hash, result => {
                var obj = {};
                if(result[0]) {
                    obj['suc'] = result[0].dataValues;
                    obj['msg'] = '로그인 성공';
                    obj['ip'] = user_ip.address();
                    
                } else {
                    obj['suc'] = false;
                    obj['msg'] = '로그인 실패';
                }

                res.send(obj);
            })

            console.log('1. salt 값 : ', salt);
            console.log('3. hash 값 : ', hash);
        },
    },


    search : {
        id : (req, res) => {
            const body = req.body;

            model.search.id(body, result => {
                res.send(result);
            })
        },

        pw : (req, res) => {
            const body = req.body;

            model.search.pw(body, result => {
                var res_data = {};

                if(result[0]) {
                    const title = "비밀번호 조회 인증에 대한 6자리 숫자입니다.";
                    const contents = () => {
                        let number = "";
                        let random = 0;

                        for(let i=0; i<6; i++) {
                            random = Math.trunc(Math.random() * (9 - 0) + 0);
                            number += random;
                        }

                        res_data['secret'] = number;
                        return "인증 칸에 아래의 숫자를 입력해주세요. \n" + number;
                    }
                    const mailOption = mailOpt(result[0].dataValues, title, contents());
                    sendMail(mailOption);

                    res_data['result'] = result;
                    res.send(res_data);
                } else {
                    res.send(false);
                }

                
            })
        }
    },

    add : {

        user : (req, res) => {
            const body = req.body;

            const hash_pw = hashing.enc(body.id, body.password, salt);

            model.add.user(body, hash_pw, now_date, result => {
                res.send(result);
            })
        },

        board : (req, res) => {
            const body = req.body;

            model.add.board(body, result => {
                if(result){
                    res.send(true);
                }
            })
        },

        category : (req, res) => {
            const body = req.body;

            model.add.category(body, result => {
                var obj = {};
                if(result) {
                    obj['suc'] = true;
                    obj['msg'] = '카테고리가 생성되었습니다.';
                } else {
                    obj['suc'] = false;
                    obj['msg'] = '이미 존재하는 카테고리 이름입니다.';
                }

                res.send(obj)
            })
        }
    },

    get : {
        board : (req, res) => {
            const body = req.body;

            model.get.board(body, result => {
                if(result) {
                    res.send(result);
                }
            })
        },

        board_cnt : (req, res) => {
            const body = req.body;

            model.get.board_cnt(body, cnt => {
                const result = { cnt : cnt };
                res.send(result);
            })
        },

        board_data : (req, res) => {
            const body = req.body;

            model.get.board_data(body, data => {
                const result = { data : data }
                res.send(result);
            })
        },

        category : (req, res) => {
            model.get.category(data => {
                res.send(data)
            })
        }
    },

    update : {

        like : (req, res) => {
            const body = req.body;

            model.check.like(body, data => {
                if(data.length === 0) {
                    model.update.like(body, result => {
                        res.send(result)
                    })
                } else {
                    if(body.type==='remove') {
                        model.update.like(body, result => {
                            res.send(result)
                        })
                    } else {
                        res.send(false)
                    }
                }
            })

            
        },

        password : (req,res) => {
            const body = req.body;
            const hash_pw = hashing.enc(body.user_id, body.change_password, salt);

            model.update.password(body, hash_pw, result => {
                res.send(true)
            })
        },

        view_cnt : (req, res) => {
            const body = req.body;

            const expires = new Date()
            expires.setDate(expires.getDate() + 1)

            const cookie_name = 'board_' + body.id;

            const exist_cookie = req.cookies[cookie_name];

            if(!exist_cookie) {
                res.cookie(cookie_name, true, {
                    expires : expires
                });

                model.update.view_cnt(body, result => {
                    if(result) {
                        res.send(true);
                    }
                })
            }
            
            
        }
    },

    delete : {
        category : (req, res) => {
            const body = req.body;

            model.delete.category(body, result => {
                if(result) {
                    res.send(result);
                }
            })
        }
    },

    modify : {
        category : (req, res) => {
            const body = req.body;

            model.modify.category(body, result => {
                var obj = {};

                if(result) {
                    obj['suc'] = true;
                    obj['msg'] = '카테고리가 변경되었습니다.';
                } else {
                    obj['suc'] = false;
                    obj['msg'] = '이미 있는 카테고리 입니다.';
                }

                res.send(obj);
            })
        }
    },

    check : {
        like : (req, res) => {
            const body = req.body;

            model.check.like(body, result => {
                res.send(result);
            })
        }
    }
}
const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/add/user', controller.add.user);
router.post('/send/pw', controller.api.sendPw);
router.post('/search/id', controller.search.id);
router.post('/search/pw', controller.search.pw);
router.post('/update/password', controller.update.password);

router.post('/add/board', controller.add.board);
router.post('/get/board', controller.get.board);
router.post('/get/board_cnt', controller.get.board_cnt);
router.post('/get/board_data', controller.get.board_data);

router.post('/update/view_cnt', controller.update.view_cnt);
router.post('/update/like', controller.update.like);
router.post('/check/like', controller.check.like);

router.get('/get/category', controller.get.category);
router.post('/add/category', controller.add.category);
router.post('/delete/category', controller.delete.category);
router.post('/modify/category', controller.modify.category);

module.exports = router;

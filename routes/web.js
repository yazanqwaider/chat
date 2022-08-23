const {Router} = require('express');
const router = Router();

const authController = require('../src/controllers/authController');
const chatsController = require('../src/controllers/chatController');
const peopleController = require('../src/controllers/peopleController');
const authMiddleware = require('../src/middleware/authMiddleware');


router.get('/*', authMiddleware.getUserObject);

router.get('/', (req, res) => {
    res.render('welcome');
});

router.get('/login', authMiddleware.checkGuest, authController.login_get);

router.post('/login', authController.login_post);

router.get('/signup', authMiddleware.checkGuest, authController.signup_get);

router.post('/signup', authMiddleware.checkGuest, authController.signup_post);

router.get('/logout', authController.logout_get);

router.get('/chats', authMiddleware.checkAuthentication, chatsController.chats_get);

router.get('/people', authMiddleware.checkAuthentication, peopleController.people_get);

module.exports = router;

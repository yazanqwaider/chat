const {Router} = require('express');

const router = Router();

const peopleController = require('../src/controllers/peopleController')
const chatController = require('../src/controllers/chatController');
const authMiddleware = require('../src/middleware/authMiddleware');

router.use('/api', authMiddleware.checkApiAuthentication);


router.get('/api/people', peopleController.api_people_get);
router.post('/api/people/:required_action/:id', peopleController.api_people_post);

router.get('/api/chats/:user_id', chatController.api_get_messages);


module.exports = router;
const {Router} = require('express');
const multer = require('multer');

const router = Router();

const peopleController = require('../src/controllers/peopleController')
const chatController = require('../src/controllers/chatController');
const authMiddleware = require('../src/middleware/authMiddleware');

router.use('/api', authMiddleware.checkApiAuthentication);


router.get('/api/people', peopleController.api_people_get);
router.post('/api/people/:required_action/:id', peopleController.api_people_post);
router.post('/api/response-friend-request/:required_action/:id', peopleController.api_response_friendship_post);


router.get('/api/chats/:user_id', chatController.api_get_messages);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/public/messages/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = req.params.chat_id + '-' +  Date.now();
      const extension = file.mimetype.split('/')[1];
      cb(null, uniqueSuffix + '.' + extension);
    }
});
const upload = multer({ storage: storage });
router.post('/api/chats/:chat_id/messages', upload.array('images', 4), chatController.api_post_messages);

module.exports = router;
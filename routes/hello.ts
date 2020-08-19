import express from 'express';

const router :express.Router = express.Router();

import  helloController from '../controller/hello/index';

router.get('/', helloController.info.get);

export = router;

import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protectAdmin, checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protectAdmin, checkPermission('manage_users'), getUsers)
    .post(protectAdmin, checkPermission('manage_users'), createUser);

router.route('/:id')
    .put(protectAdmin, checkPermission('manage_users'), updateUser)
    .delete(protectAdmin, checkPermission('manage_users'), deleteUser);

export default router;

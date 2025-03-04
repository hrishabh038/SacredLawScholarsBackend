import express from 'express';
import { register, login, updateUser, deleteUser, getAllUsers, getUserByUsername } from './controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/:username', updateUser);
router.delete('/:username', deleteUser);
router.get('/:username', getUserByUsername);
router.get('/', getAllUsers);

// router.post('/register', authenticateToken, register);
// router.post('/login', authenticateToken, login);
// router.put('/:username', authenticateToken, updateUser);
// router.delete('/:username', authenticateToken, deleteUser);
// router.get('/:username', authenticateToken, getUserByUsername);
// router.get('/', authenticateToken, getAllUsers);

export default router;

import express from 'express';
const router = express.Router();
import { getAbout, getProjects, getBlogs } from '../controllers/dataController.js';

// Public routes to fetch data
router.get('/about', getAbout);
router.get('/projects', getProjects);
router.get('/blogs', getBlogs);

export default router;
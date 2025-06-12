import express from 'express';
const router = express.Router();
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

import {
  getAbout,
  getProjects,
  getBlogs,
  updateAbout,
  createProject,
  updateProject,
  deleteProject,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/dataController.js';

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_projects', // Folder name in Cloudinary
    format: async (req, file) => 'webp', // supports promises as well
    public_id: (req, file) => file.originalname.split('.')[0] + '-' + Date.now(),
  },
});

const upload = multer({ storage: storage });

// --- PUBLIC ROUTES ---
router.get('/about', getAbout);
router.get('/projects', getProjects);
router.get('/blogs', getBlogs);

// --- ADMIN PROTECTED ROUTES ---

// About Route
router.put('/about', protect, updateAbout);

// Project Routes
router.post('/projects', protect, upload.single('image'), createProject);
router.put('/projects/:id', protect, upload.single('image'), updateProject);
router.delete('/projects/:id', protect, deleteProject);

// Blog Routes
router.post('/blogs', protect, createBlog);
router.put('/blogs/:id', protect, updateBlog);
router.delete('/blogs/:id', protect, deleteBlog);


export default router;
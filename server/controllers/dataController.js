import About from '../models/About.js'
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';

// @desc    Get About Data
// @route   GET /api/about
// @access  Public
const getAbout = async (req, res) => {
  try {
    const aboutData = await About.findOne();
    res.json(aboutData);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Get Projects Data
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server Error');
  }
}

// @desc    Get Blogs Data
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};


export { getAbout, getProjects, getBlogs };
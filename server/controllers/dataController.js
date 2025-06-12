import About from '../models/About.js'
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import cloudinary from '../config/cloudinary.js'



// Public API Controller for Data Retrieval


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


// Admin API Controller for Data Management

// ABOUT SECTION (Update only)

// @desc    Update About Data
// @route   PUT /api/about
// @access  Private (Admin)
const updateAbout = async (req, res) => {
  try {
    const { content } = req.body;
    let about = await About.findOne();
    if (about) {
      about.content = content;
      await about.save();
    } else {
      about = await About.create({ content });
    }
    res.json(about);
  } catch (err) { res.status(500).send('Server Error') }
};


// PROJECTS SECTION (Full CRUD)

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res) => {
  try {
    const { title, description, githubUrl, liveUrl, technologies } = req.body;
    const project = await Project.create({
      title,
      description,
      technologies: technologies.split(',').map(tech => tech.trim()),
      githubUrl,
      liveUrl,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename
    });
    res.status(201).json(project);
  } catch (err) { res.status(500).send('Server Error') }
};


// @desc    Update an existing project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });

        // If a new image is uploaded, delete the old one from Cloudinary
        if (req.file) {
            await cloudinary.uploader.destroy(project.imagePublicId);
            project.imageUrl = req.file.path;
            project.imagePublicId = req.file.filename;
        }

        const { title, description, githubUrl, liveUrl, technologies } = req.body;
        project.title = title || project.title;
        project.description = description || project.description;
        project.githubUrl = githubUrl || project.githubUrl;
        project.liveUrl = liveUrl || project.liveUrl;
        project.technologies = technologies ? technologies.split(',').map(tech => tech.trim()) : project.technologies;

        await project.save();
        res.json(project);
    } catch (err) { res.status(500).send('Server Error') }
};


// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(project.imagePublicId);
        
        await project.remove();
        res.json({ message: 'Project removed' });
    } catch (err) { res.status(500).send('Server Error') }
};




// BLOGS SECTION (Full CRUD)

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private (Admin)
const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.create({ title, content });
    res.status(201).json(blog);
  } catch (err) { res.status(500).send('Server Error') }
};

const updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const blog = await Blog.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        if (!blog) return res.status(404).json({ msg: 'Blog not found' });
        res.json(blog);
    } catch (err) { res.status(500).send('Server Error') }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ msg: 'Blog not found' });
        res.json({ message: 'Blog removed' });
    } catch (err) { res.status(500).send('Server Error') }
};



export { getAbout, getProjects, getBlogs, updateAbout, createProject, updateProject, deleteProject, createBlog, updateBlog, deleteBlog };
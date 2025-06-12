import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminData,
  updateAbout,
  createProject,
  deleteProject,
  createBlog,
  updateBlog, // Make sure to import updateBlog
  deleteBlog,
} from '../services/api';

// -------------------------------------------------------------------
// Component to Manage Projects (for organization)
// -------------------------------------------------------------------
const ProjectManager = ({ projects: initialProjects }) => {
    const [projects, setProjects] = useState(initialProjects);
    // State for the create form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [technologies, setTechnologies] = useState('');
    const [image, setImage] = useState(null);

    const handleCreate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('link', link);
        formData.append('technologies', technologies);
        formData.append('image', image);
        
        try {
            const { data } = await createProject(formData);
            setProjects([data, ...projects]); // Add new project to the top
            e.target.reset(); // Clear form
            // Reset state
            setTitle('');
            setDescription('');
            setLink('');
            setTechnologies('');
            setImage(null);
        } catch (error) {
            console.error("Failed to create project", error);
            alert("Failed to create project. Check console for details.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await deleteProject(id);
            setProjects(projects.filter(p => p._id !== id));
        } catch (error) {
            console.error("Failed to delete project", error);
        }
    };
    
    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-accent">Manage Projects</h3>
            {/* Create Form */}
            <form onSubmit={handleCreate} className="mb-8 p-4 bg-gray-800 rounded">
                <h4 className="font-bold mb-4">Add New Project</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Title" onChange={e => setTitle(e.target.value)} className="block w-full bg-gray-700 p-2 rounded" required />
                    <input type="url" placeholder="Project Link" onChange={e => setLink(e.target.value)} className="block w-full bg-gray-700 p-2 rounded" required />
                </div>
                <textarea placeholder="Description" onChange={e => setDescription(e.target.value)} className="block w-full bg-gray-700 p-2 rounded my-4" required></textarea>
                <input type="text" placeholder="Technologies (comma-separated)" onChange={e => setTechnologies(e.target.value)} className="block w-full bg-gray-700 p-2 rounded mb-4" required />
                <input type="file" onChange={e => setImage(e.target.files[0])} className="block w-full text-gray-400 file:bg-gray-700 file:text-white file:border-0 file:p-2 file:rounded mb-4" required />
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Create Project</button>
            </form>
            {/* Projects List */}
            <div className="space-y-4">
                {projects.map(p => (
                    <div key={p._id} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                        <span className="font-medium">{p.title}</span>
                        <button onClick={() => handleDelete(p._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};


// -------------------------------------------------------------------
// Component to Manage Blogs (with full CRUD)
// -------------------------------------------------------------------
const BlogManager = ({ blogs: initialBlogs }) => {
    const [blogs, setBlogs] = useState(initialBlogs);
    const [formData, setFormData] = useState({ title: '', description: '', link: '' });
    const [editingBlogId, setEditingBlogId] = useState(null); // To track which blog we are editing

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // If we are editing
        if (editingBlogId) {
            try {
                const { data: updatedBlog } = await updateBlog(editingBlogId, formData);
                setBlogs(blogs.map(b => b._id === editingBlogId ? updatedBlog : b));
            } catch (error) {
                console.error("Failed to update blog", error);
                alert("Update failed. Check console.");
            }
        } else { // If we are creating
            try {
                const { data: newBlog } = await createBlog(formData);
                setBlogs([newBlog, ...blogs]);
            } catch (error) {
                console.error("Failed to create blog", error);
                alert("Create failed. Check console.");
            }
        }
        
        // Reset form and editing state
        resetForm();
    };
    
    const handleEditClick = (blog) => {
        setEditingBlogId(blog._id);
        setFormData({ title: blog.title, description: blog.description, link: blog.link });
    };
    
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) return;
        try {
            await deleteBlog(id);
            setBlogs(blogs.filter(b => b._id !== id));
        } catch (error) {
            console.error("Failed to delete blog", error);
        }
    };
    
    const resetForm = () => {
        setEditingBlogId(null);
        setFormData({ title: '', description: '', link: '' });
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-accent">Manage Blogs</h3>
            {/* Create/Edit Form */}
            <form onSubmit={handleFormSubmit} className="mb-8 p-4 bg-gray-800 rounded">
                <h4 className="font-bold mb-4">{editingBlogId ? 'Edit Blog Post' : 'Add New Blog Post'}</h4>
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} className="block w-full bg-gray-700 p-2 rounded mb-2" required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="block w-full bg-gray-700 p-2 rounded mb-2" required></textarea>
                <input type="url" name="link" placeholder="Blog Link (e.g., Medium)" value={formData.link} onChange={handleInputChange} className="block w-full bg-gray-700 p-2 rounded mb-4" required />
                <div className="flex items-center space-x-4">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                        {editingBlogId ? 'Update Post' : 'Create Post'}
                    </button>
                    {editingBlogId && (
                        <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded">
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>
            {/* Blogs List */}
            <div className="space-y-4">
                {blogs.map(b => (
                    <div key={b._id} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                        <span className="font-medium">{b.title}</span>
                        <div className="space-x-2">
                           <button onClick={() => handleEditClick(b)} className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm text-black">Edit</button>
                           <button onClick={() => handleDelete(b._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// -------------------------------------------------------------------
// Main Admin Page Component
// -------------------------------------------------------------------
const AdminPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aboutContent, setAboutContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAdminData();
        setData(response.data);
        setAboutContent(response.data.about?.content || '');
      } catch (error) {
        console.error("Failed to fetch admin data", error);
        // If token is invalid (e.g., expired), redirect to login
        if (error.response && error.response.status === 401) {
            navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleAboutUpdate = async (e) => {
    e.preventDefault();
    try {
        await updateAbout({ content: aboutContent });
        alert('About section updated!');
    } catch (error) {
        console.error('Failed to update about section', error);
        alert('Update failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white p-8">Loading Admin Panel...</div>;
  }
  
  if (!data) {
    return <div className="min-h-screen bg-black text-white p-8">Failed to load data. You may be redirected to login.</div>;
  }
  
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
        </header>
        
        <div className="bg-gray-900 p-6 rounded-lg">
            {/* About Section Manager */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-accent">Edit About Section</h3>
                <form onSubmit={handleAboutUpdate}>
                    <textarea 
                        value={aboutContent}
                        onChange={(e) => setAboutContent(e.target.value)}
                        rows="6"
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-accent"
                    ></textarea>
                    <button type="submit" className="mt-2 bg-accent text-black font-bold py-2 px-4 rounded hover:bg-cyan-300">Save About</button>
                </form>
            </div>

            <hr className="border-gray-700"/>
            
            {/* Project Manager */}
            <ProjectManager projects={data.projects || []} />
            
            <hr className="border-gray-700 mt-8"/>

            {/* Blog Manager */}
            <BlogManager blogs={data.blogs || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
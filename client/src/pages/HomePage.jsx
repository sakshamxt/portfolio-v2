import React, { useState, useEffect } from 'react';
import { getPortfolioData } from '../services/api';

const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPortfolioData();
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch portfolio data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-accent">Loading...</div>;
  }

  if (!data) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">Failed to load data.</div>;
  }

  const { about, projects, blogs } = data;

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <header className="text-center my-12">
          <img src="/profile.webp" alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-accent" />
          <h1 className="text-4xl font-bold">Your Name</h1>
          <p className="text-accent text-lg mt-2">Creative Developer & Writer</p>
          <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors mt-4 inline-block">
            LinkedIn
          </a>
        </header>

        <main>
          {/* About Section */}
          <section id="about" className="my-16">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-accent pb-2 inline-block">About Me</h2>
            <p className="text-gray-300 leading-relaxed">{about?.content}</p>
          </section>

          {/* Projects Section */}
          <section id="projects" className="my-16">
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-accent pb-2 inline-block">Selected Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects?.map(project => (
                <div key={project._id} className="border border-gray-800 p-4 rounded-lg hover:bg-gray-900 transition-colors">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover rounded-md mb-4" />
                  <h3 className="text-xl font-semibold text-accent">{project.title}</h3>
                  <p className="text-gray-400 my-2">{project.description}</p>
                  <div className="my-3">
                    {project.technologies.map(tech => <span key={tech} className="bg-gray-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tech}</span>)}
                  </div>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">View Project →</a>
                </div>
              ))}
            </div>
          </section>

          {/* Blogs Section */}
          <section id="blogs" className="my-16">
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-accent pb-2 inline-block">Blogs</h2>
            <div className="space-y-6">
              {blogs?.map(blog => (
                <div key={blog._id} className="border border-gray-800 p-4 rounded-lg hover:bg-gray-900 transition-colors">
                   <h3 className="text-xl font-semibold text-accent">{blog.title}</h3>
                   <p className="text-gray-400 my-2">{blog.description}</p>
                   <a href={blog.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Read More →</a>
                </div>
              ))}
            </div>
          </section>
        </main>
        
        {/* Footer Section */}
        <footer className="text-center text-gray-500 py-8 border-t border-gray-800 mt-16">
          <p>&copy; {new Date().getFullYear()} Your Name. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
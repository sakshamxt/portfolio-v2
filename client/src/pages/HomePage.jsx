import React, { useState, useEffect } from 'react';
import { getPortfolioData } from '../services/api';
import logo from '../assets/images/logo.jpg'
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from "react-icons/fi";
import { RxArrowTopRight } from "react-icons/rx";
import { FaReact, FaNodeJs, FaHtml5, FaCss3 } from "react-icons/fa";
import { SiExpress, SiMongodb, SiFlutter } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { TbBrandReactNative } from "react-icons/tb";
import { IoLogoFirebase } from "react-icons/io5";

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

  const skills = [
    {
      name: 'React',
      icon: <FaReact />
    }, 
    {
      name: 'Node.js',
      icon: <FaNodeJs />
    },
    {
      name: 'Express',
      icon: <SiExpress />
    },
    {
      name: 'MongoDB',
      icon: <SiMongodb />
    },
    {
      name: 'Firebase',
      icon: <IoLogoFirebase />
    },
    {
      name: 'TailwindCSS',
      icon: <RiTailwindCssFill />
    },
    {
      name: 'HTML',
      icon: <FaHtml5 />
    },
    {
      name: 'CSS',
      icon: <FaCss3 />
    },
    {
      name: 'Flutter',
      icon: <SiFlutter />
    },
    {
      name: 'React Native',
      icon: <TbBrandReactNative />
    }
  ];

  return (
    <div className="flex items-center justify-center w-full px-6 md:px-[15vw] lg:px-[28vw] xl:px-[32vw] min-h-screen">
      <div className="container mx-auto max-w-4xl">

        {/* Header Section */}
         <div className='w-full h-[20vh] flex items-center gap-4 pt-28 pb-24'>
              <div className=''>
                  <img src={logo} alt='logo' className='cursor-default w-[24vw] md:w-[12vw] lg:w-[6vw] h-auto rounded-full' />
              </div>
              <div className='flex flex-col items-start gap-1'>
                  <h1 className='text-white font-medium text-xl tracking-[0.02em] cursor-default'>Saksham Tyagi</h1>
                  <h2 className='text-text text-sm tracking-[0.02em] cursor-default'>Full Stack Web Developer, CSE Student</h2>
                  <a href='https://twitter.com/tyagiisaksham' target='blank' className='text-xs text-text bg-accent/50 px-3 py-1 rounded-xl'>x.com/tyagiisaksham</a>
              </div>
          </div>


        <main className='flex flex-col items-start'>
          {/* About Section */}
          <section id="about" className='w-full flex flex-col items-start'>
              <h1 className='text-white font-medium text-sm tracking-[0.02em] cursor-default'>About</h1>
              <h2 className='text-text text-sm mt-1 tracking-[0.01em] cursor-default'>Web Developer, Tech Enthusiast.
              </h2>
              <h2 className='text-text text-sm tracking-[0.01em] mt-3 cursor-default'>
                {about?.content}
              </h2>
          </section>

          {/* Skills Section */}
          <section id="about" className='w-full flex flex-col items-start pt-16'>
              <h1 className='text-white font-medium text-sm tracking-[0.02em] cursor-default'>Skills</h1>
              <h2 className='text-text text-sm mt-1 tracking-[0.01em] cursor-default'>The technologies I use to bring ideas to life.
              </h2>
                <div className="mt-6 flex flex-wrap items-center justify-start gap-2">
                  {skills.map((skill, index) => (
                    <div key={index} className='flex items-center justify-center px-2 py-1 rounded-lg border-[0.5px] border-white/20 hover:border-white/50 gap-x-1 transition-all duration-100'>
                      <div className='text-lg text-white'>
                        {skill.icon}
                        </div>
                      <h3 className='text-white text-xs font-medium cursor-default'>{skill.name}</h3>
                      </div>
                  ))}
              </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="w-full flex flex-col items-start pt-16">
            <h1 className='text-white font-medium text-sm tracking-[0.02em] cursor-default'>Selected Projects</h1>
            <h2 className='text-text text-sm mt-1 tracking-[0.01em] cursor-default'>Cool Projects I&apos;ve Worked On.</h2>
            <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {projects?.map(project => (
                    <div key={project._id} className='flex flex-col items-center justify-between px-1 py-1 rounded-lg border-[0.5px] border-white/20 hover:border-white/50 transition-all duration-100'>
                        <Link to={project.liveUrl} target='blank' className='h-full w-full cursor-pointer'>
                        <img src={project.imageUrl} alt='project1' className='w-full h-full rounded-md' />
                        </Link>
                        <div className='px-3 flex flex-col items-start w-full'>
                            <h1 className='text-white text-sm cursor-default'>{project.title}</h1>
                            <h2 className='text-text/80 text-xs cursor-default'>{project.description}</h2>
                            <div className="flex items-center gap-2 mt-2">
                              {project.technologies.map(tech => <span key={tech} className="text-xs text-text bg-accent/50 px-3 py-1 rounded-xl">{tech}</span>)}
                            </div>
                              <Link to={project.githubUrl} target='blank' className='text-text font-medium text-sm flex items-center gap-1 mt-4 mb-2'>
                              Github <FiArrowUpRight/>
                              </Link>
                        </div>
                    </div>
              ))}
            </div>
          </section>


          {/* Blogs Section */}
          <section id="blogs" className="w-full flex flex-col items-start pt-16">
            <h1 className='text-white font-medium text-sm tracking-[0.02em] cursor-default'>Blogs</h1>
            <h2 className='text-text text-sm mt-1 tracking-[0.01em] cursor-default'>Documenting my learnings, one post at a time.</h2>
            <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {blogs?.map(blog => (
                <div key={blog._id} className='flex flex-col items-center px-2 py-3 rounded-lg border-[0.5px] border-white/20 hover:border-white/50 transition-all duration-100'>
                  <div className='px-2 flex flex-col items-start w-full'>
                    <h1 className='text-white text-sm font-medium cursor-default'>{blog.title}</h1>
                    <h2 className='text-text/80 text-sm mt-1 cursor-default'>{blog.content}</h2>
                    <h2 className='text-text/80 mt-5 text-xs cursor-default'>
                      {new Date(blog.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </section>


          {/* Contact section */}
          <div className='w-full flex flex-col items-start pt-16 pb-20'>
                <h1 className='text-white font-medium text-sm tracking-[0.02em] cursor-default'>Contact</h1>
            <h2 className='text-text text-sm mt-1 tracking-[0.01em] cursor-default'>Let&apos;s talk about your next project.</h2>
                <div className='flex flex-col w-full mt-3 gap-3'>
                    <div className='flex items-center justify-start'>
                        <div className='w-[28vw] md:w-[10vw]'>
                            <h1 className='text-text/80 text-sm tracking-[0.01em]'>Email</h1>
                        </div>
                        <div className='flex items-start text-white'>
                            <a className=' tracking-[0.01em] text-sm border-b-[1px] border-transparent hover:border-b-[1px] hover:border-[#eeeeee] transition-all duration-100' href='mailto:sakshamt553@gmail.com'>sakshamt553@gmail.com</a>
                            <RxArrowTopRight/>
                        </div>
                    </div>
                    <div className='flex items-center justify-start'>
                        <div className='w-[28vw] md:w-[10vw]'>
                            <h1 className='text-text/80 text-sm tracking-[0.01em]'>Phone</h1>
                        </div>
                        <div className='flex items-start text-white'>
                            <a className='tracking-[0.01em] text-sm border-b-[1px] border-transparent hover:border-b-[1px] hover:border-[#eeeeee] transition-all duration-100' href='tel:+919034256888'>+91 9034256888</a>
                            <RxArrowTopRight/>
                        </div>
                    </div>
                    <div className='flex items-center justify-start'>
                        <div className='w-[28vw] md:w-[10vw]'>
                            <h1 className='text-text/80 text-sm tracking-[0.01em]'>Twitter</h1>
                        </div>
                        <div className='flex items-start text-sm text-white'>
                            <a className='tracking-[0.01em] text-sm border-b-[1px] border-transparent hover:border-b-[1px] hover:border-[#eeeeee] transition-all duration-100' href='https://twitter.com/tyagiisaksham' target='blank'>tyagiisaksham</a>
                            <RxArrowTopRight/>
                        </div>
                    </div>
                    <div className='flex items-center justify-start'>
                        <div className='w-[28vw] md:w-[10vw]'>
                            <h1 className='text-text/80 text-sm tracking-[0.01em]'>LinkedIn</h1>
                        </div>
                        <div className='flex items-start text-sm text-white'>
                            <a className='tracking-[0.01em] text-sm border-b-[1px] border-transparent hover:border-b-[1px] hover:border-[#eeeeee] transition-all duration-100' href='https://www.linkedin.com/in/tyagiisaksham/' target='blank'>tyagiisaksham</a>
                            <RxArrowTopRight/>
                        </div>
                    </div>
                    <div className='flex items-center justify-start'>
                        <div className='w-[28vw] md:w-[10vw]'>
                            <h1 className='text-text/80 text-sm tracking-[0.01em]'>Instagram</h1>
                        </div>
                        <div className='flex items-start text-white'>
                            <a className='tracking-[0.01em] text-sm border-b-[1px] border-transparent hover:border-b-[1px] hover:border-[#eeeeee] transition-all duration-100' href='https://instagram.com/tyagiisaksham' target='blank'>tyagiisaksham</a>
                            <RxArrowTopRight/>
                        </div>    
                    </div>
                </div>
            </div>


          </main>
          {/* Footer Section */}
        <div className='flex items-center justify-center pt-10 py-6'>
            <h1 className='text-text tracking-[0.01em] text-xs'>&copy; 2025 by Saksham Tyagi. All rights reserved.</h1>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
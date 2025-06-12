import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    githubUrl: {
        type: String,
        required: true,
        trim: true
    },
    liveUrl: {
        type: String,
        trim: true
    },
    technologies: [{
        type: String,
        required: true,
        trim: true
    }]
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
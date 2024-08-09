import express from 'express';
import Project from '../models/Project.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create New Project
router.post('/create', async (req, res) => {
  const { projectName, projectDescription, startDate, district, area, pinCode, measurementBook, seniorEngineerId, juniorEngineerId } = req.body;
  try {
    const project = new Project({
      projectName,
      projectDescription,
      startDate,
      district,
      area,
      pinCode,
      measurementBook,
      seniorEngineerId,
      juniorEngineerId,
      projectId: uuidv4()
    });

    await project.save();
    res.status(200).json({ msg: 'Successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// View Project
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Edit Project
router.patch('/:projectId', async (req, res) => {
  try {
    const updates = req.body;
    const project = await Project.findOneAndUpdate({ projectId: req.params.projectId }, updates, { new: true });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json({ msg: 'Successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete Project
router.delete('/:projectId', async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ projectId: req.params.projectId });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json({ msg: 'Successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Project Overview
router.get('/overview/all', async (req, res) => {
  try {
    const projects = await Project.find().select('projectId projectName district status');
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Project Stats
router.get('/stats/all', async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const finishedProjects = await Project.countDocuments({ status: 'finished' });
    const ongoingProjects = await Project.countDocuments({ status: 'ongoing' });
    const pendingProjects = await Project.countDocuments({ status: 'not started' });

    res.json({
      totalProjects,
      finishedProjects,
      ongoingProjects,
      pendingProjects
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;

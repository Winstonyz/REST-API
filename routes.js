/**
 * code reference: course material rest_api_final/routes.js
 * reference2: course material: Using SQL ORMs with Node.js/Performing CRUD Operations
 */
'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const{User, Course} = require('./models')
const { authenticateUser } = require('./middleware/auth-user');
const bcrypt = require('bcrypt');

// Construct a router instance.
const router = express.Router();

// A /api/users GET route that will return all properties and values for the currently authenticated 
//User along with a 200 HTTP status code.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    password: user.password
  });
}));

// A /api/users POST route that will create a new user, set the Location header to "/", 
//and return a 201 HTTP status code and no content.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    //code reference: rest-api_final/routes
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    await newUser.save();
    res.status(201).location('/').end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      console.error(error.name);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

//A /api/courses GET route that will return all courses including the User associated with each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll();
  res.status(200).json({courses});
}));

//A /api/courses/:id GET route that will return the corresponding course including the User associated with
// that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id)
  res.status(200).json({course});
}));

//A /api/courses POST route that will create a new course, set the Location header to the URI for the newly 
//created course, and return a 201 HTTP status code and no content.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).location(`/courses/${newCourse.id}`).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

//A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status 
//code and no content.
// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
//code reference: https://sequelize.org/master/manual/model-instances.html
//code reference2: course material S4V5_final_project
router.put('/courses/:id', authenticateUser, asyncHandler(async(req,res) => {
  try{
    const course = await Course.findByPk(req.params.id);
    if(course){
        course.title = req.body.title;
        course.description= req.body.description;
        course.estimatedTime = req.body.estimatedTime;
        course.materialsNeeded = req.body.materialsNeeded;
        course.title = req.body.title;
        await course.save();
        res.status(204).end();
    } else {
        res.status(404).json({message: "Course Not Found"});
    }}catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
}));

//A /api/courses/:id DELETE route that will delete the corresponding course a
//nd return a 204 HTTP status code and no content.
//code reference: https://sequelize.org/master/manual/model-instances.html
router.delete("/courses/:id", authenticateUser, asyncHandler(async(req,res, next) => {
  try{
    const course = await Course.findByPk(req.params.id);
    await course.destroy();
    res.status(204).end();
  }catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));


module.exports = router;
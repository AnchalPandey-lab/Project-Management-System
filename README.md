# Project-Management-System

<!-- Register User -->

[method="POST"] http://localhost:5000/api/users/register

<!-- Login User -->

[method="POST"] http://localhost:5000/api/users/login

<!-- Get all users details -->

[method="GET"] http://localhost:5000/api/users/getUsersDetails

<!-- Get user counts by designation -->

[method="GET"] http://localhost:5000/api/users/userCounts

<!-- Create New Project -->

[method="POST"] http://localhost:5000/api/projects/create

<!-- View Project -->

[method="GET"] http://localhost:5000/api/projects/<projectId>

<!-- Edit Project -->

[method="PATCH"] http://localhost:5000/api/projects/<projectId>

<!-- Delete Project -->

[method="DELETE"] http://localhost:5000/api/projects/<projectId>

<!-- Project Overview -->

[method="GET"] http://localhost:5000/api/projects/overview/all

<!-- Project Stats -->

[method="GET"] http://localhost:5000/api/projects/stats/all

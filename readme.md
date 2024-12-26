
# TableSprint

This project is an admin view for an e-commerse application.



## Tech Stack

**Client:** React, Redux, TailwindCSS, TypeScript

**Server:** Node, Express, PostgreSQL, AWS S3 (for image upload).


## Deployment

To deploy this project, make sure to install Node.js and clone the repo, cd into it, then

### To run backend

```bash
  cd backend
```
```bash
  yarn install
```
```bash
  touch .env
```
open .env and make a file like this
```bash
TWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173
PORT=3000

accessKeyId="your_AWS_accessKeyId_with_S3_access"
secretAccessKey="your_AWS_secretAccessKey"
```
```bash
  yarn dev
```
Now the backend must be running on

http://localhost:3000/

### To run frontend

```bash
  cd frontend
```
```bash
  yarn install
```
```bash
  yarn dev
```
Now the frontend must be running on

http://localhost:5173/

SignUp at http://localhost:5173/signup
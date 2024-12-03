# **Yoink - A MERN Social Media Platform**  

**Yoink** is a modern social media application built using the MERN stack. It allows users to connect, share, and communicate with real-time features. From liking posts to engaging in live chats, Yoink provides a seamless and interactive experience.  

🌐 **Deployed Site**: [https://yoink.onrender.com/](https://yoink.onrender.com/)  

---

## **Features**  

1. **User Authentication**:  
   - Secure signup and login using JWT and cookies.  
2. **Profile Management**:  
   - Update profile pictures, view suggested users and can freeze account.  
3. **Social Features**:  
   - Create posts, like posts, and reply to them.  
4. **Real-Time Chat**:  
   - One-on-one chat with other users.  
   - Send images in messages.  
   - View real-time online status of users.  
5. **Image Management**:  
   - Images are stored in **Amazon S3** and served over **CloudFront CDN** with signed URLs.  

---

## **Sample User Credentials**  

You can use the following credentials or create your own to log in and explore the app:  
- **Username**: `giri`  
- **Password**: `123456`
  
---

## **Tech Stack**  

- **Frontend**: React (Vite)  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JSON Web Tokens (JWT), Cookies  
- **Real-Time Communication**: Socket.io  
- **File Storage**: AWS S3, AWS CloudFront  

---

## **Getting Started**  

### **Prerequisites**  
- Node.js  
- npm or yarn  
- MongoDB instance  
- AWS account with S3 and CloudFront configured  

### **Project Structure**  
```
MERN_Socialmedia/
├── frontend/          # React frontend
├── backend/           # Express backend
└── README.md          # Project documentation
```

---

## **Installation**  

1. Clone the repository:  
   ```bash
   git clone https://github.com/girinath2805/MERN_Socialmedia
   cd MERN_Socialmedia
   ```

2. Install dependencies for both **frontend** and **backend**:  
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up environment variables:  

   - **Backend**: Create a `.env` file in the `backend` directory and add the following:  
     ```env
     PORT=5000
     MONGO_URI=<your_mongo_uri>
     FRONTEND_URL=http://localhost:3000
     BACKEND_URL=http://localhost:5000
     JWT_SECRET=<your_jwt_secret>
     MAILJET_API_KEY=<your_mailjet_api_key>
     MAILJET_SECRET_KEY=<your_mailjet_secret_key>
     AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
     AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
     AWS_BUCKET_NAME=<your_aws_bucket_name>
     AWS_BUCKET_REGION=<your_aws_bucket_region>
     AWS_CLOUDFRONT_DISTRIBUTION_ID=<your_cloudfront_distribution_id>
     AWS_CLOUDFRONT_DOMAIN_NAME=<your_cloudfront_domain_name>
     AWS_CLOUDFRONT_KEY_PAIR_ID=<your_cloudfront_key_pair_id>
     AWS_CLOUDFRONT_PRIVATE_KEY=<your_cloudfront_private_key>
     ```

   - **Frontend**: Create a `.env` file in the `frontend` directory and add:  
     ```env
     VITE_API_BASE_URL=http://localhost:5000
     ```

4. Generate RSA key pair for CloudFront for signed URLs:  
   ```bash
   cd backend
   openssl genrsa -out private_key.pem 2048
   openssl rsa -pubout -in private_key.pem -out public_key.pem
   ```
   - Add the `public_key.pem` in the AWS CloudFront interface.  
   - Copy and paste the `private_key.pem` in your backend environment variable.  

---

## **Running the Application**  

1. Start the backend server:  
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run at **`http://localhost:5000`**.  

2. Start the frontend server:  
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run at **`http://localhost:3000`**.  

---

## **Usage**  

- **Signup/Signin**: Create a new account or log in.  
- **Explore Suggested Users**: Get a list of users to connect with.  
- **Post Creation**: Share thoughts or media, and interact with others' posts via likes and replies.  
- **Chat**: Real-time messaging with image-sharing capability.  

---

## **AWS S3 & CloudFront Configuration**  

1. **S3 Bucket**:  
   - Create an S3 bucket and set up appropriate policies for storing images.  
2. **CloudFront**:  
   - Set up a CloudFront distribution for your S3 bucket.  
   - Add the public key to CloudFront for signed URLs.  

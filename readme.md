# 🛒 E-Commerce Web App 

A full-stack e-commerce application with role-based UI for **customers** and **sellers**.

---

## 🚀 Tech Stack

| Layer           | Technology                                     |
|----------------|------------------------------------------------|
| Frontend        | EJS (Embedded JavaScript Templates)            |
| Backend         | Node.js + Express                              |
| Database        | MongoDB Atlas                                  |
| File Storage    | Cloudinary (via `multer-storage-cloudinary`)   |
| Session/Auth    | `express-session`                              |

---

## 📁 Project Structure

ecommerce-app/
├── public/ # Static assets (CSS, JS)
├── views/ # EJS templates
│ ├── partials/ # Shared components (navbar, footer)
│ ├── customer/ # Customer-facing pages
│ ├── seller/ # Seller dashboard pages
│ └── auth/ # Login/Register pages
├── routes/ # Routes grouped by role
├── controllers/ # Business logic per role
├── models/ # Mongoose schemas (Product, User, Order)
├── utils/ # Helpers (e.g., Cloudinary setup)
├── middleware/ # Route guards (e.g. isSeller.js)
├── app.js # Main Express configuration
└── package.json # Project manifest



---

## 📦 Required Packages

Run the following to install all dependencies:


npm install express ejs mongoose dotenv express-session connect-flash method-override express-ejs-layouts multer cloudinary bcryptjs helmet express-validator
npm install passport passport-local
Package	Purpose
express	Node.js web framework
ejs	HTML templating engine
mongoose	MongoDB ODM for schema & model support
dotenv	Load environment variables from .env
express-session	Session management (e.g., login, cart)
connect-flash	Flash messages for success/error
method-override	Allows PUT & DELETE in HTML forms
express-ejs-layouts	Layout support for EJS
multer	File uploads (e.g., product images)
cloudinary	Image storage and delivery
bcryptjs	Secure password hashing
helmet	Secures HTTP headers
express-validator	Validates and sanitizes incoming data
passport	Middleware for authentication
passport-local	Strategy for local (email/password) login

🔧 Installation & Setup
Clone the repo


git clone https://github.com/ABHAYBARMAN067/ecommerce-app.git
cd ecommerce-app
Install dependencies


npm install
Create a .env file in the root directory with:


MONGO_URI=your_mongo_uri
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
Start the server

Development:
npx nodemon app.js
Production:
node app.js
Visit the app
Open your browser and go to:
http://localhost:3000

🧭 Features
👤 Customer Panel
Browse products

View product details

Add to cart & checkout

View & cancel orders

🛍️ Seller Panel
Add products with image upload

Edit/delete products

View all customer orders

🛠 Future Enhancements
Real authentication with hashed passwords

Cart persistence (session/DB)

Payment gateway integration

Middleware role-checking improvements

Admin analytics dashboard

Responsive UI with Bootstrap or Tailwind



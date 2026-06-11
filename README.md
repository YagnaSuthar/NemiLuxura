# Forever Admin Panel

A complete admin panel for managing products and orders with authentication.

## Features

- **Admin Authentication**: Secure login system for admin access
- **Product Management**: Add, view, edit, and delete products with image upload
- **Order Management**: View orders, update status, and detailed order information
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Dynamic data fetching and updates

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/forever-admin

   # JWT Secret Key
   JWT_SECRET=your-super-secret-jwt-key-here

   # Admin Credentials
   ADMIN_EMAIL=admin@forever.com
   ADMIN_PASSWORD=admin123

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Server Configuration
   PORT=4000
   ```

4. Start the backend server:
   ```bash
   npm run server
   ```

### Frontend Setup

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Login**: Use the admin credentials from your `.env` file to log in
2. **Add Products**: Navigate to the Add page to create new products with images
3. **Manage Products**: Use the List page to view, edit, or delete products
4. **Handle Orders**: The Orders page shows all orders with status management

## API Endpoints

### Authentication
- `POST /api/user/admin` - Admin login

### Products
- `POST /api/product/add` - Add new product (admin only)
- `GET /api/product/list` - Get all products
- `POST /api/product/remove` - Remove product (admin only)
- `POST /api/product/single` - Get single product details

### Orders
- `GET /api/orders/list` - Get all orders (admin only)
- `GET /api/orders/stats` - Get order statistics (admin only)
- `POST /api/orders/details` - Get order details (admin only)
- `POST /api/orders/update` - Update order status (admin only)

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Cloudinary for image storage
- JWT for authentication
- Multer for file uploads

### Frontend
- React
- React Router
- Axios for API calls
- CSS3 for styling

## Security Features

- JWT-based authentication
- Admin-only routes protection
- Secure file upload handling
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

# 📦 Supply Chain Dashboard

A full-stack dashboard application for managing inventory, orders, and supplier data in a centralized supply chain management system.

## ✨ Features

- **Centralized Management**: Manage inventory, orders, and supplier data in one place
- **Responsive Design**: Clean, modern UI built with React and Tailwind CSS
- **RESTful API**: Backend services implemented with Java Spring Boot
- **Data Visualization**: Effective data presentation and analytics
- **Scalable Architecture**: Built with clean architecture practices for maintainability

## 🛠️ Tech Stack

**Frontend:**
- React
- Tailwind CSS

**Backend:**
- Java Spring Boot
- REST APIs

**Database:**
- MySQL

## 📸 Dashboard Preview

![Dashboard Screenshot](https://github.com/Nareshkumar2583/Supply_chain_dashboard/blob/e5601e2f9f735e16a635074c7cb06db44c58220a/Image/Screenshot%202025-12-17%20135905.png)

## 🧪 Development Setup

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL
- Maven

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nareshkumar2583/Supply_chain_dashboard.git
   cd Supply_chain_dashboard
   ```

2. **Backend Setup:**
   ```bash
   # Navigate to Spring Boot directory
   cd src/
   
   # Configure database connection in application.properties
   
   # Build and run
   mvn clean install
   mvn spring-boot:run
   ```

3. **Frontend Setup:**
   ```bash
   # Navigate to React directory
   cd supply-dashboard/
   
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

4. **Database Setup:**
   - Create a MySQL database
   - Update connection details in `application.properties`
   - The application will create tables automatically on startup

## 🧭 Project Structure

```
Supply_chain_dashboard/
├── src/                    # Spring Boot backend APIs
├── supply-dashboard/       # React frontend application
├── images/                 # Screenshots and documentation images
├── pom.xml                # Maven configuration
└── README.md              # Project documentation
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Contribution Process

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes and commit:**
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request**

### Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure your code passes all existing tests

## 📌 Roadmap

### Short-term Goals
- ✅ Implement basic inventory management
- ✅ Create supplier data management
- ✅ Build order tracking system

### Upcoming Features
- 🔄 Add authentication and role-based access control
- 🔄 Connect real-time inventory data feeds
- 🔄 Improve UI error handling and validation
- 🔄 Add reporting and analytics dashboard
- 🔄 Implement notification system

### Future Enhancements
- API documentation with Swagger
- Docker containerization
- CI/CD pipeline setup
- Mobile-responsive improvements
- Advanced search and filtering

## 🌍 Open Source

This project is open source under the MIT License. Feel free to:
- Use for learning and educational purposes
- Modify and adapt for your needs
- Contribute improvements and features
- Share with others in the community

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- **Nareshkumar2583** - Project maintainer

## 🐛 Issues and Support

Found a bug or need help?
1. Check existing issues to avoid duplicates
2. Create a new issue with detailed description
3. Provide steps to reproduce if reporting a bug
4. Include screenshots for UI-related issues

---

**Built with ❤️ by the open source community**

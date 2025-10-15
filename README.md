# Real-Time Forum Client

A modern, real-time forum web application built with Go backend and vanilla JavaScript frontend, featuring WebSocket-based real-time communication for instant messaging, notifications, and live updates.

<div align="center">

![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

## 🌟 Features

- **Real-time Communication**: WebSocket integration for instant messaging and notifications
- **User Authentication**: Session-based authentication with cookie management
- **Interactive Posts**: Create posts with like/dislike functionality and comments
- **Live Notifications**: Real-time notification system
- **Typing Indicators**: See when other users are typing
- **Responsive Design**: Modern and clean user interface

## 🏗️ Architecture

### Backend (Go)
- **Server**: Lightweight HTTP server serving static files and templates
- **Port**: 8089 (configurable in `config/constants.go`)
- **Framework**: Standard Go `net/http` package
- **Template Engine**: Go's built-in `text/template`

### Frontend (JavaScript)
- **Architecture**: Vanilla JavaScript with ES6 modules
- **WebSocket Client**: Real-time bidirectional communication
- **Gateway API**: RESTful API at `localhost:8080`
- **SPA Routing**: Client-side page navigation

## 📁 Project Structure

```
clientJS/
├── main.go                 # Go server entry point
├── go.mod                  # Go module definition
├── index.html              # Main HTML template
├── Dockerfile              # Docker configuration
├── config/
│   └── constants.go        # Server configuration
├── pages/
│   ├── home.html           # Home page template
│   └── loginRegister.html  # Login/Register page template
├── static/
│   ├── style.css           # Application styles
│   ├── js/
│   │   ├── index.js        # Application entry point
│   │   ├── home.js         # Home page logic
│   │   ├── loginRegister.js # Authentication logic
│   │   ├── post.js         # Post functionality
│   │   ├── comment.js      # Comment functionality
│   │   ├── message.js      # Messaging system
│   │   ├── notif.js        # Notification handling
│   │   ├── userBlock.js    # User UI components
│   │   ├── setPage.js      # Page routing
│   │   ├── tools.js        # Utility functions
│   │   └── constants.js    # Frontend constants
│   └── images/             # SVG icons and images
└── script/
    ├── init.sh             # Initialization script
    └── push.sh             # Deployment script
```

## 🚀 Getting Started

### Prerequisites

- Go 1.20 or higher
- A backend server running on `localhost:8080` (WebSocket and API endpoint)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clientJS
   ```

2. **Run the server**
   ```bash
   go run main.go
   ```

3. **Access the application**
   ```
   http://localhost:8089
   ```

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t realtime-forum-client .
   ```

2. **Run the container**
   ```bash
   docker run -p 8089:8089 realtime-forum-client
   ```

## 🔧 Configuration

### Backend Configuration

Edit `config/constants.go` to change the server port:
```go
const Port = "8089"
```

### Frontend Configuration

Edit `static/js/constants.js` to configure API endpoints:
```javascript
export const getwayURL = "http://localhost:8080"
export const wsURL = "ws://localhost:8080/ws"
export const messageOffset = 10
```

## 🌐 WebSocket Communication

The application establishes a WebSocket connection on startup for:
- Real-time messaging
- Live notifications
- Typing indicators
- User presence updates
- Post and comment updates

## 📝 Session Management

The application uses cookie-based session management:
- Sessions are validated on page load
- User data is fetched and stored in the application state
- Automatic logout on session expiration

## 🎨 UI Components

The application includes:
- Post cards with like/dislike buttons
- Comment threads
- User blocks with avatars
- Real-time notification badges
- Messaging interface with typing indicators
- Login/Register forms

## 🔒 Security

- Session-based authentication
- Cookie validation on each request
- WebSocket connection authentication
- CORS handling (configured in backend)

## 📦 Dependencies

### Backend
- Go 1.20 (standard library only)

### Frontend
- No external dependencies (vanilla JavaScript)
- ES6 modules
- WebSocket API

## 🛠️ Development

### Adding New Pages

1. Create a new HTML template in `pages/`
2. Add corresponding JavaScript module in `static/js/`
3. Update `setPage.js` for routing

### Adding New Features

1. Create feature-specific JavaScript modules
2. Import and use in `index.js` or relevant page modules
3. Update styles in `static/style.css`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues

- Backend server must be running on `localhost:8080`
- WebSocket connection required for full functionality

---

<div align="center">

**⭐ Star this repository if you found it helpful! ⭐**

Made with ❤️ from 🇸🇳

</div>
# Design Document - PFP Generator Web Application

## Overview

The PFP Generator is a React-based web application that allows users to create unique avatars by combining trait components. The application features a beautiful gradient UI, real-time preview generation, uniqueness validation, and social sharing capabilities. It will be deployed on Render with a PostgreSQL database for tracking generated combinations.

## Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design and gradient backgrounds
- **Image Processing**: HTML5 Canvas API for real-time avatar composition
- **State Management**: React Context API for global state (selected traits, preview state)
- **Routing**: React Router for navigation between login and generator pages
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL for storing generated avatar combinations and invitation codes
- **Image Processing**: Sharp library for server-side image optimization
- **Authentication**: JWT tokens for session management
- **File Storage**: Static file serving for trait components
- **Deployment**: Render for both frontend and backend hosting

### System Flow
1. User enters daily invitation code → JWT authentication
2. User selects traits → Real-time canvas preview
3. User completes selection → Uniqueness check against database
4. User downloads avatar → Combination saved to database
5. User shares on Twitter → Pre-composed tweet with avatar

## Components and Interfaces

### Frontend Components

#### Core Components
```typescript
// Main application wrapper
<App />
  ├── <AuthProvider />
  ├── <Router />
    ├── <LoginPage />
    └── <GeneratorPage />
      ├── <Header />
      ├── <TraitSelector />
      ├── <AvatarPreview />
      └── <DescriptionPanel />
```

#### Component Specifications

**TraitSelector Component**
- Grid layout displaying trait thumbnails
- Category navigation tabs
- Rarity level indicators
- Selection state management
- Responsive design for mobile/desktop

**AvatarPreview Component**
- HTML5 Canvas for real-time rendering
- Layer composition in correct order
- Loading states during updates
- Error handling for failed renders
- Export functionality for downloads

**DescriptionPanel Component**
- Text area with character counter (500 max)
- Twitter share button
- Download button with uniqueness validation
- Success/error message display

### Backend API Endpoints

```typescript
// Authentication
POST /api/auth/login
  Body: { invitationCode: string }
  Response: { token: string, user: User }

// Trait data
GET /api/traits
  Response: { categories: TraitCategory[] }

// Uniqueness validation
POST /api/avatars/validate
  Body: { combination: TraitCombination }
  Response: { isUnique: boolean, message?: string }

// Avatar generation
POST /api/avatars/generate
  Body: { combination: TraitCombination, description: string }
  Response: { avatarId: string, imageUrl: string }

// Admin endpoints
GET /api/admin/invitation-codes
POST /api/admin/invitation-codes
```

## Data Models

### Database Schema

```sql
-- Invitation codes table
CREATE TABLE invitation_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  valid_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generated avatars table
CREATE TABLE generated_avatars (
  id SERIAL PRIMARY KEY,
  combination_hash VARCHAR(64) UNIQUE NOT NULL,
  trait_combination JSONB NOT NULL,
  description TEXT,
  user_session VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  image_url VARCHAR(500)
);

-- Trait metadata table (optional for future features)
CREATE TABLE traits (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  rarity VARCHAR(20) NOT NULL,
  file_path VARCHAR(500) NOT NULL
);
```

### TypeScript Interfaces

```typescript
interface TraitCombination {
  background: string | null;
  body: string | null;
  face: string | null;
  hair: string | null;
  bodyHoodie: string | null;
  mouth: string | null;
  eye: string | null;
  accessory: string | null;
  facemask: string | null;
}

interface TraitComponent {
  id: string;
  name: string;
  category: string;
  rarity: 'original' | 'rare' | 'super_rare' | 'extraordinary';
  imagePath: string;
  thumbnail: string;
}

interface TraitCategory {
  id: string;
  name: string;
  displayName: string;
  components: TraitComponent[];
  allowSkip: boolean;
}

interface GeneratedAvatar {
  id: string;
  combinationHash: string;
  combination: TraitCombination;
  description: string;
  imageUrl: string;
  createdAt: Date;
}
```

## Error Handling

### Frontend Error Handling
- **Network Errors**: Retry mechanism with exponential backoff
- **Canvas Errors**: Fallback to previous valid state with error message
- **Validation Errors**: Clear user feedback with suggested actions
- **Authentication Errors**: Redirect to login with appropriate message

### Backend Error Handling
- **Database Errors**: Proper error logging and graceful degradation
- **File System Errors**: Fallback mechanisms for missing assets
- **Rate Limiting**: Prevent abuse with request throttling
- **Input Validation**: Comprehensive validation with detailed error messages

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library for components
- **Integration Tests**: User flow testing with realistic data
- **Visual Tests**: Canvas rendering validation
- **Accessibility Tests**: WCAG compliance verification

### Backend Testing
- **Unit Tests**: Jest for API endpoints and business logic
- **Integration Tests**: Database operations and external services
- **Load Tests**: Performance testing for concurrent users
- **Security Tests**: Authentication and input validation

### End-to-End Testing
- **User Flows**: Complete avatar creation and sharing process
- **Cross-browser**: Chrome, Firefox, Safari compatibility
- **Mobile Testing**: Responsive design validation
- **Performance**: Core Web Vitals optimization

## Security Considerations

### Authentication Security
- JWT tokens with appropriate expiration times
- Secure HTTP-only cookies for token storage
- Rate limiting on authentication endpoints
- Input sanitization for invitation codes

### Data Protection
- HTTPS enforcement with security headers
- SQL injection prevention with parameterized queries
- XSS protection with content security policy
- File upload validation and sanitization

### Privacy Considerations
- Minimal data collection (no personal information)
- Session-based tracking only
- Clear data retention policies
- GDPR compliance for EU users

## Performance Optimization

### Frontend Performance
- **Code Splitting**: Lazy loading for non-critical components
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Service worker for offline trait loading
- **Bundle Optimization**: Tree shaking and minification

### Backend Performance
- **Database Indexing**: Optimized queries for uniqueness checks
- **Caching**: Redis for frequently accessed data
- **CDN**: Static asset delivery optimization
- **Connection Pooling**: Efficient database connections

### Canvas Optimization
- **Image Preloading**: Batch load trait images on app start
- **Render Optimization**: Debounced updates during rapid selections
- **Memory Management**: Proper canvas cleanup and garbage collection
- **Progressive Loading**: Show partial previews during composition

## Deployment Architecture

### Render Deployment Strategy
- **Frontend**: Static site deployment with automatic builds from Git
- **Backend**: Node.js service with PostgreSQL database
- **Environment Variables**: Secure configuration management
- **Domain Configuration**: Custom domain setup for 0xherstory.xyz
- **SSL/TLS**: Automatic certificate management
- **Monitoring**: Health checks and error tracking

### CI/CD Pipeline
- **Build Process**: Automated testing and building on Git push
- **Deployment**: Zero-downtime deployments with rollback capability
- **Environment Management**: Separate staging and production environments
- **Database Migrations**: Automated schema updates

## Scalability Considerations

### Horizontal Scaling
- **Stateless Backend**: Session data in database, not memory
- **Load Balancing**: Multiple backend instances behind load balancer
- **Database Scaling**: Read replicas for improved performance
- **CDN Integration**: Global asset distribution

### Monitoring and Analytics
- **Error Tracking**: Comprehensive error logging and alerting
- **Performance Monitoring**: Real-time performance metrics
- **User Analytics**: Avatar generation patterns and popular traits
- **System Health**: Database and server monitoring dashboards
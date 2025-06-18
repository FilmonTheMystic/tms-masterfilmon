# TMS Deployment Guide

## Prerequisites

1. **Domain Setup**: Point `tms.masterfilmon.com` to your hosting provider
2. **Firebase Setup**: Ensure Firebase project is configured for production
3. **Environment Variables**: Set up production environment variables

## Environment Variables

Create a `.env.production` file with production values:

```bash
# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=flytms-1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=flytms-1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=flytms-1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1080190754330
NEXT_PUBLIC_FIREBASE_APP_ID=1:1080190754330:web:03970e55e43affe44bbba3

# Email Service (Production)
RESEND_API_KEY=your_production_resend_key
FROM_EMAIL=noreply@masterfilmon.com

# Application Settings
NODE_ENV=production
NEXTAUTH_URL=https://tms.masterfilmon.com
NEXTAUTH_SECRET=your_production_secret_key
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**:
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Set custom domain to `tms.masterfilmon.com`
   - Deploy

3. **Domain Configuration**:
   - Add CNAME record: `tms.masterfilmon.com` → `cname.vercel-dns.com`
   - Add domain in Vercel project settings

### Option 2: VPS/Server Deployment

1. **Build Application**:
   ```bash
   npm run build
   ```

2. **Server Setup** (Ubuntu/Debian):
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   sudo npm install -g pm2

   # Install Nginx
   sudo apt update
   sudo apt install nginx
   ```

3. **Deploy Files**:
   ```bash
   # Upload built files to server
   scp -r .next/ package.json user@your-server:/var/www/tms/
   
   # Install dependencies on server
   cd /var/www/tms
   npm install --production
   ```

4. **PM2 Configuration**:
   ```bash
   # Create ecosystem file
   # ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'tms',
       script: 'npm',
       args: 'start',
       cwd: '/var/www/tms',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }

   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

5. **Nginx Configuration**:
   ```nginx
   # /etc/nginx/sites-available/tms.masterfilmon.com
   server {
     listen 80;
     server_name tms.masterfilmon.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

6. **SSL Certificate** (Let's Encrypt):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tms.masterfilmon.com
   ```

### Option 3: Docker Deployment

1. **Create Dockerfile**:
   ```dockerfile
   FROM node:18-alpine AS base
   
   FROM base AS deps
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci
   
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

2. **Build and Deploy**:
   ```bash
   docker build -t tms .
   docker run -p 3000:3000 --env-file .env.production tms
   ```

## Firebase Security Rules

Update Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Properties, tenants, invoices - require authentication
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Post-Deployment Checklist

- [ ] Domain DNS configured correctly
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Firebase security rules updated
- [ ] Test user registration/login
- [ ] Test dashboard functionality
- [ ] Monitor application logs
- [ ] Set up error tracking (Sentry)
- [ ] Configure backup strategy

## Testing Deployment

1. **User Registration Test**:
   - Go to `https://tms.masterfilmon.com/register`
   - Create new account
   - Check Firebase Auth and Firestore users collection
   - Verify email notifications

2. **Dashboard Access Test**:
   - Login with created account
   - Navigate through all dashboard sections
   - Test responsive design on mobile

3. **Firebase Integration Test**:
   - Go to Settings page
   - Verify user data is displayed
   - Check database connection status

## Maintenance

- Regular Firebase usage monitoring
- Database backup procedures
- Application updates and security patches
- Performance monitoring and optimization
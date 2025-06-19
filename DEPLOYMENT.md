# TMS Deployment Guide

## 🌐 Production Deployment Setup

### Domain Configuration
- **Main App**: `tms.masterfilmon.com` - Full tenant management system
- **Admin Panel**: `admintms.masterfilmon.com` - Super admin controls

## 🚀 Vercel Deployment (Recommended)

### Step 1: Vercel Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod
```

### Step 2: Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_APP_URL=https://tms.masterfilmon.com
NEXT_PUBLIC_ADMIN_URL=https://admintms.masterfilmon.com
```

### Step 3: Domain Configuration
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add both domains:
   - `tms.masterfilmon.com` (main app)
   - `admintms.masterfilmon.com` (admin panel)
3. Configure DNS records as provided by Vercel

### Step 4: DNS Records
Update your domain DNS settings:
```
Type: CNAME
Name: tms
Value: cname.vercel-dns.com

Type: CNAME  
Name: admintms
Value: cname.vercel-dns.com
```

## 📱 Mobile-Optimized Web App Features

### Responsive Design
- ✅ Touch-friendly interface (44px minimum touch targets)
- ✅ Mobile-first responsive layout
- ✅ Prevents zoom on input focus (iOS)
- ✅ Smooth scrolling and animations
- ✅ Optimized for all screen sizes

### Performance Optimizations
- ✅ Fast loading on mobile networks
- ✅ Optimized images and assets
- ✅ Efficient Firebase database queries
- ✅ Lazy loading for better performance

## 🔒 Security Configuration

### Firebase Security Rules
Make sure your Firestore rules are production-ready:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Deployment Checklist

### Pre-Deployment Testing
- [ ] Test database connectivity (`/admin/database`)
- [ ] Verify admin panel access with `filmonthemystic@gmail.com`
- [ ] Test property creation and Firebase storage
- [ ] Test tenant addition and invoice generation
- [ ] Verify theme switching works
- [ ] Test mobile responsiveness

### Deployment Steps
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Add both domains to Vercel
- [ ] Update DNS records
- [ ] Deploy to production
- [ ] Test both domains work correctly

### Post-Deployment Verification
- [ ] Access `tms.masterfilmon.com` - main app loads
- [ ] Access `admintms.masterfilmon.com` - admin panel loads
- [ ] Login with your admin email works
- [ ] Create test property, tenant, and invoice
- [ ] Mobile experience is smooth
- [ ] All admin features accessible

## 🌟 Quick Start Commands

```bash
# Clone and setup
git clone <your-repo>
cd tms-masterfilmon
npm install

# Deploy to Vercel
vercel --prod

# Configure domains in Vercel dashboard
# Add environment variables
# Update DNS records

# Test deployment
curl https://tms.masterfilmon.com
curl https://admintms.masterfilmon.com
```

## 📊 Post-Launch

### Monitoring
- Firebase usage and costs
- Vercel analytics and performance
- User feedback and bug reports

### Maintenance
- Regular database backups
- Security updates
- Feature enhancements based on user needs

---

**Your tenant management system is now ready for production deployment!** 🎉
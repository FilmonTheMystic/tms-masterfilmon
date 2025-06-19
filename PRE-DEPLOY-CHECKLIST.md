# 🚀 Pre-Deployment Checklist

## ✅ Before You Deploy

### 1. Environment Setup
- [ ] Have your Firebase project credentials ready
- [ ] Cloudflare account set up
- [ ] Domain `masterfilmon.com` added to Cloudflare
- [ ] Vercel account created

### 2. Required Information

#### Firebase Configuration (from Firebase Console)
```
API Key: ________________
Auth Domain: ________________.firebaseapp.com
Project ID: ________________
Storage Bucket: ________________.appspot.com
Messaging Sender ID: ________________
App ID: ________________
```

#### Your IP Address (for admin security)
```bash
# Get your current IP address
curl ifconfig.me
# Note this IP: ________________
```

### 3. Deployment Commands

#### Quick Deploy (Windows/WSL)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Test build
npm run build

# 3. Deploy
vercel --prod

# 4. Follow DEPLOY-STEPS.md for Cloudflare setup
```

#### Manual Deploy Steps
1. **Vercel Setup** (10 minutes)
   - Login to Vercel
   - Deploy project
   - Add environment variables
   - Add custom domains

2. **Cloudflare Setup** (15 minutes)
   - Configure DNS records
   - Set up security rules
   - Configure page rules
   - Enable SSL/TLS

3. **Testing** (10 minutes)
   - Test both domains
   - Verify admin access
   - Check mobile responsiveness

### 4. Expected Results

#### After Successful Deployment
- `tms.masterfilmon.com` - Main tenant management app
- `admintms.masterfilmon.com` - Admin panel (restricted to your IP)
- Both sites load with HTTPS
- Mobile-responsive on all devices
- Admin panel accessible only to you

### 5. What You Get (Free Tier)

#### Cloudflare Free Features
- ✅ Unlimited bandwidth
- ✅ Global CDN (200+ cities)
- ✅ DDoS protection
- ✅ SSL certificates
- ✅ DNS management
- ✅ Basic analytics
- ✅ 3 Page Rules
- ✅ Basic security rules

#### Vercel Free Features
- ✅ 100GB bandwidth/month
- ✅ Automatic deployments
- ✅ Preview deployments
- ✅ Edge functions
- ✅ Image optimization
- ✅ Analytics
- ✅ SSL certificates

### 6. Troubleshooting

#### Common Issues & Solutions
```
Issue: "Site can't be reached"
Solution: Wait 15-30 minutes for DNS propagation

Issue: "SSL certificate error"  
Solution: Check Cloudflare SSL is "Full (strict)"

Issue: "Admin panel blocked"
Solution: Verify your IP in Cloudflare security rules

Issue: "Build fails"
Solution: Run `npm run build` locally and fix errors
```

## 🎯 Ready to Deploy?

If you can check all boxes above, you're ready to deploy!

### Quick Deploy Commands
```bash
# Run these in order:
npm install -g vercel
npm run build
vercel --prod
```

Then follow `DEPLOY-STEPS.md` for complete Cloudflare configuration.

### Estimated Time
- **Total Setup Time**: 35-45 minutes
- **Vercel Deployment**: 10-15 minutes  
- **Cloudflare Configuration**: 20-25 minutes
- **Testing & Verification**: 10 minutes

### Need Help?
- 📖 Full guide: `DEPLOY-STEPS.md`
- 🔧 Cloudflare setup: `cloudflare-setup.md`
- 🌐 Domain routing: `DEPLOYMENT.md`

**Let's deploy your tenant management system! 🚀**
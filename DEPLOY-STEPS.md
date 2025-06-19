# 🚀 Cloudflare + Vercel Deployment Steps

## Phase 1: Vercel Deployment

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
# Follow the prompts to login with your email/GitHub
```

### Step 3: Deploy to Vercel
```bash
# From your project root directory
vercel

# Answer the prompts:
# ? Set up and deploy? [Y/n] y
# ? Which scope do you want to deploy to? [your-account]
# ? What's your project's name? tms-masterfilmon
# ? In which directory is your code located? ./
```

### Step 4: Configure Environment Variables in Vercel
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables:
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

### Step 5: Get Vercel URLs
After deployment, note your Vercel URLs:
- Main: `https://tms-masterfilmon.vercel.app`
- You'll use these for testing before connecting custom domains

---

## Phase 2: Cloudflare Configuration

### Step 1: Add Your Domain to Cloudflare
1. Login to Cloudflare Dashboard
2. Click "Add a Site"
3. Enter `masterfilmon.com`
4. Choose Free plan
5. Review DNS records
6. Update nameservers at your domain registrar

### Step 2: Configure DNS Records
In Cloudflare DNS settings, add these records:

#### Main App Domain
```
Type: CNAME
Name: tms
Target: cname.vercel-dns.com
Proxy status: Proxied (🟠 orange cloud)
TTL: Auto
```

#### Admin Domain
```
Type: CNAME
Name: admintms  
Target: cname.vercel-dns.com
Proxy status: Proxied (🟠 orange cloud)
TTL: Auto
```

### Step 3: Add Domains to Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `tms.masterfilmon.com`
3. Add domain: `admintms.masterfilmon.com`
4. Vercel will verify the domains

---

## Phase 3: Cloudflare Security & Optimization

### Step 1: SSL/TLS Configuration
1. Go to Cloudflare → SSL/TLS → Overview
2. Set encryption mode to: **Full (strict)**
3. Enable "Always Use HTTPS"

### Step 2: Security Rules (Free Plan)
Go to Security → WAF → Custom rules

#### Rule 1: Protect Admin Panel
```
Rule name: Block Non-Admin IPs
Field: Hostname
Operator: equals
Value: admintms.masterfilmon.com

AND

Field: IP Source Address
Operator: does not equal
Value: YOUR.IP.ADDRESS

Action: Block
```

#### Rule 2: Rate Limiting for Login
```
Rule name: Login Rate Limit
Field: URI Path
Operator: contains
Value: /api/auth

AND

Field: HTTP Method
Operator: equals
Value: POST

Action: Challenge
```

### Step 3: Page Rules (3 Free Rules)
Go to Rules → Page Rules

#### Rule 1: Cache Main App
```
URL: tms.masterfilmon.com/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 2 hours
- Browser Cache TTL: 4 hours
```

#### Rule 2: Secure Admin Panel
```
URL: admintms.masterfilmon.com/*
Settings:
- Security Level: High
- Cache Level: Bypass
- Always Use HTTPS: On
```

#### Rule 3: Redirect Admin on Main Domain
```
URL: tms.masterfilmon.com/admin*
Settings:
- Forwarding URL: 301 - Permanent Redirect
- Destination: https://admintms.masterfilmon.com/admin$1
```

---

## Phase 4: Testing & Verification

### Step 1: Test URLs
```bash
# Test main app
curl -I https://tms.masterfilmon.com

# Test admin panel
curl -I https://admintms.masterfilmon.com

# Should see 200 OK responses
```

### Step 2: Functionality Tests
1. **Main App (`tms.masterfilmon.com`)**:
   - ✅ Login works
   - ✅ Can create properties
   - ✅ Can add tenants
   - ✅ Can generate invoices
   - ✅ Mobile responsive

2. **Admin Panel (`admintms.masterfilmon.com`)**:
   - ✅ Super admin login with `filmonthemystic@gmail.com`
   - ✅ User management accessible
   - ✅ Theme switching works
   - ✅ Database tests run successfully

### Step 3: Security Verification
1. **Test admin IP blocking** (use different IP/mobile data)
2. **Verify HTTPS enforcement**
3. **Test rate limiting on login**
4. **Confirm admin redirect works**

---

## Phase 5: Monitoring Setup

### Cloudflare Analytics (Free)
- Go to Analytics & Logs → Web Analytics
- View traffic patterns, threats blocked, performance metrics

### Vercel Analytics (Free)
- Go to your project → Analytics tab
- Monitor Web Vitals, function performance, and visitor data

---

## 🎯 Final Checklist

### Deployment Verification
- [ ] Vercel deployment successful
- [ ] Environment variables configured
- [ ] Custom domains added to Vercel
- [ ] Cloudflare DNS configured
- [ ] SSL/TLS working (Full Strict)
- [ ] Security rules active
- [ ] Page rules configured

### Application Testing
- [ ] Main app loads at `tms.masterfilmon.com`
- [ ] Admin panel loads at `admintms.masterfilmon.com`
- [ ] Login functionality works
- [ ] Database operations work
- [ ] Mobile experience is smooth
- [ ] Admin security restrictions work

### Monitoring
- [ ] Cloudflare analytics enabled
- [ ] Vercel analytics enabled
- [ ] Error monitoring configured

---

## 🆘 Troubleshooting

### Common Issues
1. **"Site can't be reached"**: Check nameservers are updated
2. **SSL errors**: Wait 15-30 minutes for SSL provisioning
3. **Admin panel blocked**: Verify your IP in security rules
4. **Slow loading**: Check if cache rules are applied

### Support Resources
- **Vercel Docs**: https://vercel.com/docs
- **Cloudflare Docs**: https://developers.cloudflare.com/
- **Your deployment**: Both platforms have excellent free tier support

---

**🎉 You now have enterprise-level hosting with zero monthly costs!**
# 🚀 Deploy Your TMS System NOW!

## Your Firebase Credentials ✅
```
Project: flytms-1
API Key: AIzaSyAN8xYTKPvsNEfoRhUjuQPR0K22EMfFCWk
Auth Domain: flytms-1.firebaseapp.com
Project ID: flytms-1
Storage Bucket: flytms-1.firebasestorage.app
Messaging Sender ID: 1080190754330
App ID: 1:1080190754330:web:03970e55e43affe44bbba3
```

## Step-by-Step Deployment

### 🔧 Phase 1: Deploy to Vercel (10 minutes)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
# Use your email to login
```

#### 3. Deploy Your Project
```bash
vercel --prod
```

**When prompted:**
- Project name: `tms-masterfilmon`
- Directory: `./` (current directory)
- Settings: Use defaults

#### 4. Add Environment Variables in Vercel Dashboard
Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add these **exactly**:
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyAN8xYTKPvsNEfoRhUjuQPR0K22EMfFCWk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = flytms-1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = flytms-1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = flytms-1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 1080190754330
NEXT_PUBLIC_FIREBASE_APP_ID = 1:1080190754330:web:03970e55e43affe44bbba3
NEXT_PUBLIC_APP_URL = https://tms.masterfilmon.com
NEXT_PUBLIC_ADMIN_URL = https://admintms.masterfilmon.com
RESEND_API_KEY = re_U1ViTMZG_dn8rL7gc6j8M6b26RzXSXKxm
FROM_EMAIL = filmonthemystic@gmail.com
NODE_ENV = production
```

#### 5. Add Custom Domains in Vercel
In Vercel Dashboard → Settings → Domains, add:
- `tms.masterfilmon.com`
- `admintms.masterfilmon.com`

---

### 🌐 Phase 2: Configure Cloudflare (15 minutes)

#### 1. Login to Cloudflare
Go to: https://dash.cloudflare.com

#### 2. Add DNS Records
In Cloudflare → DNS → Records, add:

**Main App Domain:**
```
Type: CNAME
Name: tms
Target: cname.vercel-dns.com
Proxy: 🟠 Proxied (Orange Cloud ON)
```

**Admin Domain:**
```
Type: CNAME
Name: admintms
Target: cname.vercel-dns.com
Proxy: 🟠 Proxied (Orange Cloud ON)
```

#### 3. Get Your IP Address
```bash
curl ifconfig.me
# Note your IP: _______________
```

#### 4. Set Up Security Rules
Go to: Cloudflare → Security → WAF → Custom Rules

**Rule 1: Protect Admin Panel**
```
Rule Name: Block Non-Admin Access
Expression: (http.host eq "admintms.masterfilmon.com" and ip.src ne YOUR_IP_HERE)
Action: Block
```

**Rule 2: Rate Limit Login**
```
Rule Name: Login Rate Limit
Expression: (http.request.uri.path contains "/api/auth" and http.request.method eq "POST")
Action: Challenge
Rate: 5 requests per minute
```

#### 5. Configure SSL/TLS
Go to: Cloudflare → SSL/TLS → Overview
- Set to: **Full (strict)**
- Enable: **Always Use HTTPS**

#### 6. Set Up Page Rules
Go to: Cloudflare → Rules → Page Rules

**Rule 1: Cache Main App**
```
URL: tms.masterfilmon.com/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 2 hours
```

**Rule 2: Secure Admin Panel**
```
URL: admintms.masterfilmon.com/*
Settings:
- Security Level: High
- Cache Level: Bypass
- Always Use HTTPS: On
```

**Rule 3: Admin Redirect**
```
URL: tms.masterfilmon.com/admin*
Settings:
- Forwarding URL: 301 Redirect
- Destination: https://admintms.masterfilmon.com/admin$1
```

---

### 🧪 Phase 3: Test Everything (5 minutes)

#### 1. Test URLs
```bash
# Should return 200 OK
curl -I https://tms.masterfilmon.com
curl -I https://admintms.masterfilmon.com
```

#### 2. Functionality Tests
- [ ] **Main App** (`tms.masterfilmon.com`):
  - Login works
  - Can create properties
  - Can add tenants
  - Can generate invoices

- [ ] **Admin Panel** (`admintms.masterfilmon.com`):
  - Login with `filmonthemystic@gmail.com`
  - User management accessible
  - Theme switching works
  - Database tests run (`/admin/database`)

#### 3. Mobile Test
- [ ] Open both URLs on your phone
- [ ] Check responsive design
- [ ] Test touch interactions

---

## 🎯 Quick Commands Summary

```bash
# 1. Deploy to Vercel
npm install -g vercel
vercel login
vercel --prod

# 2. Get your IP for Cloudflare
curl ifconfig.me

# 3. Configure Cloudflare DNS and security
# (Follow steps above in dashboard)

# 4. Test deployment
curl -I https://tms.masterfilmon.com
curl -I https://admintms.masterfilmon.com
```

## 🆘 Troubleshooting

**Issue: Build fails**
```bash
# Fix and retry
npm run build
vercel --prod
```

**Issue: Domain not working**
- Wait 15-30 minutes for DNS propagation
- Check nameservers are pointing to Cloudflare

**Issue: Admin panel blocked**
- Verify your IP in Cloudflare security rules
- Try from different network/mobile data

**Issue: SSL errors**
- Check Cloudflare SSL is "Full (strict)"
- Wait 15 minutes for certificate provisioning

---

## 🎉 Success Checklist

When everything is working, you should have:
- [ ] `tms.masterfilmon.com` loads your main app
- [ ] `admintms.masterfilmon.com` loads admin panel
- [ ] HTTPS works on both domains
- [ ] Admin panel only accessible from your IP
- [ ] Mobile experience is smooth
- [ ] Database tests pass in admin panel

**Total deployment time: ~30 minutes**
**Monthly cost: $0 (using free tiers)**

**Ready to make your tenant management system live? Let's go! 🚀**
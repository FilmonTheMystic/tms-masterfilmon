# Cloudflare + Vercel Setup Guide

## 🌐 Hybrid Architecture Benefits

### Cloudflare (DNS + Security)
- **DNS Management** - Full control over DNS records
- **Advanced Security** - WAF, Bot Protection, Advanced DDoS
- **Analytics** - Detailed traffic and security analytics
- **Page Rules** - Custom caching and redirect rules
- **Workers** - Additional edge computing if needed

### Vercel (Hosting + Performance)
- **Next.js Optimization** - Built for Next.js applications
- **Automatic Deployments** - Git-based deployments
- **Preview Deployments** - Branch and PR previews
- **Edge Functions** - Serverless functions at the edge
- **Analytics** - Web Vitals and performance metrics

## 🚀 Setup Instructions

### Step 1: Deploy to Vercel
```bash
# Deploy to Vercel first
vercel --prod
```

### Step 2: Cloudflare DNS Configuration

#### Main App Domain: `tms.masterfilmon.com`
```
Type: CNAME
Name: tms
Value: cname.vercel-dns.com
Proxy Status: Proxied (Orange Cloud)
TTL: Auto
```

#### Admin Domain: `admintms.masterfilmon.com`
```
Type: CNAME
Name: admintms
Value: cname.vercel-dns.com
Proxy Status: Proxied (Orange Cloud)
TTL: Auto
```

### Step 3: Cloudflare Security Rules

#### Protect Admin Panel
```javascript
// Cloudflare WAF Rule for Admin Domain
(http.host eq "admintms.masterfilmon.com" and not ip.src in {your_ip_ranges})
// Action: Block or Challenge
```

#### Rate Limiting
```javascript
// Rate limiting for login endpoints
(http.request.uri.path contains "/api/auth" and http.request.method eq "POST")
// Rate: 5 requests per minute per IP
```

### Step 4: Cloudflare Page Rules

#### Cache Everything (for main app)
```
URL Pattern: tms.masterfilmon.com/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 2 hours
- Browser Cache TTL: 4 hours
```

#### Admin Panel Security
```
URL Pattern: admintms.masterfilmon.com/*
Settings:
- Security Level: High
- Cache Level: Bypass
- Always Use HTTPS: On
```

## 🔧 Configuration Files

### Update next.config.ts for Cloudflare
```typescript
const nextConfig: NextConfig = {
  // Existing config...
  
  // Cloudflare-specific optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: ['@cloudflare/workers-types'],
  },
  
  // Headers for Cloudflare
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'CF-Cache-Tag',
            value: 'tms-app'
          },
          // Existing security headers...
        ]
      }
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://admintms.masterfilmon.com/admin',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'tms.masterfilmon.com'
          }
        ]
      }
    ];
  }
};
```

### Cloudflare Worker (Optional Advanced Setup)
```javascript
// worker.js - Advanced routing and security
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Admin domain security
    if (hostname === 'admintms.masterfilmon.com') {
      // Add additional security checks
      const clientIP = request.headers.get('CF-Connecting-IP');
      
      // Block non-admin IPs (whitelist approach)
      const allowedIPs = ['your.ip.address'];
      if (!allowedIPs.includes(clientIP)) {
        return new Response('Access denied', { status: 403 });
      }
    }
    
    // Forward to Vercel
    return fetch(request);
  }
};
```

## 📊 Monitoring Setup

### Cloudflare Analytics
- **Traffic Analytics** - Visitor patterns and geographic data
- **Security Analytics** - Threat patterns and blocked requests
- **Performance Analytics** - Load times and optimization opportunities

### Vercel Analytics
- **Web Vitals** - Core performance metrics
- **Function Analytics** - Serverless function performance
- **Deployment Analytics** - Build and deployment metrics

## 🔒 Security Benefits

### Combined Security Layers
1. **Cloudflare WAF** - Blocks malicious requests before they reach Vercel
2. **Vercel Security** - Application-level security
3. **Firebase Security** - Database-level security rules
4. **Next.js Security** - Framework-level protections

### Admin Panel Protection
- **IP Whitelisting** - Cloudflare blocks unauthorized IPs
- **Rate Limiting** - Prevents brute force attacks
- **DDoS Protection** - Multi-layer protection
- **SSL/TLS** - End-to-end encryption

## 💰 Cost Considerations

### Cloudflare Free Plan Includes
- Unlimited bandwidth
- Basic DDoS protection
- DNS management
- Basic analytics
- 3 Page Rules

### Cloudflare Pro ($20/month) Adds
- Advanced analytics
- 20 Page Rules
- WAF (Web Application Firewall)
- Image optimization

### Vercel Pro ($20/month) Adds
- Advanced analytics
- Password protection
- Team collaboration
- Priority support

## 🎯 Recommended Setup

### For Maximum Security & Performance
```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Configure Cloudflare DNS (proxied)
# 3. Set up Cloudflare security rules
# 4. Configure page rules for optimization
# 5. Monitor with both platforms
```

### Benefits of This Approach
- **Best Performance** - Vercel's Next.js optimization + Cloudflare's global CDN
- **Maximum Security** - Multiple layers of protection
- **Full Control** - DNS management through Cloudflare
- **Cost Effective** - Free tiers provide excellent functionality
- **Scalability** - Both platforms scale automatically

---

**This hybrid approach gives you the best of both worlds!** 🚀

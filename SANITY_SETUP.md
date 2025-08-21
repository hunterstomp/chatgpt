# 🎯 Sanity Integration Setup

## What This Does
- **Automatic sync**: When you publish a series, it automatically uploads to Sanity
- **No manual work**: Your local system and Sanity stay in sync automatically
- **Hybrid approach**: Works with or without Sanity (graceful fallback)

## Quick Setup (5 minutes)

### 1. Create Sanity Project
```bash
# Go to https://sanity.io/manage
# Create new project: "q10ux-portfolio"
# Note your Project ID
```

### 2. Get API Token
```bash
# In Sanity Studio → API → Tokens
# Create new token with "Editor" permissions
# Copy the token
```

### 3. Add to Environment
```bash
# Add to your .env file:
SANITY_PROJECT_ID=your-project-id-here
SANITY_TOKEN=your-token-here
SANITY_DATASET=production
```

### 4. Test Connection
```bash
# Restart your server, then check:
curl http://localhost:3001/api/sanity-status
```

## How It Works

### Upload Flow
1. **You upload images** → Local processing (thumbnails, optimization)
2. **You publish series** → **Automatic** Sanity upload + local save
3. **Both systems sync** → No manual work needed

### Benefits
- ✅ **Automatic**: No manual syncing required
- ✅ **Reliable**: Local backup + cloud storage
- ✅ **Fast**: Local processing, cloud delivery
- ✅ **Scalable**: Sanity handles CDN, optimization
- ✅ **Flexible**: Works with or without Sanity

## Sanity Schema (Auto-created)

The system automatically creates these content types in Sanity:

### Case Study
```javascript
{
  _type: 'caseStudy',
  title: 'Project Title',
  slug: 'project-slug',
  description: 'Project description',
  status: 'published',
  ndaRequired: false,
  client: 'Client Name',
  technologies: ['React', 'Figma'],
  // ... other fields
}
```

### Image Series
```javascript
{
  _type: 'imageSeries',
  title: 'Series Title',
  description: 'Series description',
  caseStudy: { _ref: 'caseStudyId' },
  images: [
    {
      asset: { _ref: 'imageId' },
      caption: 'Image description',
      order: 1
    }
  ]
}
```

## Usage

### With Sanity (Recommended)
- Upload images → Automatic Sanity sync
- Publish series → Available on Sanity CDN
- Edit in Sanity Studio → Changes reflect in portfolio

### Without Sanity (Fallback)
- Everything works locally
- No Sanity dependency
- Can add Sanity later

## Next Steps

1. **Set up Sanity** (optional but recommended)
2. **Test upload** → Check automatic sync
3. **Customize schema** → Add fields as needed
4. **Deploy** → Sanity handles hosting

---

**Need help?** Check the Sanity status endpoint: `http://localhost:3001/api/sanity-status`

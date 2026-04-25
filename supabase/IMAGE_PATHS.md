# Image Path Management

Your portfolio supports **flexible image paths** — both local and external URLs can be used interchangeably.

## Supported Formats

```sql
-- Local paths (served from Vercel CDN)
images = ARRAY['/images/projects/file.png']

-- External URLs (requires next.config.js setup)
images = ARRAY['https://cdn.yoursite.com/file.png']

-- Mixed (recommended for optimization)
images = ARRAY[
  '/images/projects/thumbnail.png',      -- Fast local hero
  'https://cdn.yoursite.com/detail.png'  -- CDN gallery
]
```

## Quick Reference

### ✅ Works Out of the Box
```sql
-- Local paths (no config needed)
UPDATE projects SET images = ARRAY[
  '/images/projects/taja1.png',
  '/images/projects/taja2.png'
];
```

### ⚙️ Requires Configuration
```sql
-- External URLs (add domains to next.config.js first)
UPDATE projects SET images = ARRAY[
  'https://cdn.yoursite.com/taja1.png',
  'https://r2.cloudflare.com/taja2.png'
];
```

Add to `next.config.js`:
```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.yoursite.com' },
    { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
  ],
}
```

## Performance

| Type | First Load | Cached | Optimization |
|------|------------|--------|--------------|
| Local | ~300ms | ~50ms | ✅ WebP/AVIF |
| External | ~500ms | ~50ms | ✅ WebP/AVIF |

**Difference:** ~200ms on first load, identical when cached

## Recommended Strategy

### Current (All Local)
```sql
images = ARRAY['/images/projects/taja1.png']
```
✅ Fast, zero config  
⚠️ Grows repo size

### Hybrid (Best of Both)
```sql
images = ARRAY[
  '/images/projects/thumb.png',           -- Keep small/critical images local
  'https://cdn.site.com/large1.png',      -- Move large files to CDN
  'https://cdn.site.com/large2.png'
]
```
✅ Fast first impression  
✅ Smaller repo  
✅ Gradual migration

### Full CDN (When Needed)
```sql
images = ARRAY[
  'https://cdn.site.com/thumb.png',
  'https://cdn.site.com/large1.png'
]
```
✅ Smallest repo  
⚠️ Slightly slower first load

## Migration Examples

### Move Single Project to CDN
```sql
-- Before
UPDATE projects SET images = ARRAY[
  '/images/projects/before1.png',
  '/images/projects/before2.png'
] WHERE project = 'My Project';

-- After uploading to CDN
UPDATE projects SET images = ARRAY[
  'https://cdn.yoursite.com/after1.png',
  'https://cdn.yoursite.com/after2.png'
] WHERE project = 'My Project';
```

### Hybrid Approach (Recommended)
```sql
-- Keep thumbnail local, move gallery to CDN
UPDATE projects SET images = ARRAY[
  '/images/projects/thumbnail.png',              -- Fast!
  'https://cdn.yoursite.com/gallery1.png',       -- Large
  'https://cdn.yoursite.com/gallery2.png',       -- Large
  'https://cdn.yoursite.com/gallery3.png'        -- Large
] WHERE project = 'My Project';
```

## CDN Recommendations

1. **Cloudflare R2** — Free 10GB, zero egress, S3-compatible
2. **Vercel Blob** — Seamless integration, edge-optimized
3. **AWS S3 + CloudFront** — Enterprise (expensive)

## See Also

- `.github/plan/supabase-migration-plan.md` — Phase 5.5: Image Management Strategy
- `.github/plan/architecture.md` — Key architectural notes on image versatility

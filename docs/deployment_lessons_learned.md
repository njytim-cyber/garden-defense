# Deployment Lessons Learned - 2025-12-12

## Session Summary

Successfully deployed v3.0.0 to Netlify production after resolving CSS styling issues.

**Final Production URL:** https://defenders-of-the-realm.netlify.app/

---

## Key Lessons

### 1. **Content Security Policy (CSP) and CDN Scripts**

**Issue:** Tailwind CDN loaded on localhost but was blocked by Netlify's CSP in production.

**Root Cause:** `netlify.toml` CSP `script-src` directive only allowed `'self'` domain scripts.

**Solution:** Added CDN domain to CSP whitelist:
```toml
script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com;
```

**Takeaway:** When using CDN scripts (CSS/JS frameworks), always verify CSP headers allow the external domain. Test production builds locally first.

---

### 2. **Git LFS Push Workflow**

**Issue:** Initial `git push` failed with error: "Your push referenced at least 7 unknown Git LFS objects"

**Solution:** Always push LFS objects before commits:
```bash
git lfs push --all origin main
git push origin main
```

**Takeaway:** Create a pre-push workflow that automatically handles LFS uploads before standard Git push.

---

### 3. **Dev vs Production Parity**

**Issue:** Localhost worked perfectly, but production had completely different styling (missing CSS).

**Root Cause:** 
- Localhost: No CSP restrictions, CDN loads freely
- Production (Netlify): Strict CSP blocks unapproved external scripts

**Debugging Strategy:**
1. Check browser console for CSP violation errors
2. Compare `index.html` in dev vs production build (`dist/index.html`)
3. Review security headers in `netlify.toml`

**Takeaway:** Always test `npm run build` + `npm run preview` (production build locally) before deploying to catch parity issues.

---

### 4. **Dependency Confusion**

**Initial Mistake:** Assumed Tailwind CDN was unnecessary since `index.css` exists, removed the script tag.

**Actual Situation:** App uses both:
- Custom CSS in `index.css` for game-specific styles
- Tailwind CDN for utility classes used in React components

**Takeaway:** Before removing dependencies, grep the codebase for usage (`grep -r "className=" src/`) to verify it's truly unused.

---

## Deployment Checklist (Future Reference)

- [ ] Run `npm run build` locally and verify no errors
- [ ] Check `dist/index.html` for correct asset paths
- [ ] Test production build locally (`npm run preview`)
- [ ] Verify CSP headers allow all external resources (CDNs, APIs)
- [ ] Push LFS objects before committing (`git lfs push --all origin main`)
- [ ] Monitor Netlify build logs for warnings
- [ ] Hard refresh production site after deployment (Ctrl+Shift+R)
- [ ] Check browser console for CSP/security errors

---

## Commits Made

```
cd381e9 - fix: allow Tailwind CDN in CSP for production deployment ✅
7138f4b - fix: restore Tailwind CDN - required for app styling
e39302f - fix: remove unused Tailwind CDN script (REVERTED)
608384a - chore: update dependencies and Netlify config
9cfafc7 - feat: v3.0 improvements
```

---

## Recommended Workflow Additions

**Workflow:** `deploy-to-prod.md`
```markdown
1. Run local production build test
2. Verify CSP compatibility
3. Push LFS objects first
4. Commit and push to main
5. Monitor Netlify deployment
6. Verify production site
```

This would prevent the 30-minute CSP debugging session we just had!

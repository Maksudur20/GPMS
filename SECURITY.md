# Security Guidelines

## Authentication & Authorization

### Password Security
- Minimum 6 characters (configurable)
- Hashed with bcryptjs (10 salt rounds)
- Never log passwords
- Implement rate limiting on login attempts

### JWT Tokens
- Secret key: min 32 characters
- Expiration: 7 days
- Refresh token strategy (future enhancement)
- Store in localStorage (frontend)
- Always include Authorization header

### API Security
- CORS configured
- Input validation on all endpoints
- SQL injection prevention (Prisma ORM)
- XSS protection via sanitization

## Data Protection

### Environment Variables
- Never commit `.env` files
- Use `.env.example` templates
- Rotate secrets regularly
- Use separate keys for environments

### Database
- Encrypted connections (SSL)
- Regular backups via Supabase
- Access control per role
- Audit logging for sensitive operations

## Deployment Security

### Frontend (Vercel)
- HTTPS only
- CSP headers configured
- Secure cookie flags

### Backend (Railway/Render)
- HTTPS only
- Environment variables via platform UI
- Network isolation
- Regular security updates

## Incident Response

1. Detect unauthorized access
2. Isolate affected systems
3. Rotate compromised credentials
4. Review audit logs
5. Notify stakeholders
6. Deploy patches
7. Post-incident analysis

## Compliance

- GDPR-ready data handling
- User data export capability
- Data deletion on request
- Privacy policy required (add to frontend)

## TODO

- [ ] Implement 2FA
- [ ] Add security headers
- [ ] Setup SIEM monitoring
- [ ] Penetration testing
- [ ] Security audit

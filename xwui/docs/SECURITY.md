# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do NOT** open a public issue

Security vulnerabilities should be reported privately to protect users until a fix is available.

### 2. Report via Email

Please email security concerns to: **security@exonware.com**

Include the following information:
- **Type of vulnerability** (e.g., XSS, CSRF, injection, etc.)
- **Affected component(s)** (if known)
- **Steps to reproduce** (if applicable)
- **Potential impact** (if known)
- **Suggested fix** (if you have one)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity, typically within 30 days for critical issues

### 4. Disclosure Policy

- We will acknowledge receipt of your report
- We will keep you informed of the progress
- We will credit you in the security advisory (if desired)
- We will coordinate public disclosure after a fix is available

## Security Best Practices

When using XWUI:

1. **Keep dependencies updated** - Regularly update XWUI and its dependencies
2. **Validate user input** - Always validate and sanitize user input
3. **Use HTTPS** - Always use HTTPS in production
4. **Content Security Policy** - Implement CSP headers
5. **Regular audits** - Run security audits on your applications

## Known Security Considerations

### XSS Prevention

XWUI components sanitize user input by default, but you should:
- Never use `innerHTML` with untrusted content
- Use XWUI's built-in sanitization features
- Implement additional validation for user-generated content

### Dependency Security

We regularly audit dependencies for known vulnerabilities. If you discover a vulnerability in a dependency:
- Report it to the dependency maintainer
- Report it to us if it affects XWUI
- Check for updates regularly

## Security Updates

Security updates will be:
- Released as patch versions (e.g., 1.0.0 → 1.0.1)
- Documented in release notes
- Tagged with security labels in the repository

## Thank You

Thank you for helping keep XWUI and its users safe!

# Security Policy

Dr. Vinay's Dental Clinic takes the security of our application, patient data privacy, and infrastructural integrity extremely seriously. This document outlines our security protocols, vulnerability reporting procedures, and the specific safeguards implemented within this web application.

---

## Supported Versions

We only provide security updates and patches for the latest active release branch of the application. 

| Version | Supported          | Security Patches Active |
| ------- | ------------------ | ----------------------- |
| > 1.0.0 | :white_check_mark: | Yes                     |
| < 1.0.0 | :x:                | No                      |

Users and developers must ensure they are pulling from the `main` branch to receive the latest security updates.

---

## Reporting a Vulnerability

If you discover a potential security vulnerability within this repository, we ask that you do not disclose it publicly. Please follow our coordinated disclosure process to allow us time to validate and patch the issue.

1. **Contact Information**: Send an email detailing the vulnerability to `security@drvinaydental.com` (Note: Replace with actual security contact if available, or direct to the repository maintainer).
2. **Required Information**:
   - A detailed description of the vulnerability and its potential impact.
   - Exact steps required to reproduce the issue.
   - Any relevant logs, screenshots, or code snippets.
   - Your proposed remediation (if applicable).
3. **Response Time**: We aim to acknowledge receipt of all vulnerability reports within 48 hours and will provide a status update within 5 business days outlining our mitigation strategy.

---

## Application Security Architecture

This application is a strictly client-side frontend architecture. While it does not contain a backend database or server-side logic in this repository, we enforce rigorous security standards for all client-side operations.

### 1. Data Privacy & Local Storage
- **No Sensitive PII Storage**: The application simulates patient portal sessions but **strictly prohibits** the storage of sensitive Personally Identifiable Information (PII) or Protected Health Information (PHI) in unencrypted browser `localStorage`.
- **Anonymized Analytics**: Telemetry collected via Vercel Analytics is completely anonymized. It does not track IP addresses, user agents in a granular form, or any cross-site tracking cookies.
- **Client-Side Document Generation**: Clinical PDFs generated via `jsPDF` are strictly processed in the user's local browser memory. No clinical data is transmitted over the network or saved to an external server during document generation.

### 2. Protection Against Client-Side Attacks
- **Cross-Site Scripting (XSS)**: The application utilizes React 19, which automatically escapes all string variables embedded in JSX, mitigating standard DOM-based XSS attacks.
- **Dependency Auditing**: We utilize Vite and strict package management protocols. Developers must run `npm audit` before submitting pull requests to ensure no known vulnerable packages are introduced into the dependency tree.
- **Content Security Policy (CSP)**: When deployed via Vercel, the application is configured to utilize strict CSP headers, preventing the execution of unauthorized inline scripts and restricting external asset loading to trusted domains.

### 3. Third-Party Integrations
- All external links (e.g., WhatsApp API, Phone Dialers) utilize strict protocol handlers (`https://wa.me/` and `tel:`) and enforce `rel="noopener noreferrer"` attributes to prevent tab-napping and malicious window manipulation.
- Vercel Analytics is the sole third-party tracking script permitted on the application, ensuring strict control over supply-chain security risks.

---

## Development Security Guidelines

Contributors to this repository must adhere to the following security guidelines:

1. **Never Commit Secrets**: Do not commit API keys, environment variables, or private credentials to the repository. Use `.env.local` for local development.
2. **Strict Typing**: Maintain strict TypeScript typings (`any` is heavily discouraged) to prevent runtime type coercion vulnerabilities.
3. **Dependency Pinning**: Ensure all dependencies in `package.json` are appropriately locked using `pnpm-lock.yaml` or `package-lock.json` to prevent malicious package updates (Dependency Confusion/Typosquatting).

---

## Incident Response

In the event of a confirmed security breach or critical vulnerability exposure:
1. An emergency patch will be developed and merged to the `main` branch.
2. The Vercel production deployment will be invalidated and redeployed immediately.
3. If necessary, user sessions will be forcibly invalidated by rotating the required `localStorage` token keys in the new deployment build.
 
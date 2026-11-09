# GRYFFINDOR — production security and release gates

Mark each check only after recording verification evidence. A checked box without a test/log is not evidence.

## Launch blockers
- [ ] Authentication enforced server-side on every private route and API.
- [ ] Authorization enforced per user/workspace/resource, including task assignments.
- [ ] Supabase RLS enabled and tested for all personal/work records and storage policies; test as both users.
- [ ] Sensitive data and attachments stored privately; storage links authorized and time-limited.
- [ ] No privileged secrets in frontend bundles, Git history, analytics, browser storage, or logs.
- [ ] Validate user inputs and uploaded file types, limits, names and access.
- [ ] Use parameterized database queries and verify protection against injection and XSS.
- [ ] Prevent IDOR: tampering with a record ID cannot access the other person's private data.
- [ ] Rate-limit sensitive endpoints; guard session/login and costly operations.
- [ ] Verify CORS, CSRF strategy as applicable, secure headers, HTTPS and cookies.
- [ ] Validate webhook signatures and replay protection where webhooks are used.
- [ ] Restrict God Mode to styling and explicitly authorized publishing; imported themes cannot execute code.
- [ ] Admin operations require explicit permissions and audit logging.
- [ ] Dependency vulnerabilities reviewed; production debug interfaces disabled.
- [ ] Backup and restore tests for PostgreSQL and private file storage.
- [ ] Privacy/legal content and consent controls match the data actually collected.

## Functional quality gates
- [ ] Tasks self-assignment and cross-user assignment work, with correct visibility and notifications.
- [ ] Attendance start/end/break calculations, timezone boundaries, and audit history tested.
- [ ] Cross-device updates and reconnect recovery verified on Mac/Windows/iPhone.
- [ ] Public pages indexed appropriately; all private app pages excluded from indexing.
- [ ] Navigation, links, forms, empty states, 404, loading, errors and confirmations tested.
- [ ] Responsive tests at 320, 375/390, 768, 1024, 1440+ CSS px; no accidental overflow.
- [ ] Accessibility: keyboard, screen readers, contrast, reduced motion, touch targets.
- [ ] Lighthouse/Core Web Vitals measured on deployed build; optimize meaningful bottlenecks.
- [ ] Email SPF/DKIM/DMARC and transactional flows tested if outbound email is configured.
- [ ] Monitoring, incident response, error tracking, alerts, and rollback route documented.

## Architecture boundaries
- Personal notes, journals and files are private by default.
- Shared records are only accessible to authorized workspace members.
- Being logged in does not mean working or clocked in.
- Browser device status is limited to application sessions; native telemetry needs explicit opt-in.
- No generative AI model is required for the command center; commands must be deterministic.
- No fabricated attendance, OHLC candlesticks, social data, or system metrics.
- Payments and social platform APIs are optional, not blockers for a private personal OS.

import type { Answer } from '@/types'

export const ANSWERS_SEED: Answer[] = [
  // Question 1 — SOC 2 access reviews with automated IGA
  {
    id: 'a1', question_id: '1', vote_count: 28, is_accepted: true, user_vote: 0,
    body: `Great question — this comes up constantly with modern IGA tools.\n\nThe key insight is that SOC 2 CC6.2 doesn't prescribe the format of evidence, only that access reviews occur and are documented. Machine-readable JSON logs absolutely qualify as evidence, provided you can demonstrate:\n\n1. The review actually happened (timestamp, who triggered it)\n2. Changes were made based on the review (provisioning/deprovisioning log)\n3. Someone with authority signed off (even if digitally)\n\nPractically, what most teams do is write a simple script to convert the JSON exports into a summary CSV or PDF that shows "reviewed by / approved by / date" fields. Your auditors are used to spreadsheets not because they're required — they just haven't seen modern tooling before.\n\nI'd recommend generating a human-readable summary report from the JSON data and attaching both the raw logs and the summary as your evidence package. That satisfies both the traditional auditors and demonstrates your tooling is actually working.`,
    author_id: '2',
    author: { id: '2', username: 'PhantomReviewer19', job_title: 'GRC Analyst', industry: 'Technology / SaaS', experience: '3–5 years', certifications: ['CISM'], avatar_gradient: '135deg, #00e5a0, #0891b2', is_anonymous: true, reputation: 2310, created_at: '2025-01-01T00:00:00Z' },
    created_at: new Date(Date.now() - 1.5*3600*1000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'a2', question_id: '1', vote_count: 14, is_accepted: false, user_vote: 0,
    body: `To add to the above — we went through exactly this with a Big 4 auditor last year.\n\nThey initially pushed back on our automated evidence but accepted it once we provided a "review attestation" document signed by the IAM team lead. The document simply stated: "I attest that I reviewed the attached access report for the period [date range] and all exceptions were remediated per the attached change log."\n\nOne page, signed, dated. Combined with the automated logs it sailed through. The auditors just need something human-signed they can point to.`,
    author_id: '3',
    author: { id: '3', username: 'CovertAssessor11', job_title: 'QSA', industry: 'Retail / E-commerce', experience: '6–10 years', certifications: ['QSA', 'CISSP'], avatar_gradient: '135deg, #f97316, #ef4444', is_anonymous: true, reputation: 2100, created_at: '2025-01-01T00:00:00Z' },
    created_at: new Date(Date.now() - 1*3600*1000).toISOString(), updated_at: new Date().toISOString(),
  },

  // Question 4 — SIEM log retention ISO 27001
  {
    id: 'a3', question_id: '4', vote_count: 31, is_accepted: true, user_vote: 0,
    body: `"As required" in A.12.4.1 is deliberately vague — ISO intentionally leaves it for organizations to define based on their risk profile and legal obligations. Here's the framework I use with clients:\n\n**Tier 1 — Legal minimum:** Check every regulation that applies to you. GDPR says "no longer than necessary." PCI DSS v4.0 requires 12 months with 3 months immediately available. HIPAA requires 6 years for audit logs. Your longest applicable requirement sets your floor.\n\n**Tier 2 — Forensic usefulness:** Most security teams agree 90 days hot (immediately searchable) covers the vast majority of incident investigations. Breaches are typically discovered within 72 days on average.\n\n**Tier 3 — Cold storage:** Move to compressed cold storage (S3 Glacier, Azure Archive) after 90 days. Cost drops by 90%+ and you still meet the longer regulatory requirements.\n\nIn practice: 90 days hot, 12 months warm, 7 years cold works for most enterprise environments and satisfies auditors across frameworks.`,
    author_id: '4',
    author: { id: '4', username: 'MethodicalInspector7', job_title: 'IT Audit Manager', industry: 'Government / Public Sector', experience: '11–15 years', certifications: ['CISM', 'CRISC'], avatar_gradient: '135deg, #a78bfa, #7b61ff', is_anonymous: true, reputation: 1890, created_at: '2025-01-01T00:00:00Z' },
    created_at: new Date(Date.now() - 20*3600*1000).toISOString(), updated_at: new Date().toISOString(),
  },

  // Question 6 — Auditee refusing to provide evidence
  {
    id: 'a4', question_id: '6', vote_count: 45, is_accepted: true, user_vote: 0,
    body: `This is a scope and contractual issue, not just an audit issue. Here's the escalation path:\n\n**Step 1 — Document everything.** Every request, every refusal, every excuse. Email trail is gold. "As per our conversation on [date], I requested X and was told Y." This protects you professionally.\n\n**Step 2 — Escalate within the client.** Go above the IT team. Your engagement letter is with the organization, not the IT department. CISO or CFO level is appropriate if the team is stonewalling.\n\n**Step 3 — Invoke the engagement letter.** Specifically reference the clause obligating them to provide reasonable access and evidence. Most engagement letters have this. If yours doesn't — add it to your standard template after this engagement.\n\n**Step 4 — Qualified opinion.** If they still won't provide evidence, you issue a qualified or adverse opinion with explicit notation that evidence was requested and refused. This is actually your strongest tool — no organization wants that in their audit report.\n\nDo not let them pressure you into issuing a clean opinion without evidence. That's where your professional liability lives.`,
    author_id: '1',
    author: { id: '1', username: 'SilentAuditor34', job_title: 'Senior IT Auditor', industry: 'Financial Services / Banking', experience: '6–10 years', certifications: ['CISA'], avatar_gradient: '135deg, #7b61ff, #00d4ff', is_anonymous: true, reputation: 3420, created_at: '2025-01-01T00:00:00Z' },
    created_at: new Date(Date.now() - 68*3600*1000).toISOString(), updated_at: new Date().toISOString(),
  },

  // Question 7 — MFA fatigue ISO 27001
  {
    id: 'a5', question_id: '7', vote_count: 38, is_accepted: true, user_vote: 0,
    body: `Logging rejected pushes alone satisfies A.9.4's access restriction intent but you're right that it's incomplete from a detective control standpoint.\n\nThe way I frame this in assessments: A.9.4 covers prevention, but A.12.4 (monitoring) and A.16.1 (incident management) cover detection. MFA fatigue attacks are an incident vector — so the detection question belongs in those clauses.\n\nFor a complete control set you need:\n1. Log rejected MFA pushes (you have this)\n2. Alert on threshold breaches — e.g. 5+ rejections from same user in 10 minutes\n3. Automated response — account lockout or step-up auth after threshold\n4. Incident response procedure for MFA fatigue specifically\n\nFor your current gap: document it as a finding under A.12.4 with a remediation timeline. Most auditors will accept a compensating control (manual review of rejection logs weekly) while you implement automated alerting. Don't try to argue the logging alone is sufficient — it's not and a good assessor will push back.`,
    author_id: '2',
    author: { id: '2', username: 'PhantomReviewer19', job_title: 'GRC Analyst', industry: 'Technology / SaaS', experience: '3–5 years', certifications: ['CISM'], avatar_gradient: '135deg, #00e5a0, #0891b2', is_anonymous: true, reputation: 2310, created_at: '2025-01-01T00:00:00Z' },
    created_at: new Date(Date.now() - 90*3600*1000).toISOString(), updated_at: new Date().toISOString(),
  },

  // Question 10 — Cloud shared responsibility PaaS SOC 2
  {
    id: 'a6', question_id: '10', vote_count: 19, is_accepted: true, user_vote: 0,
    body: `Cloud Run is fully managed — GCP owns everything below your container image. Here's how we handle this for SOC 2 Type II:\n\n**For CC7.1 (system operations):** GCP's SOC 2 report is your evidence. Download it from Google Cloud Compliance Reports Manager and include it in your evidence package. Your auditor needs to see that you reviewed it and that GCP's controls cover the OS layer.\n\n**For CC6.8 (malicious code):** Your responsibility is the container image, not the underlying OS. Evidence should show: (1) base image scanning in your CI/CD pipeline, (2) no known critical CVEs in your deployed images, (3) image update policy.\n\nThe key document to get comfortable with is the GCP Shared Responsibility Matrix — it explicitly states what GCP owns vs what you own for each Cloud Run deployment model. Attach that to your workpapers with annotations showing which controls fall to GCP.\n\nOne practical tip: set up automated GCP SOC 2 report downloads in your compliance calendar — they update quarterly and you need the current one for your audit period.`,
    author_id: '3',
    author: { id: '3', username: 'CovertAssessor11', job_title: 'QSA', industry: 'Retail / E-commerce', experience: '6–10 years', certifications: ['QSA', 'CISSP'], avatar_gradient: '135deg, #f97316, #ef4444', is_anonymous: true, reputation: 2100, created_at: '2025-01-01T00:00:00Z' },
    created_at: new Date(Date.now() - 30*3600*1000).toISOString(), updated_at: new Date().toISOString(),
  },
]

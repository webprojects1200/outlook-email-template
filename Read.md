# Outlook Email Template Add-in

## Purpose
This app is an Outlook add-in and web tool for managing and inserting team-approved email templates. It allows users to quickly create, edit, and use standardized email content, improving consistency and productivity for teams.

## Features
- Create, edit, and delete email templates with subject, CC, BCC, and body fields
- Real-time updates using Supabase as the backend
- Insert template content directly into Outlook emails (when running as an add-in)
- Open a new email with prefilled subject, CC, BCC, and body using a mailto link (when running as a web app)
- Responsive, modern UI with sticky form for easy template creation
- All templates are stored in a Supabase database for team-wide access

## Supabase Table Schema
// Table: templates
// Columns:
// - id: uuid (PK)
// - title: text
// - description: text
// - content: text
// - created_at: timestamp
// - subject: text
// - cc: text
// - bcc: text
// - user_id: text
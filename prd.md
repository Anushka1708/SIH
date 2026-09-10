# PRD — Dev 1 (Naitik): Core Infrastructure, Multi-Role Auth & Profiles
### SIH26044 — Skill Mapping & Academia-Industry Collaboration Portal

---

## 1. Scope

You own everything a user needs before the "skill intelligence" features (Dev 2's scope) become useful: identity, roles, profiles, and opportunity postings.

**In scope:**
- Server boot, DB connection *(already done)*
- Multi-role authentication (`/api/auth`)
- Role-specific profile CRUD (`/api/profile`)
- Opportunity CRUD + application tracking (`/api/opportunities`)

**Out of scope (Dev 2 owns these — don't touch):**
- Skill taxonomy (`Skill` model, `/api/skills`)
- Matching/gap engine (`/api/matching`)
- Roadmap generator (`/api/roadmaps`)
- Live project pipeline (`LiveProject` model, `/api/projects`)

---

## 2. What already exists (do not recreate — extend/import these)

| File | Status | Notes |
|---|---|---|
| `server/package.json` | ✅ Done | express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv |
| `server/.env.example` | ✅ Done | `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` |
| `server/server.js` | ✅ Done | Boots Express, connects Mongo, `/api/health` route. **Route mounts go here as you build them.** |
| `server/src/config/db.js` | ✅ Done | Mongoose connection helper |
| `server/src/models/User.js` | ✅ Done | Auth identity — `name`, `email`, `password` (bcrypt-hashed pre-save), `role` enum `[student, company, faculty, institution]`, `isVerified`. Has `.comparePassword()` instance method. |
| `server/src/models/StudentProfile.js` | ✅ Done | `user` ref (1:1), `college/degree/branch/year`, `skills[]` (evidence-typed — see note below), `targetRoles[]`, `portfolio[]`, `roadmap[]`, `profileCompletion` |
| `server/src/models/CompanyProfile.js` | ✅ Done | `user` ref, `companyName`, `industry`, `website`, `location`, `about`, `companySize` |
| `server/src/models/FacultyProfile.js` | ✅ Done | `user` ref, `institution` ref, `department`, `designation`, `expertiseSkills[]` (ref Skill), `bio` |
| `server/src/models/InstitutionProfile.js` | ✅ Done | `user` ref, `institutionName`, `address`, `accreditation`, `totalStudents`, `totalFaculty` |
| `server/src/models/Opportunity.js` | ✅ Done | `postedBy` ref, `title`, `type` enum `[internship, job, project]`, `requiredSkills[]` (ref Skill + `minLevel` + `weight`), `applicants[]` embedded (`student`, `status`, `matchScore`, `matchReasoning` — **the last two are filled by Dev 2's matching engine, leave them alone**) |

**Important:** `StudentProfile.skills[]` entries look like `{skill: ObjectId ref Skill, level: 0-100, verified: bool, evidenceType: enum, verifiedBy, verifiedAt}` — NOT `{name, percent}` like the old `mockData.js`. When you build profile update endpoints, don't let students self-set `level` above what `evidenceType: "self-reported"` should allow — that's the whole point of the project's "evidence-based" differentiator.

---

## 3. Build sequence (one Antigravity prompt per item, test with Postman before moving to the next)

### Step 1 — Auth middleware (`server/src/middleware/auth.js`)
- `protect`: verifies JWT from `Authorization: Bearer <token>`, attaches `req.user = { id, role }`
- `restrictTo(...roles)`: 403 if `req.user.role` not in allowed list

### Step 2 — Auth controller + routes (`/api/auth`)
- `POST /signup` — creates `User` + the matching *Profile doc in the same request (transaction-safe if possible), returns JWT + user
- `POST /login` — verifies password, returns JWT + user
- `GET /me` — protected, returns current user

### Step 3 — Profile controller + routes (`/api/profile`)
- `GET /me` — protected, returns the right profile model based on `req.user.role`, populate any `Skill` refs
- `PUT /me` — protected, whitelist-updates own profile only
- `GET /:id` — public view of any profile

### Step 4 — Opportunity controller + routes (`/api/opportunities`)
- `POST /` — company-only, create posting
- `GET /` — public list, filterable by `type`, `location`, `skill`
- `GET /:id` — detail, populate `requiredSkills.skill`
- `PUT /:id`, `DELETE /:id` — owner-only (`postedBy === req.user.id`)
- `POST /:id/apply` — student-only, push to `applicants[]` with `status: "applied"` (do NOT set `matchScore`/`matchReasoning` — that's Dev 2's endpoint)
- `PATCH /:id/applicants/:studentId` — company-only, update applicant status

---

## 4. Integration contract with Dev 2 (so nothing breaks when you merge)

- Dev 2's matching engine reads `StudentProfile.skills[]` and `Opportunity.requiredSkills[]` — **don't rename these fields**.
- Dev 2's endpoints write `matchScore` and `matchReasoning` onto entries inside `Opportunity.applicants[]` — your `apply` endpoint should only ever set `student`, `status`, `appliedAt`; leave those two fields absent/null.
- Dev 2's live-project completion flow pushes new entries into `StudentProfile.skills[]` directly — your profile `PUT /me` endpoint should merge/update by `skill` ObjectId, not overwrite the whole array, so it doesn't wipe out project-verified skills.

---

## 5. Definition of done (for the 6 Sept jury round demo)

- [ ] Signup/login works for all 4 roles, returns a usable JWT
- [ ] Each role's profile can be fetched and edited
- [ ] Company can post an opportunity
- [ ] Student can view and apply to an opportunity
- [ ] Company can see applicants and change their status
- [ ] All endpoints tested in Postman with a saved collection (share it with the team — Sarthak needs this for QA)

---

## 6. Reference — full original architecture context

Skill Gap Engine, Explainable Match Score, "How to become eligible" roadmap, and Student→Faculty→Industry Live Project Pipeline are the project's core differentiators (Dev 2's scope) — your infrastructure work is what makes those features usable by real logged-in users across 4 distinct roles. Keep endpoints clean and predictable; Dev 2's code will call into your `User`/`StudentProfile` models directly.
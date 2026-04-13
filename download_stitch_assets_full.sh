#!/bin/bash
set -e
DEST="/Users/ayushpandey/Documents/SyllabusAI/stitch_assets"
mkdir -p "$DEST"
cd "$DEST"

echo "==> Downloading Stitch assets for SyllabusAI (Project: 15619917353899216181)"

# ── 1. Onboarding & Auth ──────────────────────────────────────────────────────
curl -L -s -o "1_Onboarding_Auth.png" \
  "https://lh3.googleusercontent.com/aida/ADBb0ujd_ilsfwutKroR4XrPyCSrcUP1PkB1gNf8LMD1tiP6ew1RgQ6DR2Mk8OllI0RYxy91QSkoDpU5naofpyQKsspHUwnMT6Vyre09NIFwHFAbRXF3pYNJKI59lu3kniN6EDxBfh1w7nLFq1Z_yzLhaF_PNAu6y1ul2t2dVl5iQPslFlt2yHNkaJPLtCC-u6DCQbq2J92r2fCYUbQCy7BFN5HszrYJRB7iR5G9oKkfj7KJgPh7r0uVSXWY32Q" &
curl -L -s -o "1_Onboarding_Auth.html" \
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzE2Zjc2ZWUzMGU2OTRhYjdiNDFhYjExODE2MGQwZTNiEgsSBxDH9KicoQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxOTkxNzM1Mzg5OTIxNjE4MQ&filename=&opi=89354086" &

# ── 2. Home Dashboard ────────────────────────────────────────────────────────
curl -L -s -o "2_Home_Dashboard.png" \
  "https://lh3.googleusercontent.com/aida/ADBb0uiRKoH0slPLfnm7EyWiqiirijPOwV5H3Az_bf3_AIQm5UppC6dLJiLygOY-l5hnq-Q6q7whfc5zjBCcvsRlLIqVmw07Jetx0_nU4svtewEeCJCo4BpWstFDSnwAaBkiAWnx2eb1B7_EJ2tgsvvCZarK0h7Y6COFsYqaMVwIfeQI-ZJTechBhpbitwrf6egu9SLsCtSUID3T6stLeqGAAxpx_nLzZYo43GG6_gYEpkRUwchFiVU8pPD1gnqN" &
curl -L -s -o "2_Home_Dashboard.html" \
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAzOWVkYTEwN2VhZTQ4YjY4ZDkzNWVlMTVjMWRjZjYwEgsSBxDH9KicoQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxOTkxNzM1Mzg5OTIxNjE4MQ&filename=&opi=89354086" &

# ── 3. Subjects & Details ────────────────────────────────────────────────────
curl -L -s -o "3_Subjects_Details.png" \
  "https://lh3.googleusercontent.com/aida/ADBb0uiB1cD8rUd33NDw8CZQ62WXhviWZMOYeB8iUQh2pwsRQOBwjwQEq0doeVFKOU21vJ0gV5OaTvY_yG0XIuOR_2kBWuWlklFrecZbmb8l3CXQzsaScfLsM-MWzjBflKswmn3fzmD8VVs99lAtgnrVHn1zy_ff6RAFClZfdV-mDmnnpps0yIQF3OIJO4tNkhdR9rdmL2FyG54dzwQIDVKef6niIheG93rFR6hX7Z9V3a5LPyWn2SKJlhW_q0QB" &
curl -L -s -o "3_Subjects_Details.html" \
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2E0NzIxNWMwNjEwNTQzNTY4ODQyZjY3OWRhNjY1ODliEgsSBxDH9KicoQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxOTkxNzM1Mzg5OTIxNjE4MQ&filename=&opi=89354086" &

# ── 4. PYQ Analysis ──────────────────────────────────────────────────────────
curl -L -s -o "4_PYQ_Analysis.png" \
  "https://lh3.googleusercontent.com/aida/ADBb0uj3hRFdBSADfZKL5ZlpC-qOx_5XktC2GaTpDWfr8gKcag3nAvMk6tt_AVbif0loBtsgLv7J7dj1mQA0tOZtPBYgt8pcLZTLwXbQIURqMg499J7w2vzq-4FXZOSJtJbeBhO62BjkP_7bFrkjrdyRisWDVyijy7e8kCw_rl7gxfelSoqJFfdhHGYE_lRMUKJNAsYP6TO63mExy3F94k0OWK__VUzrdCg-azSro-dDmukk-WX5OxMZHOpbiARc" &
curl -L -s -o "4_PYQ_Analysis.html" \
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Q2NGQ3OTBiMDRlYjQ5MjFiNDlmYWEwMzY1YWUyOGU4EgsSBxDH9KicoQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxOTkxNzM1Mzg5OTIxNjE4MQ&filename=&opi=89354086" &

# ── 5. Study Schedule ────────────────────────────────────────────────────────
curl -L -s -o "5_Study_Schedule.png" \
  "https://lh3.googleusercontent.com/aida/ADBb0ui-6J04kwtWmVfJV4NTuZS5_-v4QSsUc3_FsbkWjRvgnoLkxB4F_s36JOhlhLSPjO4QH8oUIur0hjRQLSnhLbv2JuqhewvowO_EKwUyR3P3q1qZL5k1MiKrw7BFDHmsxtV9nvN5Pra8M7BWKmyFsidVUUSOFB164O5UtwX5rKt7j5lz7XxjUarQc7nxgDNcJirB_1VlpXYvFicIwwjqGvu4O3VOFKQRw2nRzt__5tmj0D6SDXM_smbXuQOp" &
curl -L -s -o "5_Study_Schedule.html" \
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2EyZGZlMmYyNWRjZDQyOTliZTA2MGNhNTA1ZWViYjU4EgsSBxDH9KicoQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxOTkxNzM1Mzg5OTIxNjE4MQ&filename=&opi=89354086" &

# ── 6. AI Guru Chat & Quiz ───────────────────────────────────────────────────
curl -L -s -o "6_AI_Guru_Chat_Quiz.png" \
  "https://lh3.googleusercontent.com/aida/ADBb0uiR5t9XXw0rG8sikjcVIIDjjUXkbvWMVHO4U2ROLijxXqk1lFxUyDdKMq2_Tke7g_S8AgwpgU9qgx1OknQlr3HiOUxinKRDFRSXOA4VM07YYli-8lN7npkMcwQd4AdfehFX0aNK6RMM1iPMLv81-BfOqbsfivvTYwFIRMCkJY_j1lRaKyk5pmiFOAIIC4Xd4CbapghFXfCZZw_ibOQKTEsvwrcZx7yUOQGaBoSNsHKILlvqd-fqtiqxkX6-" &
curl -L -s -o "6_AI_Guru_Chat_Quiz.html" \
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Y5ZjE5NDc1ZGVjMzRhZmU5ZTc2NzI0YTIyNDc3ZTQzEgsSBxDH9KicoQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxOTkxNzM1Mzg5OTIxNjE4MQ&filename=&opi=89354086" &

# ── 7. Panic Mode Flow ───────────────────────────────────────────────────────
curl -L -s -o "7_Panic_Mode_Flow.png" \
  "https://lh3.googleusercontent.com/aida/ADBb0uh6QpNHA13V7OpgKyrgLUDz__nZS3daGSlbHr_1u5lTPfUHr-M1EkxYHe7_PIY7habcE8kglyUd311wMOJP4d5f5bR-0ICToO8TP6K5xR8nMeWdzxcvpBZoUhtBRHCH_gJU70bYvVSi0V5h2jsAtFcx9v_2Tw1YsN3-BCQJTUaGAKWm4WmXR88ZBnPxCVbgLX_6AkdhVxOCASSpUGj55UdacX17MnMVXsWIbDWluzAxmh5ur2vSEHR-TMP-" &
curl -L -s -o "7_Panic_Mode_Flow.html" \
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzA0OTM2ZmNkMWJjNjQ4ZDdiYWQ5OTljZWYxMGVmMzA0EgsSBxDH9KicoQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxOTkxNzM1Mzg5OTIxNjE4MQ&filename=&opi=89354086" &

# ── 8. Profile & Settings ────────────────────────────────────────────────────
curl -L -s -o "8_Profile_Settings.png" \
  "https://lh3.googleusercontent.com/aida/ADBb0uiOldsyP8a20Zm-9hND16iW2PpMcKsBY7jKA9CQbKZmXZdbBTbHWGw6waE3v38H09m9O2Hb27Z3AVx7FPHRYNUU_4S6eKk7ckONR1ZxuYc8VMYm5BdeijYNKfpIQCUiJ2-T_2cPB3aF9XPZmgsSrmqPkd2SXJhvbkARGX93kks2YYZVSD4JhzofOadtERqQKndtFNod3q6SqWUzXtJnwXfq1NSsm0s5E71SRLmhQ1rOkNVKObNXuwWzT_2e" &
curl -L -s -o "8_Profile_Settings.html" \
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzA4NzgxMGFiNjE0ODRhM2ZhMjcyOGYwYzJhMzc2NGM0EgsSBxDH9KicoQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYxOTkxNzM1Mzg5OTIxNjE4MQ&filename=&opi=89354086" &

# ── Admin: Student Management ────────────────────────────────────────────────
curl -L -s -o "Admin_Student_Management.png" \
  "https://lh3.googleusercontent.com/aida/ALAlHlBxSzrxMCJBCLB7K8tLcJWZpHwT_WMkqC8S5JZFjb4K-Oc9t_Q87hNLH0_5390a6d601da4a70ae6780589005b7d9" &
curl -L -s -o "Admin_Student_Management.html" \
  "https://contribution.usercontent.google.com/download?projectId=15619917353899216181&screenId=5390a6d601da4a70ae6780589005b7d9&opi=89354086" &

# ── Admin: Content Review ────────────────────────────────────────────────────
curl -L -s -o "Admin_Content_Review.png" \
  "https://lh3.googleusercontent.com/aida/ALAlHlBxSzrxMCJBCLB7K8tLcJWZpHwT_WMkqC8S5JZFjb4K-Oc9t_Q87hNLH0_b5c74270391c4dd8ae31a17399452181" &
curl -L -s -o "Admin_Content_Review.html" \
  "https://contribution.usercontent.google.com/download?projectId=15619917353899216181&screenId=b5c74270391c4dd8ae31a17399452181&opi=89354086" &

# ── Admin: Global Overview ───────────────────────────────────────────────────
curl -L -s -o "Admin_Global_Overview.png" \
  "https://lh3.googleusercontent.com/aida/ALAlHlBxSzrxMCJBCLB7K8tLcJWZpHwT_WMkqC8S5JZFjb4K-Oc9t_Q87hNLH0_33531eaf6c364243a0a5d86037a10f7c" &
curl -L -s -o "Admin_Global_Overview.html" \
  "https://contribution.usercontent.google.com/download?projectId=15619917353899216181&screenId=33531eaf6c364243a0a5d86037a10f7c&opi=89354086" &

# ── Admin: AI Settings ───────────────────────────────────────────────────────
curl -L -s -o "Admin_AI_Settings.png" \
  "https://lh3.googleusercontent.com/aida/ALAlHlBxSzrxMCJBCLB7K8tLcJWZpHwT_WMkqC8S5JZFjb4K-Oc9t_Q87hNLH0_b2bd9a831d71424aba66b2f32bd90917" &
curl -L -s -o "Admin_AI_Settings.html" \
  "https://contribution.usercontent.google.com/download?projectId=15619917353899216181&screenId=b2bd9a831d71424aba66b2f32bd90917&opi=89354086" &

wait
echo ""
echo "==> All downloads complete. Files in: $DEST"
ls -lh "$DEST"

# AI Reflection — Roamr Final Project

## 1. What did you ask the AI to do?

I built the core structure of Roamr myself and used AI to enhance it. I asked Claude to help redesign the UI into an Instagram-style layout with a three-column sidebar, add location tagging so multiple users can contribute to the same place, connect Spots and Trips together visually, and fix bugs like inconsistent image sizing and the image preview not showing in the create form. I also used Claude Code directly in my terminal to apply changes to my actual project files instead of copy-pasting.

## 2. What did it do well?

Claude Code made precise edits that matched the patterns I already had in place, reusing existing CSS classes and component structures so new features blended in naturally. The three-column sidebar layout and location tagging feature both came out clean without needing major backend changes. Showing a diff before applying anything kept me in control of what was changing.

## 3. What did it get wrong or what did you have to fix?

It occasionally ran commands from the wrong project folder since my backend and frontend are in separate directories. It also assumed certain backend routes existed when they did not, so I had to verify what was actually built before it could wire up the frontend. Some CSS class names also conflicted between pages because new styles were added without checking what already existed.

## 4. What did you learn from working with it?

Scoped and specific prompts work much better than broad ones. Reviewing the diff before accepting changes saved me from debugging several times. Most importantly, understanding my own code is what made AI useful — without knowing what I had already built, I would not have been able to direct it effectively or catch its mistakes.

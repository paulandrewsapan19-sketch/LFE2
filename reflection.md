# AI Reflection — Frontend Sign Up, Login, View All, View One

## 1. What did you ask the AI to do?

I built most of the core parts of my React frontend with some AI, including the routing structure, the authentication context, the login and register forms, and the pages that display all spots and a single spot's details. I asked Claude to help enhance more of had already built, such as redesigning the layout to look more like a social feed, fixing a bug where the image preview was not showing, and connecting my Spots and Trips features so trip cards link to their spots and spot pages show related trips.

## 2. What did it do well?

It worked well with the structure I already had in place instead of rewriting things. When I described a layout change or a bug, it matched the existing patterns in my code, such as the form styling and the card components, so the enhancements blended in with what I had already built. It also explained how features like JWT tokens and protected routes worked when I asked, which helped me understand the authentication flow I had implemented rather than just accepting code I did not understand.

## 3. What did it get wrong or what did you have to fix?

A few times Claude Code ran a command from the wrong project folder since my backend and frontend live in separate directories. It also assumed certain backend routes existed, like a delete account endpoint, when they did not, so I had to confirm what I had actually built before it could add the matching frontend feature. I also had to test image URLs myself since some links, like Google Photos share links, do not work as direct image sources.

## 4. What did you learn from working with it?

I learned that AI works best as a tool to extend and polish something I already understand, rather than something I outsource entirely. Giving clear and specific instructions about my existing code produced much better results than vague requests. Asking for a diff before changes were applied also helped me see exactly what was being modified, which kept me in control of my own project while still saving time on the parts that would have taken longer to do alone.

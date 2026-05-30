# Huhkipedia

> A chaotic, unpredictable way to explore Wikipedia.

**Live demo:** [huhkipedia.vercel.app](https://huhkipedia.vercel.app/)

---

## What is it?

Huhkipedia is a "for fun" Wikipedia explorer that never shows you what you searched for. You type a topic, it finds the closest matching article — then immediately jumps to a **random link inside that article** to kick off your journey. From there, you keep clicking and wandering.

It's less about finding information and more about seeing where you end up.

---

## Features

- **Random-first navigation** — searches resolve to a random internal link, not the article itself
- **Crazy Mode** — set a number of hops and click any link; the app will chain through that many random jumps automatically and only show you the final destination
- **Navigation Path** — every article you've visited is tracked in the sidebar so you can retrace your steps
- **Save states** — log in to save your current article and full path to revisit later
- **Bilingual** — full English and Portuguese (BR) support via i18next
- **Responsive** — works on mobile with a collapsible sidebar and bottom sheet controls

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Plain CSS |
| Auth & Database | Supabase |
| i18n | i18next / react-i18next |
| Content | Wikipedia REST API |
| Hosting | Vercel |

---

## Project Structure

```
src/
├── components/
│   ├── ArticleViewer.jsx      # Renders sanitized Wikipedia HTML
│   ├── Header.jsx             # Search bar, language toggle, auth controls
│   ├── LeftSidebar.jsx        # Table of contents for the current article
│   ├── RightSidebar.jsx       # Save, Crazy Mode, navigation path
│   ├── AuthModal.jsx          # Login / sign-up modal
│   ├── SavedArticlesModal.jsx # View and delete saved states
│   ├── HelpModal.jsx          # How-to guide
│   ├── LanguageConfirmModal.jsx
│   └── Toast.jsx              # Success / error notifications
├── App.jsx                    # Main state and logic
├── App.css                    # All styles
└── i18n.js                    # Translation strings (EN / PT)
```

---

## How Crazy Mode Works

1. Enable Crazy Mode in the right sidebar and set the number of hops (be warned that more hops will take a while to load)
2. Click any link in the current article
3. Instead of going to that article, the app picks a **random link from that page**, then a random link from the next, and so on — repeating for the number of hops you set
4. You only see the final destination, but the full chaotic route is recorded in your Navigation Path

---

## License

MIT — do whatever you want with it.

---

This is a uni project, I might update it later or maybe never touch it again

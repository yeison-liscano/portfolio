# Personal Portfolio

## Development

Enter the Nix development shell to get Node 26 and pnpm. The pnpm version is
pinned in `package.json`.

```bash
nix develop
pnpm install --frozen-lockfile
pnpm dev
```

The site and spelling dictionaries share `pnpm-lock.yaml` through a pnpm
workspace. Run the checks from the repository root:

```bash
pnpm exec astro sync
pnpm check
pnpm eslint
pnpm format:check
pnpm cy:eslint
pnpm build
pnpm exec cypress run
nix run .#portfolio-lint
```

Set `CYPRESS_INSTALL_BINARY=0` when installing if you only need the build and
lint tools. Before running end-to-end tests, download the matching browser
binary with `pnpm exec cypress install`.

TypeScript stays on 6.x because the latest `@astrojs/check` and
`typescript-eslint` releases do not support TypeScript 7 yet.

## 🚀 Project Structure

```text
/
├── About
├── Contact
├── Posts/
│   ├── python/
│   │   ├── basics
│   │   ├── great-features
│   │   └── virtual-environments
│   ├── react/
│   │   └── ...
│   └── docker/
│       └── ...
└── Contact
```

## Draft posts

Browse all draft posts at `/portfolio/blog/drafts/`, newest first. Each entry
links to its preview page.

Set `isDraft: true` in a post's frontmatter to preview it at
`/portfolio/blog/drafs/<post_slug>/`, where the slug is the content entry ID
(normally the filename without `.md` or `.mdx`). For example:
`/portfolio/blog/drafs/game-theory/`.

Drafts use the regular post layout and are accessible from the draft listing or
by direct URL. The draft listing and previews stay out of the public blog
listing, RSS feed, and sitemap, and include a `noindex` meta tag. Set
`isDraft: false` to publish at `/portfolio/blog/<post_slug>/` instead.

## Contact

[![Yeison](https://static.licdn.com/aero-v1/sc/h/5bukxbhy9xsil5mb7c2wulfbx)](https://www.linkedin.com/in/yeison-andrey-lice/)

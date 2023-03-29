# CHDK docker autobuild front end
This project provides a front end for builds generated by the [CHDK](https://chdk.fandom.com/wiki/CHDK)
[docker autobuild](https://app.assembla.com/spaces/chdk/subversion/source/HEAD/trunk/tools/docker/autobuild)

It is built on [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)

## Prequisites
Next.js requires node.js 14.6 or later installed.

## Configuration
Run

    npm install

By default, build files are assumed to be on the site hosting the page. To get build files from
a different site, you can create `.env.local` and set `NEXT_PUBLIC_SITE_ROOT` to the root of URL where
the files are hosted, like `https://builds.chdk.example`.

Note that if the autobuild json files are hosted on a different site, you probably have to configure the
server hosting them to support [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS)

You can also override the directory for files by setting `NEXT_PUBLIC_BUILDS_DIR`. The default is `/builds`
as in the autobuild docker default configuration.

## Building
To start a local development server, run

    npm run dev

Note that the dev server does less strict type checking than the static build.

To create a static build, run

    npm run build

Output goes to `out`.

## Deploying
Copy everything under `out` to the host.

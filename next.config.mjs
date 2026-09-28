/** @type {import('next').NextConfig} */
const nextConfig = {
  // Old pages that were merged or retired. Permanent so search engines update.
  async redirects() {
    const moved = {
      "/gigs": "/music",
      "/vinyls": "/music",
      "/spotify": "/music",
      "/resume": "/work",
      "/cv": "/work",
      "/now": "/",
      "/log": "/",
      "/github": "/about",
      "/stack": "/work",
      "/journey": "/about",
      "/philosophy": "/about",
      "/random": "/about",
      "/work/graicie": "/work/kakashi",
      "/work/cultureco": "/work",
      "/work/shaadi-fun": "/work",
      "/work/arenatwo": "/work",
      "/writing": "/blog",
      "/writing/twenty-nine-clients": "/blog/productization",
      "/writing/time-is-the-missing-variable": "/blog/a-machine-in-a-mans-world",
      "/writing/a-million-in-a-week": "/blog/one-click",
      "/writing/the-trapped-arm": "/blog/seeing-fast-and-slow",
      "/writing/:slug": "/blog/:slug",
    }
    return Object.entries(moved).map(([source, destination]) => ({ source, destination, permanent: true }))
  },
}

export default nextConfig

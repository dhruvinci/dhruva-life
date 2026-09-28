/** @type {import('next').NextConfig} */
const nextConfig = {
  // Old pages that were merged or retired. Permanent so search engines update.
  async redirects() {
    const moved = {
      "/gigs": "/music",
      "/vinyls": "/music",
      "/spotify": "/music",
      "/resume": "/cv",
      "/github": "/about",
      "/stack": "/cv",
      "/journey": "/about",
      "/philosophy": "/about",
      "/random": "/about",
      "/work/graicie": "/work/kakashi",
      "/work/cultureco": "/work",
      "/work/shaadi-fun": "/work",
      "/work/arenatwo": "/work",
      "/writing/twenty-nine-clients": "/writing/productization",
      "/writing/a-million-in-a-week": "/writing/one-click",
      "/writing/the-trapped-arm": "/writing/seeing-fast-and-slow",
      "/writing/time-is-the-missing-variable": "/writing/a-machine-in-a-mans-world",
    }
    return Object.entries(moved).map(([source, destination]) => ({ source, destination, permanent: true }))
  },
}

export default nextConfig

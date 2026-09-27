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
    }
    return Object.entries(moved).map(([source, destination]) => ({ source, destination, permanent: true }))
  },
}

export default nextConfig

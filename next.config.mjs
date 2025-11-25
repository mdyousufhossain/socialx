/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint: {
  //   // Disable ESLint during production build
  //   ignoreDuringBuilds: true
  // },
  async headers () {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Authorization, Content-Type'
          }
        ]
      }
    ]
  },
  images: {
    domains: ['res.cloudinary.com', 'upload.wikimedia.org']
  }
}

export default nextConfig

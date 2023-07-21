/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "leetcard.jacoblin.cool",
      },
    ],
  },
};

module.exports = nextConfig;

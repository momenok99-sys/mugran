/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // The desktop environment blocks child-process workers. Keep compilation
    // inside Node worker threads while preserving Next's parallel build path.
    workerThreads: true,
    cpus: 1,
    webpackBuildWorker: false,
  },
};

module.exports = nextConfig;

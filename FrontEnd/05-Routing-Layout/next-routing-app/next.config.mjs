/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async() => {
    return [
      {
        // contact 경로 접근 시 intro로 이동
        source: '/company/contact', // 사용자가 요청한 url
        destination: '/company/intro', // 시스템에서 리다이렉트할 url
        permanent: true // 영구 리다이렉션 여부
      }
    ];
  }
};

export default nextConfig;

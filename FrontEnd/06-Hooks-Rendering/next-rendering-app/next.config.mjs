/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 정상적인 useEffect 훅 사용을 위해서 false로 변경(두 번 렌더링 되지 않도록 한다.)
};

export default nextConfig;

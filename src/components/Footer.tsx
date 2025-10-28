export default function Footer() {
  return (
    <footer className="footer footer-center py-2 bg-base-300 text-base-content">
      <div>
        <p className="font-bold">
          InstaPluse-AI © {new Date().getFullYear()} - Explore. Compete. Grow.
        </p>
        <p className="text-sm opacity-70">
          Built with ❤️ by the InstaPluse-AI Team.
        </p>
      </div>
    </footer>
  );
}

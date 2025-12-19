const Logo = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-6 border-b border-base-300">
      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-content font-bold text-xl">
        <img src="https://res.cloudinary.com/djnxdkqyz/image/upload/v1765554093/azko_profile_oiisul.jpg" alt="azco_icon" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-base-content">Ace Hardware</h1>
        <p className="text-xs text-base-content/60">Management System</p>
      </div>
    </div>
  );
};

export default Logo;
const UserProfile = ({ name = "Kelompok 5", role = "Admin" }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="p-4 border-t border-base-300">
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-base-200">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content text-sm font-semibold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-base-content truncate">Kelompok 5</p>
          <p className="text-xs text-base-content/60 truncate">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
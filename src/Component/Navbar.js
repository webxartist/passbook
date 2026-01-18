"use client";

const Navbar = () => {
  return (
    <nav className="w-full h-14 bg-white border-b flex items-center px-4">
      {/* Left: Logo / Title */}
      <div className="text-lg font-semibold text-blue-600">PassBook</div>

      {/* Right (optional text) */}
      <div className="ml-auto text-sm text-gray-600">
        Passbook Printing System
      </div>
    </nav>
  );
};

export default Navbar;

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Kesehatan
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link 
              href="/" 
              className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/pendaftaran" 
              className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center"
            >
              + Daftar Pasien Baru
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link 
              href="/login"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-none text-sm font-medium hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

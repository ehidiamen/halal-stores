import Link from 'next/link';
const Navbar = () => (
  <nav className="bg-blue-600 p-4 text-white">
    <div className="container mx-auto flex justify-between">
      <Link href="/">Home</Link>
      <div>
        <Link href="/restaurant-test" className="mr-4">Restaurants</Link>
        <Link href="/prayer-room-test">Prayer Rooms</Link>
      </div>
    </div>
  </nav>
);
export default Navbar;

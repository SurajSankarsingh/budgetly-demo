import NavBar from '~/components/NavBar';
import Footer from '~/components/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
      <div className='min-h-screen'>{children}</div>
      <Footer />
    </div>
  );
}

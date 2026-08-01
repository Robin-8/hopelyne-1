import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'hopelyne — Student Wellness & Awareness Community',
  description: 'hopelyne is a student-led awareness and wellness group dedicated to supporting students through peer pressure, parental pressure, and mental health challenges. Join our community of hope.',
  keywords: 'student wellness, mental health, peer pressure, parental pressure, student support, hopelyne, awareness',
  openGraph: {
    title: 'hopelyne — Student Wellness & Awareness Community',
    description: 'Empowering students to navigate life\'s pressures with courage, compassion, and community.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <NavBar />
            <main style={{ paddingTop: 'var(--nav-height)' }}>
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

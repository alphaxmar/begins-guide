
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground mt-16 border-t">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">&copy; {currentYear} Begins Guide. All Rights Reserved.</p>
          <div className="flex space-x-4">
            <Link to="#" className="text-sm hover:underline">นโยบายความเป็นส่วนตัว</Link>
            <Link to="#" className="text-sm hover:underline">ข้อตกลงและเงื่อนไข</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from 'react-router-dom';
import './CategoryCard.css';

interface CategoryCardProps {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const CategoryCard = ({ title, icon, link }: CategoryCardProps) => {
  return (
    <Link to={link} className="category-card">
      <div className="category-card-icon">
        {icon}
      </div>
      <h3 className="category-card-title">{title}</h3>
    </Link>
  );
};

export default CategoryCard;


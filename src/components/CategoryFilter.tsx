
interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All' },
  { id: 'portrait', name: 'Portrait' },
  { id: 'landscape', name: 'Landscape' },
  { id: 'wedding', name: 'Wedding' },
  { id: 'street', name: 'Street' },
  { id: 'nature', name: 'Nature' }
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <section id="portfolio" className="mb-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-thin text-gray-900 mb-4">Portfolio</h2>
        <p className="text-gray-600 font-light max-w-2xl mx-auto">
          Explore my work across different photography styles and subjects
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-2 font-light tracking-wide transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-gray-900 text-white'
                : 'bg-transparent text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-900'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilter;


interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All' },
  { id: 'Portrait', name: 'Portrait' },
  { id: 'Landscape', name: 'Landscape' },
  { id: 'Street', name: 'Street' },
  { id: 'Travel', name: 'Travel' },
  { id: 'Other', name: 'Other' }
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const handleCategoryChange = (categoryId: string) => {
    console.log('Category changed to:', categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
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
  );
};

export default CategoryFilter;

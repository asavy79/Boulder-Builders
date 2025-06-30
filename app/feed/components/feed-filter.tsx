interface FeedFilterProps {
    currentFilter: string;
    onFilterChange: (filter: string) => void;
  }
  
  export default function FeedFilter({ currentFilter, onFilterChange }: FeedFilterProps) {
    return (
      <div className="flex space-x-2 mb-6">
        {['all', 'projects', 'learnings'].map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              currentFilter === filter
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
    );
  }
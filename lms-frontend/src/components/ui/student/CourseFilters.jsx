import { Search, X } from 'lucide-react';
import Input from '../../common/Input';

const CourseFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 min-w-62.5">
        <Input
          leftIcon={<Search size={18} />}
          placeholder="Search courses..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          rightIcon={
            filters.search && (
              <button 
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )
          }
        />
      </div>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
      >
        <option value="all">All Courses</option>
        <option value="not-started">Not Started</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Sort By */}
      <select
        value={filters.sortBy}
        onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
      >
        <option value="recent">Recent Activity</option>
        <option value="progress">Progress</option>
        <option value="title">Course Title</option>
        <option value="assigned">Assigned Date</option>
      </select>
    </div>
  );
};

export default CourseFilters;

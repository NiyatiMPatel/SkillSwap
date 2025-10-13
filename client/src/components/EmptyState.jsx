import { FileQuestion } from 'lucide-react';

/**
 * EmptyState Component
 * - Shows when no data is available
 * - Customizable icon, title, and message
 */
const EmptyState = ({ 
  icon: Icon = FileQuestion, 
  title = 'No items found',
  message = 'Try adjusting your filters or add new items.',
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {action}
    </div>
  );
};

export default EmptyState;

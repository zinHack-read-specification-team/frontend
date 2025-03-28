// ... existing code ...
import { Link } from 'react-router-dom';
// ... existing code ...

interface Link {
  id: string;
  code: string;
  // ... other properties
}

interface TeacherLinksProps {
  links: Link[];
}

const TeacherLinks: React.FC<TeacherLinksProps> = ({ links }) => {
  // ... existing code ...
  return (
    // ... existing code ...
    <tbody className="text-gray-600 dark:text-gray-100 text-sm">
      {links.map((link: Link) => (
        <tr key={link.id}>
          // ... existing code ...
          <td className="py-3 px-6 text-center">
            <Link to={`/teacher/stats?code=${link.code}`}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Действия
              </button>
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
    // ... existing code ...
  );
};

export default TeacherLinks;
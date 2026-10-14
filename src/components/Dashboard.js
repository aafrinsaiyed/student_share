import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5001/api/get-user'
      );

      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Get users error:', error.message);
      alert('Users load nahi ho rahe. Backend check karein.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // DELETE USER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Kya aap is user ko delete karna chahte hain?'
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5001/api/delete-user/${id}`
      );

      if (response.data.status === 1) {
        alert('User deleted successfully!');
        getUserData();
      } else {
        alert(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete error:', error.message);
      alert(
        error.response?.data?.message ||
        'User delete nahi hua. Backend check karein.'
      );
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            User List
          </h1>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/add-user')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
            >
              + Add User
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold border-b">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border-b">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border-b">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border-b">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border-b">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border-b">
                  Address
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold border-b">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id || user.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm border-b">
                      {index + 1}
                    </td>

                    {/* USER IMAGE */}
                    <td className="px-4 py-3 border-b">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || 'User'}
                          className="h-16 w-16 object-cover rounded-md border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm border-b">
                      {user.name}
                    </td>

                    <td className="px-4 py-3 text-sm border-b">
                      {user.email}
                    </td>

                    <td className="px-4 py-3 text-sm border-b">
                      {user.phone}
                    </td>

                    <td className="px-4 py-3 text-sm border-b">
                      {user.address}
                    </td>

                    <td className="px-4 py-3 text-sm border-b">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/edit-user/${user._id}`)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
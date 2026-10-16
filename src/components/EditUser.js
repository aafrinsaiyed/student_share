import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: id,
    name: '',
    email: '',
    phone: '',
    mobile: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Get user data
  useEffect(() => {
    const getUserData = async () => {
      try {
        console.log("Edit User ID:", id);
  
        const response = await axios.get(
          `https://mern-backenddivb-2.onrender.com/api/user/${id}`
        );
  
        console.log("API Response:", response.data);
  
        if (response.data.data) {
          setFormData({
            id: response.data.data.id || id,
            name: response.data.data.name || '',
            email: response.data.data.email || '',
            phone: response.data.data.phone || '',
            mobile: response.data.data.mobile || '',
          });
        }
      } catch (error) {
        console.log("GET USER ERROR:", error);
      } finally {
        setLoading(false);
      }
    };
  
    getUserData();
  }, [id]);
  

  // Validation
  const validate = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{6,15}$/;
    const mobileRegex = /^[6-9][0-9]{9}$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone must be 6 to 15 digits';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10 digit mobile number';
    }

    return newErrors;
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: '',
    }));
  };

  // Update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await axios.put(
        `https://mern-backenddivb-2.onrender.com/api/update-user/${id}`,
        formData
      );

      console.log('Update response:', response.data);

      if (response.data.data) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Error updating user:', error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  // Cancel
  const handleCancel = () => {
    navigate('/dashboard');
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit User
          </h2>

          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; Back to list
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="edit-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>

            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass('name')}
              placeholder="Enter full name"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="edit-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>

            <input
              type="email"
              id="edit-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass('email')}
              placeholder="you@example.com"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label
              htmlFor="edit-phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>

            <input
              type="text"
              id="edit-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass('phone')}
              placeholder="Enter phone number"
            />

            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div className="mb-6">
            <label
              htmlFor="edit-mobile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mobile Number
            </label>

            <input
              type="text"
              id="edit-mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={inputClass('mobile')}
              placeholder="Enter 10 digit mobile number"
            />

            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobile}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            >
              Update User
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;

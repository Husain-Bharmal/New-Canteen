import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Users.css';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all'); // Default to showing all users

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/getusers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const filterUsersByRole = (role) => {
    // If 'all' is selected, show all users
    if (role === 'all') {
      return users;
    }

    // Filter users by role
    return users.filter((user) => user.role === role);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  return (
    <div>
      <h2>User List</h2>
      <div className='btns'>
        <button
          onClick={() => handleRoleChange('all')}
          className={`roles_btn ${selectedRole === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => handleRoleChange('student')}
          className={`roles_btn ${selectedRole === 'student' ? 'active' : ''}`}
        >
          Students
        </button>
        <button
          onClick={() => handleRoleChange('teacher')}
          className={`roles_btn ${selectedRole === 'teacher' ? 'active' : ''}`}
        >
          Teachers
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th className='column'>Name</th>
            <th className='column'>Branch</th>
            <th className='column'>Email</th>
          </tr>
        </thead>
        <tbody>
          {filterUsersByRole(selectedRole).map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.branch}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;

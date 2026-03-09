import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import { FaUsers, FaBan, FaCheckCircle, FaUserShield, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, bannedUsers: 0 });
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
      
      const banned = data.filter(u => u.isBanned).length;
      setStats({
        totalUsers: data.length,
        activeUsers: data.length - banned,
        bannedUsers: banned
      });
    } catch (err) {
      toast.error("Failed to fetch fleet data");
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (userId, currentState) => {
    try {
      await api.patch(`/admin/users/${userId}/ban`, { isBanned: !currentState });
      toast.success(currentState ? "User rehabilitated" : "User banished to the void");
      fetchUsers();
    } catch (err) {
      toast.error("Protocol failure");
    }
  };

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1 className="heading-lg text-gradient"><FaUserShield className="title-icon" /> Admin Control Center</h1>
        <p className="subtitle">High-level oversight of the Cinematic Universe.</p>
      </div>

      <div className="admin-stats-grid">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Total Civilians</span>
            <span className="stat-value">{stats.totalUsers}</span>
          </div>
        </div>
        <div className="stat-card active">
          <FaChartLine className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Active Explorers</span>
            <span className="stat-value">{stats.activeUsers}</span>
          </div>
        </div>
        <div className="stat-card banned">
          <FaBan className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Banished Entities</span>
            <span className="stat-value">{stats.bannedUsers}</span>
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User Entity</th>
              <th>Email Signature</th>
              <th>Rank</th>
              <th>Status</th>
              <th>Command</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="table-status">Scanning sector...</td></tr>
            ) : users.map(user => (
              <tr key={user._id}>
                <td className="user-cell">
                  <div className="user-avatar">{user.name.charAt(0)}</div>
                  <span>{user.name} {user._id === currentUser._id && "(You)"}</span>
                </td>
                <td>{user.email}</td>
                <td className="role-cell">
                  <span className={`badge ${user.role}`}>{user.role}</span>
                </td>
                <td>
                  <span className={`status-dot ${user.isBanned ? 'banned' : 'active'}`}></span>
                  {user.isBanned ? 'Banished' : 'Active'}
                </td>
                <td>
                  {user._id !== currentUser._id && (
                    <button 
                      className={`admin-action-btn ${user.isBanned ? 'revive' : 'ban'}`}
                      onClick={() => handleBanToggle(user._id, user.isBanned)}
                    >
                      {user.isBanned ? <FaCheckCircle /> : <FaBan />}
                      {user.isBanned ? 'Revive' : 'Banish'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

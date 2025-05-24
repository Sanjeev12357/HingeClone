import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addConnection } from '../utils/connectionSlice';
import { User, Calendar, MessageCircle, Users, Clock, Mail } from 'lucide-react';

const Connections = () => {
  const connections = useSelector(store => store.connection);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchConnection = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + '/user/connections', { withCredentials: true });
      console.log(res.data.data);
      dispatch(addConnection(res.data.data));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching connections:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getConnectionPartner = (connection) => {
    // Return the other user in the connection (not the current user)
    return connection.fromUserId || connection.toUserId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your connections...</p>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          
          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #8b5cf6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          .loading-text {
            color: #6b7280;
            font-size: 1.1rem;
            font-weight: 500;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="empty-state">
          <Users className="empty-icon" size={80} />
          <h2 className="empty-title">No Connections Yet</h2>
          <p className="empty-description">Start connecting with people to build your network!</p>
        </div>
        <style jsx>{`
          .empty-state {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            animation: fadeInUp 0.6s ease-out;
          }
          
          .empty-icon {
            color: #9ca3af;
            margin: 0 auto 1rem;
            animation: pulse 2s infinite;
          }
          
          .empty-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }
          
          .empty-description {
            color: #6b7280;
            font-size: 1rem;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="connections-container">
      <div className="connections-header">
        <div className="header-content">
          <div className="header-icon">
            <Users size={32} />
          </div>
          <div>
            <h1 className="header-title">My Connections</h1>
            <p className="header-subtitle">{connections.length} active connections</p>
          </div>
        </div>
      </div>

      <div className="connections-grid">
        {connections.map((connection, index) => {
          const partner = getConnectionPartner(connection);
          return (
            <div 
              key={connection._id} 
              className="connection-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-header">
                <div className="avatar-container">
                  <div className="avatar">
                    {partner?.photoUrl ? (
                      <img src={partner.photoUrl} alt={partner.firstName} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="status-badge">
                    <div className="status-dot"></div>
                    {connection.status}
                  </div>
                </div>
                <div className="user-info">
                  <h3 className="user-name">{partner?.firstName || 'Unknown'}</h3>
                  <div className="user-email">
                    <Mail size={16} />
                    {partner?.emailId || 'No email'}
                  </div>
                </div>
              </div>

              <div className="card-body">
                {partner?.about && (
                  <p className="user-about">{partner.about}</p>
                )}
                
                <div className="connection-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>Connected {formatDate(connection.createdAt)}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>Updated {formatDate(connection.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button className="action-btn message-btn">
                  <MessageCircle size={18} />
                  Message
                </button>
                <button className="action-btn profile-btn">
                  <User size={18} />
                  View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .connections-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .connections-header {
          margin-bottom: 2rem;
          animation: slideInDown 0.6s ease-out;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .header-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 1rem;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1a202c;
          margin: 0;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-subtitle {
          color: #718096;
          margin: 0;
          font-weight: 500;
        }

        .connections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .connection-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
          border: 1px solid rgba(255, 255, 255, 0.18);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out both;
          position: relative;
        }

        .connection-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(31, 38, 135, 0.5);
        }

        .connection-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .card-header {
          padding: 2rem 2rem 1rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .avatar-container {
          position: relative;
        }

        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          transition: transform 0.3s ease;
        }

        .avatar:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #10b981;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          text-transform: capitalize;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 0.5rem 0;
        }

        .user-email {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #718096;
          font-size: 0.9rem;
        }

        .card-body {
          padding: 0 2rem 1rem;
        }

        .user-about {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .connection-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #718096;
          font-size: 0.875rem;
        }

        .card-actions {
          padding: 1.5rem 2rem;
          background: rgba(102, 126, 234, 0.05);
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .message-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .message-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .profile-btn {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border: 2px solid #667eea;
        }

        .profile-btn:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .connections-container {
            padding: 1rem;
          }
          
          .connections-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .header-title {
            font-size: 1.5rem;
          }
          
          .card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Connections;
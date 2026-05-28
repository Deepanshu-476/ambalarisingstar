import React, { useState, useEffect, useMemo } from 'react';
import API, { IMAGE_BASE_URL, API_BASE_URL } from '../api/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // State variables
  const [allPlayers, setAllPlayers] = useState([]); // CDS Champions Trophy players
  const [jplPlayers, setJplPlayers] = useState([]); // Junior Premier League players
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [verifying, setVerifying] = useState(false);
  const [showAllPlayersView, setShowAllPlayersView] = useState(false);
  const [playerType, setPlayerType] = useState('cds'); // 'cds' or 'jpl'
  
  // Dashboard stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    totalCollection: 0
  });
  
  const [jplStats, setJplStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    totalCollection: 0
  });
  
  const [detailedStats, setDetailedStats] = useState({
    roleStats: [],
    categoryStats: [],
    monthlyStats: []
  });
  
  // Verification modal state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('email');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  
  // Advanced filters for all players view
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    category: 'all',
    search: '',
    startDate: '',
    endDate: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // Get current players based on playerType
  const currentPlayers = playerType === 'cds' ? allPlayers : jplPlayers;
  
  // Stats cards data based on player type
  const statsCards = [
    { 
      title: 'Total Registrations', 
      value: playerType === 'cds' ? stats.total : jplStats.total, 
      icon: '📋',
      color: '#667eea',
      description: 'All registered players'
    },
    { 
      title: 'Pending', 
      value: playerType === 'cds' ? stats.pending : jplStats.pending, 
      icon: '⏳',
      color: '#ed8936',
      description: 'Awaiting verification'
    },
    { 
      title: 'Verified', 
      value: playerType === 'cds' ? stats.verified : jplStats.verified, 
      icon: '✅',
      color: '#48bb78',
      description: 'Payment confirmed'
    },
    { 
      title: 'Rejected', 
      value: playerType === 'cds' ? stats.rejected : jplStats.rejected, 
      icon: '❌',
      color: '#f56565',
      description: 'Payment rejected'
    },
    { 
      title: 'Total Collection', 
      value: `₹${playerType === 'cds' ? stats.totalCollection : jplStats.totalCollection}`, 
      icon: '💰',
      color: '#9f7aea',
      description: 'Total registration fees'
    }
  ];

  // Fetch CDS Champions Trophy players
  const fetchCDSPlayers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await API.get(`/player/all-players`, {
        params: {
          page: 1,
          limit: 1000,
          status: 'all'
        }
      });
      
      if (response.data.success) {
        setAllPlayers(response.data.data);
        
        // Calculate CDS stats
        const cdsPlayers = response.data.data;
        const pending = cdsPlayers.filter(p => p.paymentStatus === 'pending').length;
        const verified = cdsPlayers.filter(p => p.paymentStatus === 'verified').length;
        const rejected = cdsPlayers.filter(p => p.paymentStatus === 'rejected').length;
        
        setStats({
          total: cdsPlayers.length,
          pending: pending,
          verified: verified,
          rejected: rejected,
          totalCollection: verified * 500
        });
      }
    } catch (err) {
      console.error('Error fetching CDS players:', err);
      setError('Failed to fetch CDS players');
      useMockData('cds');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Junior Premier League players
  const fetchJPLPlayers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await API.get(`/jpl-player/all`, {
        params: {
          page: 1,
          limit: 1000
        }
      });
      
      if (response.data.success) {
        setJplPlayers(response.data.data);
        
        // Calculate JPL stats
        const jplPlayersData = response.data.data;
        const pending = jplPlayersData.filter(p => p.paymentStatus === 'pending').length;
        const verified = jplPlayersData.filter(p => p.paymentStatus === 'verified').length;
        const rejected = jplPlayersData.filter(p => p.paymentStatus === 'rejected').length;
        
        setJplStats({
          total: jplPlayersData.length,
          pending: pending,
          verified: verified,
          rejected: rejected,
          totalCollection: verified * 500
        });
        
        // Set detailed stats for JPL
        const roleStats = {};
        jplPlayersData.forEach(player => {
          if (player.role) {
            roleStats[player.role] = (roleStats[player.role] || 0) + 1;
          }
        });
        
        const categoryStats = {};
        jplPlayersData.forEach(player => {
          if (player.ageCategory) {
            categoryStats[player.ageCategory] = (categoryStats[player.ageCategory] || 0) + 1;
          }
        });
        
        setDetailedStats({
          roleStats: Object.entries(roleStats).map(([name, count]) => ({ _id: name, count })),
          categoryStats: Object.entries(categoryStats).map(([name, count]) => ({ _id: name, count })),
          monthlyStats: []
        });
      }
    } catch (err) {
      console.error('Error fetching JPL players:', err);
      setError('Failed to fetch JPL players');
      useMockData('jpl');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const statsResponse = await API.get(`/player/dashboard-stats`);
      
      if (statsResponse.data.success) {
        const overview = statsResponse.data.data.overview;
        setStats({
          total: overview.totalPlayers,
          pending: overview.pendingPlayers,
          verified: overview.verifiedPlayers,
          rejected: overview.rejectedPlayers,
          totalCollection: overview.totalCollection
        });
        
        setDetailedStats({
          roleStats: statsResponse.data.data.roleStats || [],
          categoryStats: statsResponse.data.data.categoryStats || [],
          monthlyStats: statsResponse.data.data.monthlyStats || []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  // Filter players based on active tab and filters
  const getFilteredPlayers = useMemo(() => {
    let filtered = [...currentPlayers];
    
    // Apply active tab filter (only for verification view)
    if (!showAllPlayersView && activeTab !== 'all') {
      filtered = filtered.filter(player => player.paymentStatus === activeTab);
    }
    
    // Apply search filter if in all players view
    if (showAllPlayersView && filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(player => 
        player.name?.toLowerCase().includes(searchLower) ||
        player.email?.toLowerCase().includes(searchLower) ||
        player.phone?.includes(filters.search) ||
        player.utrNumber?.includes(filters.search)
      );
    }
    
    return filtered;
  }, [currentPlayers, activeTab, showAllPlayersView, filters.search]);

  // Helper function to generate mock players
  const generateMockPlayersWithStatus = (status, count, tournament = 'cds') => {
    const names = ['Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Vihaan Kumar', 'Arjun Gupta'];
    const roles = ['Batsman', 'Bowler', 'Allrounder', 'Wicket Keeper'];
    const categories = tournament === 'cds' ? ['Junior', 'Senior', 'Veteran'] : ['Under 16', '16-22 Years', '22-35 Years', '35-40 Years'];
    
    return Array.from({ length: count }, (_, i) => ({
      _id: `${tournament}_mock_${status}_${i + 1}`,
      name: names[i % names.length],
      email: `${tournament}_${status}${i + 1}@example.com`,
      phone: `98765${String(10000 + i).slice(1)}`,
      role: roles[i % roles.length],
      category: categories[i % categories.length],
      ageCategory: categories[i % categories.length],
      utrNumber: `UTR${status.toUpperCase().slice(0, 3)}${String(1000 + i).slice(1)}`,
      paymentStatus: status,
      paymentMethod: 'qr',
      paymentProof: 'demo-payment.jpg',
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      verificationDate: status !== 'pending' ? new Date().toISOString() : null,
      verifiedBy: status !== 'pending' ? 'Admin' : null,
      profileLink: `https://example.com/profile/${status}${i + 1}`,
      teamPreference: i % 2 === 0 ? 'Team A' : 'Team B',
      notes: status === 'rejected' ? 'Payment not received' : null,
      tournament: tournament === 'cds' ? 'CDS Champions Trophy' : 'Junior Premier League Ambala Section 1',
      aadharNumber: `1234${String(5678 + i).slice(0, 8)}`
    }));
  };

  // Use mock data for development
  const useMockData = (type) => {
    if (type === 'cds') {
      const mockPlayers = [
        ...generateMockPlayersWithStatus('pending', 8, 'cds'),
        ...generateMockPlayersWithStatus('verified', 15, 'cds'),
        ...generateMockPlayersWithStatus('rejected', 4, 'cds')
      ];
      
      setAllPlayers(mockPlayers);
      
      setStats({
        total: mockPlayers.length,
        pending: mockPlayers.filter(p => p.paymentStatus === 'pending').length,
        verified: mockPlayers.filter(p => p.paymentStatus === 'verified').length,
        rejected: mockPlayers.filter(p => p.paymentStatus === 'rejected').length,
        totalCollection: mockPlayers.filter(p => p.paymentStatus === 'verified').length * 500
      });
    } else {
      const mockPlayers = [
        ...generateMockPlayersWithStatus('pending', 6, 'jpl'),
        ...generateMockPlayersWithStatus('verified', 10, 'jpl'),
        ...generateMockPlayersWithStatus('rejected', 2, 'jpl')
      ];
      
      setJplPlayers(mockPlayers);
      
      setJplStats({
        total: mockPlayers.length,
        pending: mockPlayers.filter(p => p.paymentStatus === 'pending').length,
        verified: mockPlayers.filter(p => p.paymentStatus === 'verified').length,
        rejected: mockPlayers.filter(p => p.paymentStatus === 'rejected').length,
        totalCollection: mockPlayers.filter(p => p.paymentStatus === 'verified').length * 500
      });
      
      // Mock detailed stats for JPL
      const roleStats = {};
      const categoryStats = {};
      mockPlayers.forEach(player => {
        if (player.role) {
          roleStats[player.role] = (roleStats[player.role] || 0) + 1;
        }
        if (player.ageCategory) {
          categoryStats[player.ageCategory] = (categoryStats[player.ageCategory] || 0) + 1;
        }
      });
      
      setDetailedStats({
        roleStats: Object.entries(roleStats).map(([name, count]) => ({ _id: name, count })),
        categoryStats: Object.entries(categoryStats).map(([name, count]) => ({ _id: name, count })),
        monthlyStats: []
      });
    }
  };

  // Handle tournament type change
  const handleTournamentChange = (type) => {
    setPlayerType(type);
    setActiveTab('all');
    setShowAllPlayersView(false);
    setFilters({
      status: 'all',
      role: 'all',
      category: 'all',
      search: '',
      startDate: '',
      endDate: ''
    });
    setSearchResults(null);
    setSearchTerm('');
    
    if (type === 'cds') {
      fetchCDSPlayers();
    } else {
      fetchJPLPlayers();
    }
  };

  // Handle role click - filter by role
  const handleRoleClick = (role) => {
    setShowAllPlayersView(true);
    setFilters(prev => ({
      ...prev,
      role: role,
      status: 'all',
      category: 'all',
      search: ''
    }));
    setCurrentPage(1);
    setSuccess(`Filtered by role: ${role}`);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Handle category click for JPL
  const handleCategoryClick = (category) => {
    setShowAllPlayersView(true);
    setFilters(prev => ({
      ...prev,
      category: category,
      role: 'all',
      status: 'all'
    }));
    setCurrentPage(1);
    setSuccess(`Filtered by category: ${category}`);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Handle verification
  const handleVerifyPayment = async () => {
    if (!selectedPlayer || !verificationStatus || !verifiedBy.trim()) {
      setError('Please select a status and enter your name');
      return;
    }

    try {
      setVerifying(true);
      
      const endpoint = playerType === 'cds' ? '/player/verify-payment' : '/jpl-player/update';
      const updateData = {
        playerId: selectedPlayer._id,
        paymentStatus: verificationStatus,
        verifiedBy: verifiedBy.trim(),
        notes: verificationNotes
      };
      
      let response;
      
      if (playerType === 'cds') {
        response = await API.post(endpoint, updateData);
      } else {
        response = await API.put(`${endpoint}/${selectedPlayer._id}`, {
          paymentStatus: verificationStatus,
          verificationStatus: verificationStatus === 'verified' ? 'verified' : 'pending',
          notes: verificationNotes
        });
      }
      
      if (response.data.success) {
        setSuccess(`Payment ${verificationStatus} successfully`);
        
        // Update local state
        const updatedPlayer = response.data.data || { ...selectedPlayer, paymentStatus: verificationStatus, verifiedBy: verifiedBy.trim(), verificationDate: new Date().toISOString() };
        
        if (playerType === 'cds') {
          setAllPlayers(prevPlayers => 
            prevPlayers.map(player => 
              player._id === selectedPlayer._id ? updatedPlayer : player
            )
          );
          await fetchCDSPlayers();
        } else {
          setJplPlayers(prevPlayers => 
            prevPlayers.map(player => 
              player._id === selectedPlayer._id ? updatedPlayer : player
            )
          );
          await fetchJPLPlayers();
        }
      } else {
        setError(response.data.message || 'Verification failed');
        return;
      }
      
      setShowVerifyModal(false);
      setSelectedPlayer(null);
      setVerificationStatus('');
      setVerifiedBy('');
      setVerificationNotes('');
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error verifying payment:', err);
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  // Handle status check
  const handleStatusCheck = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter search term');
      return;
    }

    try {
      setSearching(true);
      setError('');
      setSearchResults(null);
      
      const params = {};
      if (searchType === 'email') {
        params.email = searchTerm.trim();
      } else {
        params.utrNumber = searchTerm.trim();
      }
      
      const endpoint = playerType === 'cds' ? '/player/check-status' : `/jpl-player/search`;
      const response = await API.get(endpoint, { params });
      
      if (response.data.success) {
        setSearchResults(response.data.data);
        setSuccess('Registration found!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('No registration found with provided details');
      }
      
    } catch (err) {
      console.error('Error checking status:', err);
      setError('No registration found with provided details');
    } finally {
      setSearching(false);
    }
  };

  // Handle advanced filter search
  const handleAdvancedSearch = () => {
    // For mock data, just filter locally
    setShowAllPlayersView(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      role: 'all',
      category: 'all',
      search: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1);
    setShowAllPlayersView(false);
  };

  // Export data to CSV
  const exportToCSV = () => {
    const playersToExport = getFilteredPlayers;
    
    if (playersToExport.length === 0) {
      setError('No data to export');
      return;
    }
    
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Category', 'UTR Number', 'Payment Status', 'Registered Date', 'Verified Date', 'Verified By'];
    const csvData = [
      headers.join(','),
      ...playersToExport.map(player => [
        `"${player.name || 'N/A'}"`,
        `"${player.email || 'N/A'}"`,
        `"${player.phone || 'N/A'}"`,
        `"${player.role || 'N/A'}"`,
        `"${player.ageCategory || player.category || 'N/A'}"`,
        `"${player.utrNumber || 'N/A'}"`,
        `"${player.paymentStatus || 'N/A'}"`,
        `"${player.createdAt ? new Date(player.createdAt).toLocaleDateString('en-IN') : 'N/A'}"`,
        `"${player.verificationDate ? new Date(player.verificationDate).toLocaleDateString('en-IN') : 'Not Verified'}"`,
        `"${player.verifiedBy || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playerType === 'cds' ? 'cds-champions-trophy' : 'junior-premier-league'}-${showAllPlayersView ? 'all' : activeTab}-players-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setSuccess(`Data exported successfully! (${playersToExport.length} records)`);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Export to Excel via API
  const exportToExcel = async () => {
    try {
      const params = new URLSearchParams();
      
      if (showAllPlayersView) {
        if (filters.status !== 'all') params.append('status', filters.status);
        if (filters.role !== 'all') params.append('role', filters.role);
        if (filters.category !== 'all') params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
      } else if (activeTab !== 'all') {
        params.append('status', activeTab);
      }
      
      const endpoint = playerType === 'cds' ? '/player/export-players' : '/jpl-player/export';
      const response = await API.get(endpoint, {
        params: params,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${playerType === 'cds' ? 'cds-champions-trophy' : 'junior-premier-league'}-players-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSuccess('Excel file exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      exportToCSV();
    }
  };

  // Open verification modal
  const openVerifyModal = (player) => {
    setSelectedPlayer(player);
    setVerificationStatus(player.paymentStatus);
    setVerifiedBy('');
    setVerificationNotes(player.notes || '');
    setShowVerifyModal(true);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not verified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return { background: '#f0fff4', color: '#22543d' };
      case 'pending': return { background: '#fffaf0', color: '#c05621' };
      case 'rejected': return { background: '#fff5f5', color: '#742a2a' };
      default: return { background: '#f7fafc', color: '#4a5568' };
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle view toggle
  const handleViewToggle = (isAllPlayersView) => {
    setShowAllPlayersView(isAllPlayersView);
    setCurrentPage(1);
    setActiveTab('all');
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Initial data fetch
  useEffect(() => {
    fetchCDSPlayers();
    fetchJPLPlayers();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-title">
            <h1>
              <span className="header-icon">🏏</span>
              CDS Champions Trophy & Junior Premier League
            </h1>
            <p className="header-subtitle">Admin Dashboard - Complete Player Management System for Both Tournaments</p>
          </div>
          <div className="admin-profile">
            <div className="admin-avatar">
              A
            </div>
            <div className="admin-info">
              <div className="admin-name">Administrator</div>
              <div className="admin-role">Full System Access</div>
            </div>
          </div>
        </div>

        {/* Tournament Selector Buttons - NEW SECTION */}
        <div className="tournament-selector-section">
          <div className="tournament-buttons">
            <button
              className={`tournament-btn ${playerType === 'cds' ? 'active' : ''}`}
              onClick={() => handleTournamentChange('cds')}
            >
              <span className="tournament-icon">🏆</span>
              CDS Champions Trophy
              <span className="tournament-count">({stats.total} players)</span>
            </button>
            
            <button
              className={`tournament-btn ${playerType === 'jpl' ? 'active' : ''}`}
              onClick={() => handleTournamentChange('jpl')}
            >
              <span className="tournament-icon">🏏</span>
              Junior Premier League Ambala
              <span className="tournament-count">({jplStats.total} players)</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {statsCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3 className="stat-title">{stat.title}</h3>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-description">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Statistics */}
        {detailedStats.roleStats.length > 0 && (
          <div className="detailed-stats-section">
            <div className="detailed-stats-card">
              <h3 className="section-title">
                <span className="section-icon">📊</span>
                Detailed Statistics - {playerType === 'cds' ? 'CDS Champions Trophy' : 'Junior Premier League'}
              </h3>
              
              <div className="stats-details-grid">
                {/* Role Distribution */}
                <div className="stat-detail-group">
                  <h4 className="stat-group-title">Role Distribution</h4>
                  <div className="stat-items-list">
                    {detailedStats.roleStats.map(role => (
                      <div 
                        key={role._id} 
                        className="stat-item clickable-role"
                        onClick={() => handleRoleClick(role._id)}
                        title={`Click to filter by ${role._id}`}
                      >
                        <div className="stat-item-content">
                          <div className="stat-item-label">
                            <span className="role-label">{role._id}</span>
                            <span className="click-hint">(click to filter)</span>
                          </div>
                        </div>
                        <div className="stat-item-count">
                          {role.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Category Distribution */}
                <div className="stat-detail-group">
                  <h4 className="stat-group-title">
                    {playerType === 'cds' ? 'Category Distribution' : 'Age Category Distribution'}
                  </h4>
                  <div className="stat-items-list">
                    {detailedStats.categoryStats.map(category => (
                      <div 
                        key={category._id} 
                        className="stat-item clickable-category"
                        onClick={() => handleCategoryClick(category._id)}
                        title={`Click to filter by ${category._id}`}
                      >
                        <div className="stat-item-label">
                          <span className="category-label">{category._id}</span>
                          <span className="click-hint">(click to filter)</span>
                        </div>
                        <div className="stat-item-count category-count">
                          {category.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="main-content">
          {/* Messages */}
          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              {success}
            </div>
          )}
          
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* View Toggle */}
          <div className="view-toggle-section">
            <div className="view-toggle-buttons">
              <button
                className={`view-toggle-btn ${!showAllPlayersView ? 'active' : ''}`}
                onClick={() => handleViewToggle(false)}
              >
                <span className="btn-icon">⏳</span>
                Pending Verification
              </button>
              
              <button
                className={`view-toggle-btn ${showAllPlayersView ? 'active' : ''}`}
                onClick={() => handleViewToggle(true)}
              >
                <span className="btn-icon">📋</span>
                All Players
              </button>
            </div>
            
            <div className="action-buttons">
              <button
                className="action-btn export-btn"
                onClick={exportToExcel}
              >
                <span className="btn-icon">📊</span>
                Export Excel
              </button>
              
              <button
                className="action-btn export-csv-btn"
                onClick={exportToCSV}
              >
                <span className="btn-icon">📄</span>
                Export CSV
              </button>
              
              <button
                className="action-btn refresh-btn"
                onClick={() => playerType === 'cds' ? fetchCDSPlayers() : fetchJPLPlayers()}
                disabled={loading}
              >
                <span className="btn-icon">🔄</span>
                Refresh Data
              </button>
            </div>
          </div>

          {/* Advanced Filters (for All Players view) */}
          {showAllPlayersView && (
            <div className="advanced-filters-card">
              <h3 className="section-title">Advanced Filters</h3>
              
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">Status</label>
                  <select
                    className="filter-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Role</label>
                  <select
                    className="filter-select"
                    value={filters.role}
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                    <option value="Wicket Keeper">Wicket Keeper</option>
                    <option value="Allrounder">Allrounder</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">
                    {playerType === 'cds' ? 'Category' : 'Age Category'}
                  </label>
                  <select
                    className="filter-select"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="all">
                      {playerType === 'cds' ? 'All Categories' : 'All Age Categories'}
                    </option>
                    {playerType === 'cds' ? (
                      <>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Veteran">Veteran</option>
                      </>
                    ) : (
                      <>
                        <option value="Under 16">Under 16</option>
                        <option value="16-22 Years">16-22 Years</option>
                        <option value="22-35 Years">22-35 Years</option>
                        <option value="35-40 Years">35-40 Years</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              
              <div className="search-filters-grid">
                <div className="filter-group">
                  <label className="filter-label">Search</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Search by name, email, phone, or UTR..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">From Date</label>
                  <input
                    type="date"
                    className="filter-input"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">To Date</label>
                  <input
                    type="date"
                    className="filter-input"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="filter-actions">
                <button
                  className="filter-clear-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
                
                <button
                  className="filter-apply-btn"
                  onClick={handleAdvancedSearch}
                >
                  <span className="btn-icon">🔍</span>
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Quick Status Check */}
          <div className="quick-search-card">
            <h3 className="section-title">Quick Registration Lookup</h3>
            <div className="search-controls">
              <div className="search-type-selector">
                <span className="search-label">Search by:</span>
                <select
                  className="search-select"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="email">Email</option>
                  <option value="utrNumber">UTR Number</option>
                </select>
              </div>
              
              <input
                type="text"
                className="search-input"
                placeholder={searchType === 'email' ? 'Enter email address' : 'Enter UTR number'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleStatusCheck()}
              />
              
              <button
                className="search-btn"
                onClick={handleStatusCheck}
                disabled={searching}
              >
                {searching ? 'Searching...' : 'Check Status'}
              </button>
            </div>

            {searchResults && (
              <div className="search-results-card">
                <h4 className="results-title">Registration Details</h4>
                <div className="results-grid">
                  <div className="result-field">
                    <div className="field-label">Name</div>
                    <div className="field-value">{searchResults.name}</div>
                  </div>
                  <div className="result-field">
                    <div className="field-label">Email</div>
                    <div className="field-value">{searchResults.email}</div>
                  </div>
                  <div className="result-field">
                    <div className="field-label">UTR Number</div>
                    <div className="field-value utr-number">{searchResults.utrNumber}</div>
                  </div>
                  <div className="result-field">
                    <div className="field-label">Status</div>
                    <span 
                      className="status-badge"
                      style={getStatusColor(searchResults.paymentStatus)}
                    >
                      {searchResults.paymentStatus}
                    </span>
                  </div>
                  <div className="result-field">
                    <div className="field-label">Registered</div>
                    <div className="field-value">{formatDate(searchResults.createdAt)}</div>
                  </div>
                  {searchResults.verifiedBy && (
                    <div className="result-field">
                      <div className="field-label">Verified By</div>
                      <div className="field-value">{searchResults.verifiedBy}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tabs for Pending View */}
          {!showAllPlayersView && (
            <div className="tabs-container">
              {['all', 'pending', 'verified', 'rejected'].map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab !== 'all' && (
                    <span className="tab-count">
                      ({playerType === 'cds' ? stats[tab] : jplStats[tab]})
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Players Table */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading player data...</p>
            </div>
          ) : (
            <div className="players-table-container">
              {/* Table Header */}
              <div className="table-header">
                <h3 className="table-title">
                  {playerType === 'cds' ? 'CDS Champions Trophy Players' : 'Junior Premier League Players'}
                  <span className="table-subtitle">
                    ({getFilteredPlayers.length} players)
                  </span>
                </h3>
                
                {showAllPlayersView && (
                  <div className="filter-summary">
                    {filters.role !== 'all' && (
                      <span className="filter-tag">
                        Role: {filters.role}
                        <button 
                          className="filter-remove"
                          onClick={() => handleFilterChange('role', 'all')}
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.status !== 'all' && (
                      <span className="filter-tag">
                        Status: {filters.status}
                        <button 
                          className="filter-remove"
                          onClick={() => handleFilterChange('status', 'all')}
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.category !== 'all' && (
                      <span className="filter-tag">
                        {playerType === 'cds' ? 'Category' : 'Age Category'}: {filters.category}
                        <button 
                          className="filter-remove"
                          onClick={() => handleFilterChange('category', 'all')}
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.search && (
                      <span className="filter-tag">
                        Search: {filters.search}
                        <button 
                          className="filter-remove"
                          onClick={() => handleFilterChange('search', '')}
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Table */}
              {getFilteredPlayers.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No players found</h3>
                  <p>No {playerType === 'cds' ? 'CDS' : 'JPL'} players found</p>
                  {showAllPlayersView && (
                    <button
                      className="clear-filters-btn"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="players-table">
                    <thead>
                      <tr>
                        <th className="table-header-cell">Player Details</th>
                        <th className="table-header-cell">UTR & Payment</th>
                        
                        {showAllPlayersView && (
                          <th className="table-header-cell">
                            {playerType === 'cds' ? 'Category & Role' : 'Age Category & Role'}
                          </th>
                        )}
                        
                        <th className="table-header-cell">Registration Timeline</th>
                        <th className="table-header-cell">Actions</th>
                      </tr>
                    </thead>
                    
                    <tbody>
                      {getFilteredPlayers.map(player => (
                        <tr key={player._id} className="table-row">
                          {/* Player Details Column */}
                          <td 
                            className="table-cell player-details-cell"
                            data-label="Player Details"
                          >
                            <div className="player-name">
                              {player.name}
                            </div>
                            <div className="player-info">
                              <span className="info-icon">📧</span> {player.email}
                            </div>
                            <div className="player-info">
                              <span className="info-icon">📱</span> {player.phone}
                            </div>
                            
                            {/* Aadhar Number for JPL */}
                            {playerType === 'jpl' && player.aadharNumber && (
                              <div className="player-info">
                                <span className="info-icon">🪪</span> Aadhar: {player.aadharNumber}
                              </div>
                            )}

                            {/* PAYMENT PROOF IMAGE */}
                            <div className="payment-proof-container">
                              {player.paymentProof ? (
                                <img
                                  src={`${IMAGE_BASE_URL}/uploads/captains/${player.paymentProof}`}
                                  alt="Payment Proof"
                                  className="payment-proof-img"
                                  onClick={() =>
                                    window.open(
                                      `${IMAGE_BASE_URL}/uploads/captains/${player.paymentProof}`,
                                      "_blank"
                                    )
                                  }
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/no-image.png";
                                  }}
                                />
                              ) : (
                                <div className="payment-proof-fallback">
                                  Payment Proof Not Available
                                </div>
                              )}
                            </div>

                            {player.profileLink && (
                              <a 
                                href={player.profileLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="profile-link"
                              >
                                <span className="link-icon">🔗</span>
                                Profile Link
                              </a>
                            )}
                          </td>
                          
                          {/* UTR & Payment Column */}
                          <td 
                            className="table-cell payment-cell"
                            data-label="Payment Details"
                          >
                            <div className="utr-number-display">
                              {player.utrNumber}
                            </div>
                            <div className="status-badge-container">
                              <span 
                                className="status-badge table-badge"
                                style={getStatusColor(player.paymentStatus)}
                              >
                                {player.paymentStatus}
                              </span>
                            </div>
                            <div className="payment-method">
                              Method: {player.paymentMethod === 'qr' ? 'QR Code' : 'Bank Transfer'}
                            </div>
                            {player.verifiedBy && (
                              <div className="verified-by">
                                Verified by: {player.verifiedBy}
                              </div>
                            )}
                            {player.notes && (
                              <div className="player-notes">
                                Note: {player.notes}
                              </div>
                            )}
                          </td>
                          
                          {/* Category & Role Column */}
                          {showAllPlayersView && (
                            <td 
                              className="table-cell category-cell"
                              data-label="Role & Category"
                            >
                              <div className="category-group">
                                <div className="field-label-small">
                                  {playerType === 'cds' ? 'Category' : 'Age Category'}
                                </div>
                                <div className="field-value">
                                  {player.ageCategory || player.category || 'N/A'}
                                </div>
                              </div>
                              <div className="role-group">
                                <div className="field-label-small">Role</div>
                                <div className="field-value role-value">{player.role}</div>
                              </div>
                            </td>
                          )}
                          
                          {/* Registration Timeline Column */}
                          <td 
                            className="table-cell timeline-cell"
                            data-label="Timeline"
                          >
                            <div className="timeline-group">
                              <div className="field-label-small">Registered</div>
                              <div className="field-value">{formatDate(player.createdAt)}</div>
                            </div>
                            {player.verificationDate && (
                              <div className="timeline-group">
                                <div className="field-label-small">Verified</div>
                                <div className="field-value">{formatDate(player.verificationDate)}</div>
                              </div>
                            )}
                          </td>
                          
                          {/* Actions Column */}
                          <td 
                            className="table-cell actions-cell"
                            data-label="Actions"
                          >
                            <div className="action-buttons-group">
                              <button
                                className="action-btn verify-btn"
                                onClick={() => openVerifyModal(player)}
                                title="Verify/reject payment"
                              >
                                Verify/Update
                              </button>
                              <button
                                className="action-btn view-btn"
                                onClick={() => {
                                  setSearchResults({
                                    name: player.name,
                                    email: player.email,
                                    utrNumber: player.utrNumber,
                                    paymentStatus: player.paymentStatus,
                                    createdAt: player.createdAt,
                                    verifiedBy: player.verifiedBy
                                  });
                                }}
                                title="View details"
                              >
                                View Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <div className="footer-left">
            {playerType === 'cds' ? 'CDS Premier League' : 'Junior Premier League Ambala'} Admin Dashboard • {new Date().toLocaleDateString('en-IN')}
          </div>
          <div className="footer-right">
            Total: {playerType === 'cds' ? stats.total : jplStats.total} players • Verified: {playerType === 'cds' ? stats.verified : jplStats.verified} • Pending: {playerType === 'cds' ? stats.pending : jplStats.pending}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              Verify Payment - {selectedPlayer?.name}
            </h2>
            
            <div className="modal-body">
              <div className="modal-section">
                <div className="modal-field-label">Change Status</div>
                <div className="status-options">
                  <button
                    className={`status-option-btn ${verificationStatus === 'pending' ? 'active pending' : ''}`}
                    onClick={() => setVerificationStatus('pending')}
                  >
                    Pending
                  </button>
                  <button
                    className={`status-option-btn ${verificationStatus === 'verified' ? 'active verified' : ''}`}
                    onClick={() => setVerificationStatus('verified')}
                  >
                    Verified
                  </button>
                  <button
                    className={`status-option-btn ${verificationStatus === 'rejected' ? 'active rejected' : ''}`}
                    onClick={() => setVerificationStatus('rejected')}
                  >
                    Rejected
                  </button>
                </div>
              </div>
              
              <div className="modal-section">
                <div className="modal-field-label">UTR Number</div>
                <div className="modal-utr-display">
                  {selectedPlayer?.utrNumber}
                </div>
              </div>
              
              <div className="modal-section">
                <div className="modal-field-label">Current Status</div>
                <div className="current-status-display">
                  <span className="modal-status-badge pending">
                    {selectedPlayer?.paymentStatus}
                  </span>
                </div>
              </div>
              
              <div className="modal-section">
                <div className="modal-field-label">
                  Verified By (Your Name)
                </div>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Enter your name"
                  value={verifiedBy}
                  onChange={(e) => setVerifiedBy(e.target.value)}
                />
              </div>
              
              <div className="modal-section">
                <div className="modal-field-label">
                  Notes (Optional)
                </div>
                <textarea
                  className="modal-textarea"
                  placeholder="Add any notes or remarks..."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                className="modal-btn cancel-btn"
                onClick={() => {
                  setShowVerifyModal(false);
                  setSelectedPlayer(null);
                  setVerificationStatus('');
                  setVerifiedBy('');
                  setVerificationNotes('');
                }}
              >
                Cancel
              </button>
              <button
                className={`modal-btn confirm-btn ${verificationStatus || 'pending'}`}
                onClick={handleVerifyPayment}
                disabled={!verifiedBy.trim() || verifying}
              >
                {verifying ? 'Processing...' : `Mark as ${verificationStatus || 'pending'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import API, { IMAGE_BASE_URL } from '../api/axios';
import { useNavigate } from "react-router-dom";
import QR from "../assets/ambala.jpeg";
import './JuniorPremierLeagueAmbala.css';

const JuniorPremierLeagueAmbala = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    profileLink: '',
    role: 'Batsman',
    paymentMethod: 'qr',
    utrNumber: '',
    ageCategory: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    qrCodeUrl: null,
    upiId: '',
    registrationFee: 500
  });
  const [isMobile, setIsMobile] = useState(false);
  
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [aadharPreview, setAadharPreview] = useState(null);
  const [aadharNumber, setAadharNumber] = useState('');
  const [aadharNumberError, setAadharNumberError] = useState('');

  const roles = [
    "Batsman",
    "Bowler", 
    "Wicket Keeper",
    "Allrounder",
    "Batsman (WC)"
  ];

  // Compress image to 500KB
  const compressImage = (file, maxSizeKB = 500) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const maxDimension = 1500;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Start with quality 0.9 and reduce until file size is under maxSizeKB
          let quality = 0.9;
          const tryCompress = (currentQuality) => {
            canvas.toBlob(
              (blob) => {
                if (blob.size <= maxSizeKB * 1024 || currentQuality <= 0.1) {
                  // Convert blob to file
                  const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                } else {
                  tryCompress(currentQuality - 0.1);
                }
              },
              'image/jpeg',
              currentQuality
            );
          };
          
          tryCompress(quality);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Age category mapping with Under-16 restriction (10-16 years only)
  const getAgeCategory = (dob) => {
    if (!dob) return '';
    
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Under 16 category: Only ages 10-16 allowed
    if (age >= 10 && age <= 16) return 'Under 16';
    if (age > 16 && age <= 22) return '16-22 Years';
    if (age > 22 && age <= 35) return '22-35 Years';
    if (age > 35 && age <= 40) return '35-40 Years';
    return 'Not Eligible';
  };

  // Update age category when DOB changes
  useEffect(() => {
    if (formData.dob) {
      const category = getAgeCategory(formData.dob);
      setFormData(prev => ({
        ...prev,
        ageCategory: category
      }));
    }
  }, [formData.dob]);

  // Validate Aadhar Number
  const validateAadharNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    const aadharRegex = /^[2-9]{1}[0-9]{11}$/;
    if (!aadharRegex.test(cleaned)) {
      return 'Please enter a valid 12-digit Aadhar number (should not start with 0 or 1)';
    }
    return '';
  };

  const handleAadharNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length <= 12) {
      let formatted = value;
      if (value.length > 8) {
        formatted = `${value.slice(0, 4)} ${value.slice(4, 8)} ${value.slice(8, 12)}`;
      } else if (value.length > 4) {
        formatted = `${value.slice(0, 4)} ${value.slice(4)}`;
      }
      setAadharNumber(formatted);
      const error = validateAadharNumber(value);
      setAadharNumberError(error);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    fetchPaymentInfo();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Fetch payment details from JPL API
  const fetchPaymentInfo = async () => {
    try {
      const response = await API.get('/jpl-player/payment-details');
      console.log('Payment details response:', response.data);
      
      if (response.data.success) {
        setPaymentInfo({
          qrCodeUrl: response.data.qrCodeUrl || null,
          upiId: response.data.upiId || '9896474454@ptsbi',
          registrationFee: response.data.registrationFee || 500
        });
      } else {
        // Fallback values
        setPaymentInfo({
          qrCodeUrl: null,
          upiId: '9896474454@ptsbi',
          registrationFee: 500
        });
      }
    } catch (error) {
      console.error("Failed to fetch payment info:", error);
      // Fallback values on error
      setPaymentInfo({
        qrCodeUrl: null,
        upiId: '9896474454@ptsbi',
        registrationFee: 500
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Aadhar Image upload with compression
  const handleAadharImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setRegistrationStatus({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please upload only image files for Aadhar card (JPG, PNG, WebP)'
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024; // Allow up to 10MB original file
    if (file.size > maxSize) {
      setRegistrationStatus({
        type: 'error',
        title: 'File Too Large',
        message: 'Aadhar card image must be less than 10MB before compression'
      });
      return;
    }

    setLoading(true);
    try {
      // Compress image to 500KB
      const compressedFile = await compressImage(file, 500);
      setAadharImage(compressedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadharPreview(reader.result);
        setRegistrationStatus({
          type: 'success',
          title: 'Image Compressed',
          message: `Image compressed successfully from ${(file.size / 1024).toFixed(1)}KB to ${(compressedFile.size / 1024).toFixed(1)}KB`
        });
        setTimeout(() => setRegistrationStatus(null), 3000);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Compression error:', error);
      setRegistrationStatus({
        type: 'error',
        title: 'Compression Failed',
        message: 'Failed to compress image. Please try with a different image.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAadharImage = () => {
    setAadharImage(null);
    setAadharPreview(null);
    const fileInput = document.getElementById('aadharImage');
    if (fileInput) fileInput.value = '';
  };

  const handlePaymentScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setRegistrationStatus({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please upload only image files (JPG, PNG, GIF, WebP)'
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setRegistrationStatus({
        type: 'error',
        title: 'File Too Large',
        message: 'Maximum file size is 5MB. Please upload a smaller image.'
      });
      return;
    }

    setPaymentScreenshot(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePaymentScreenshot = () => {
    setPaymentScreenshot(null);
    setScreenshotPreview(null);
    const fileInput = document.getElementById('paymentScreenshot');
    if (fileInput) fileInput.value = '';
  };

  const validateCricHeroesLink = (link) => {
    if (!link.includes('cricheroes.com') && !link.includes('chshare.link')) {
      throw new Error('Profile link must be a valid CricHeroes or Chshare URL');
    }

    const cricHeroesPattern = /^https:\/\/cricheroes\.com\/player-profile\/\d+\/[A-Za-z0-9_-]+$/;
    const chsharePattern = /^https:\/\/chshare\.link\/player\/[A-Za-z0-9_-]+$/;
    
    if (!cricHeroesPattern.test(link) && !chsharePattern.test(link)) {
      throw new Error('Profile link must be in one of the following formats: \nhttps://cricheroes.com/player-profile/1572929/Pepsi\nhttps://chshare.link/player/r56Fec');
    }

    return true;
  };

  const validateDOB = (dob) => {
    if (!dob) {
      throw new Error('Date of Birth is required');
    }
    
    const dobDate = new Date(dob);
    const today = new Date();
    
    if (isNaN(dobDate.getTime())) {
      throw new Error('Please enter a valid date of birth');
    }
    
    if (dobDate > today) {
      throw new Error('Date of Birth cannot be in the future');
    }
    
    // Calculate age
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    
    // Check minimum age (10 years for Under-16 category)
    if (age < 10) {
      throw new Error('Player must be at least 10 years old to participate');
    }
    
    // Check maximum age (40 years)
    if (age > 40) {
      throw new Error('Player age cannot exceed 40 years for Junior Premier League');
    }
    
    // Special check for Under-16 category
    if (age <= 16 && age < 10) {
      throw new Error('Under-16 players must be between 10-16 years old');
    }
    
    return true;
  };

  const validateDocuments = () => {
    if (!aadharImage) {
      throw new Error('Aadhar card image is required');
    }
    const cleanedAadhar = aadharNumber.replace(/\s/g, '');
    if (!cleanedAadhar || cleanedAadhar.length !== 12) {
      throw new Error('Valid 12-digit Aadhar number is required');
    }
    if (aadharNumberError) {
      throw new Error(aadharNumberError);
    }
    return true;
  };

  const validateStep1 = () => {
    const { name, email, phone, dob, profileLink } = formData;
    
    if (!name.trim()) {
      throw new Error('Full Name is required');
    }
    
    if (!email.trim()) {
      throw new Error('Email is required');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    if (!phone.trim()) {
      throw new Error('Phone number is required');
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      throw new Error('Please enter a valid 10-digit Indian phone number');
    }
    
    validateDOB(dob);
    
    // Check if age category is eligible
    const category = getAgeCategory(dob);
    if (category === 'Not Eligible') {
      throw new Error('Player age does not meet the eligibility criteria for any category');
    }
    
    if (!profileLink.trim()) {
      throw new Error('CricHeroes profile link is required');
    }
    
    validateCricHeroesLink(profileLink.trim());
    validateDocuments();
    
    return true;
  };

  const validateStep2 = () => {
    const { utrNumber } = formData;
    
    if (!utrNumber.trim()) {
      throw new Error('UTR number is required');
    }
    
    if (utrNumber.trim().length < 8) {
      throw new Error('Please enter a valid UTR number (minimum 8 characters)');
    }
    
    return true;
  };

  const handleNextStep = () => {
    try {
      validateStep1();
      setCurrentStep(2);
      setRegistrationStatus(null);
    } catch (error) {
      setRegistrationStatus({
        type: 'error',
        title: 'Validation Error',
        message: error.message
      });
      
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setRegistrationStatus(null);
    
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit to JPL API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setRegistrationStatus(null);

    try {
      validateStep2();

      const submitData = new FormData();
      
      // Add all form data
      Object.keys(formData).forEach(key => {
        if (key === 'phone') {
          submitData.append(key, formData[key].replace(/\D/g, ''));
        } else if (key === 'dob') {
          submitData.append(key, formData[key]);
        } else {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add Aadhar number (remove spaces)
      submitData.append('aadharNumber', aadharNumber.replace(/\s/g, ''));
      
      // Add tournament info
      submitData.append('tournament', 'Junior Premier League Ambala Section 1');
      submitData.append('paymentStatus', 'pending');
      submitData.append('verificationStatus', 'pending');
      
      // Add images (Aadhar card only, passport photo removed)
      if (aadharImage) {
        submitData.append('aadharImage', aadharImage);
      }
      if (paymentScreenshot) {
        submitData.append('paymentProof', paymentScreenshot);
      }

      console.log('Submitting JPL registration...');
      
      // API endpoint for JPL
      const response = await API.post('/jpl-player/register', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        setRegistrationStatus({
          type: 'success',
          title: 'Registration Submitted Successfully!',
          message: 'Your registration for Junior Premier League Ambala Session 1 has been submitted for verification.',
          playerId: response.data.playerId || response.data.data?._id || 'JPL-' + Date.now(),
          utrNumber: formData.utrNumber,
          registrationDate: new Date().toLocaleDateString(),
          ageCategory: formData.ageCategory
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          dob: '',
          profileLink: '',
          role: 'Batsman',
          paymentMethod: 'qr',
          utrNumber: '',
          ageCategory: ''
        });
        setAadharImage(null);
        setAadharPreview(null);
        setAadharNumber('');
        setPaymentScreenshot(null);
        setScreenshotPreview(null);
        
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        throw new Error(response.data.message || 'Registration failed. Please try again.');
      }

    } catch (error) {
      console.error('Registration error:', error);
      let userMessage = error.message;
      
      if (error.response?.data?.message) {
        userMessage = error.response.data.message;
      } else if (error.message.includes('Network Error')) {
        userMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('timeout')) {
        userMessage = 'Request timeout. Please try again.';
      }
      
      setRegistrationStatus({
        type: 'error',
        title: 'Registration Failed',
        message: userMessage
      });
      
      if (isMobile) {
        setTimeout(() => {
          const statusElement = document.querySelector('.jpl-status-message');
          if (statusElement) {
            statusElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jpl-app-container">
      <div className="jpl-registration-container">
        
        <div className="jpl-header-section">
          <button className="jpl-dashboard-button" onClick={() => navigate("/")}>
            <span>←</span>
            <span>Dashboard</span>
          </button>
          
          <div className="jpl-logo-container">
            <div className="jpl-cricket-logo">🏏</div>
            <h1 className="jpl-title">Ambala Rising Star Cricket League</h1>
          </div>
          <p className="jpl-subtitle">Season 1 | Complete registration in 2 simple steps</p>
        </div>

        <div className="jpl-step-indicator">
          <div className={`jpl-step ${currentStep === 1 ? 'active' : currentStep === 2 ? 'completed' : ''}`}>
            <div className={`jpl-step-number ${currentStep === 1 ? 'active' : currentStep === 2 ? 'completed' : ''}`}>1</div>
            <span>{isMobile ? 'Details' : 'Player Details'}</span>
            <div className={`jpl-step-line ${currentStep === 2 ? 'completed' : ''}`}></div>
          </div>
          
          <div className={`jpl-step ${currentStep === 2 ? 'active' : ''}`}>
            <div className={`jpl-step-number ${currentStep === 2 ? 'active' : ''}`}>2</div>
            <span>{isMobile ? 'Payment' : 'Payment & UTR'}</span>
          </div>
        </div>

        <div className="jpl-content-wrapper">
          {currentStep === 1 ? (
            <div className="jpl-form-section">
              <form className="jpl-registration-form">
                <div className="jpl-form-group">
                  <label className="jpl-label">Full Name <span className="jpl-required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="jpl-input"
                  />
                </div>

                <div className="jpl-form-group">
                  <label className="jpl-label">Email Address <span className="jpl-required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="jpl-input"
                  />
                </div>

                <div className="jpl-form-group">
                  <label className="jpl-label">Phone Number <span className="jpl-required">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    className="jpl-input"
                  />
                </div>

                <div className="jpl-form-group">
                  <label className="jpl-label">Date of Birth <span className="jpl-required">*</span></label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="jpl-input"
                    max={new Date().toISOString().split('T')[0]}
                    min={new Date(new Date().setFullYear(new Date().getFullYear() - 40)).toISOString().split('T')[0]}
                  />
                </div>

                {formData.ageCategory && (
                  <div className={`jpl-category-badge ${formData.ageCategory === 'Under 16' ? 'under16' : ''}`}>
                    🏷️ Age Category: {formData.ageCategory}
                    {formData.ageCategory === 'Under 16' && ' (10-16 years only)'}
                  </div>
                )}

                <div className="jpl-document-section">
                  <div className="jpl-document-title">
                    <span>📄</span> Required Documents
                  </div>

                  <div className="jpl-form-group">
                    <label className="jpl-label">Aadhar Number <span className="jpl-required">*</span></label>
                    <input
                      type="text"
                      value={aadharNumber}
                      onChange={handleAadharNumberChange}
                      placeholder="XXXX XXXX XXXX"
                      maxLength={14}
                      className={`jpl-input ${aadharNumberError ? 'error' : ''}`}
                    />
                    {aadharNumberError && <small className="jpl-error-text">{aadharNumberError}</small>}
                    <small className="jpl-help-text">Enter your 12-digit Aadhar number</small>
                  </div>

                  <div className="jpl-form-group">
                    <label className="jpl-label">Aadhar Card Image <span className="jpl-required">*</span></label>
                    <div className="jpl-file-upload-container">
                      <label className="jpl-file-upload-label">
                        <div className="jpl-upload-icon">🪪</div>
                        <div>
                          <div className="jpl-upload-text">
                            {aadharImage ? 'Change Aadhar Card' : 'Upload Aadhar Card Image'}
                          </div>
                          <div className="jpl-upload-subtext">
                            {aadharImage ? `Selected: ${aadharImage.name} (${(aadharImage.size / 1024).toFixed(1)}KB)` : 'Click to upload front side of Aadhar card'}
                          </div>
                          <div className="jpl-upload-subtext">Auto-compressed to 500KB • Supports: JPG, PNG, WebP</div>
                        </div>
                        <input
                          type="file"
                          id="aadharImage"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleAadharImageChange}
                          className="jpl-file-input"
                          disabled={loading}
                        />
                      </label>
                      
                      {aadharPreview && (
                        <div className="jpl-preview-container">
                          <img src={aadharPreview} alt="Aadhar preview" className="jpl-preview-image" />
                          <button type="button" onClick={handleRemoveAadharImage} className="jpl-remove-button">×</button>
                        </div>
                      )}
                    </div>
                    <small className="jpl-help-text">Upload clear image of your Aadhar card (automatically compressed to 500KB)</small>
                  </div>
                </div>

                <div className="jpl-form-group">
                  <label className="jpl-label">CricHeroes Profile Link <span className="jpl-required">*</span></label>
                  <input
                    type="url"
                    name="profileLink"
                    value={formData.profileLink}
                    onChange={handleChange}
                    placeholder="https://cricheroes.com/player-profile/000000000/xyz"
                    className="jpl-input"
                  />
                  <small className="jpl-help-text">Format: https://cricheroes.com/player-profile/0000000/Abcde</small>
                </div>

                <div className="jpl-form-group">
                  <label className="jpl-label">Playing Role <span className="jpl-required">*</span></label>
                  <select name="role" value={formData.role} onChange={handleChange} className="jpl-select">
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {registrationStatus && registrationStatus.type === 'error' && (
                  <div className="jpl-status-message error">
                    <div className="jpl-status-icon">❌</div>
                    <div className="jpl-status-content">
                      <h4>{registrationStatus.title}</h4>
                      <p>{registrationStatus.message}</p>
                    </div>
                  </div>
                )}

                {registrationStatus && registrationStatus.type === 'success' && (
                  <div className="jpl-status-message success" style={{ marginTop: '10px' }}>
                    <div className="jpl-status-icon">✅</div>
                    <div className="jpl-status-content">
                      <h4>{registrationStatus.title}</h4>
                      <p>{registrationStatus.message}</p>
                    </div>
                  </div>
                )}

                <div className="jpl-button-container">
                  <button type="button" className="jpl-nav-button back" onClick={() => navigate("/")}>
                    <span>←</span> Cancel
                  </button>
                  <button type="button" className="jpl-nav-button next" onClick={handleNextStep}>
                    {isMobile ? 'Next' : 'Next: Payment'} <span>→</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="jpl-form-section">
              <div className="jpl-payment-section">
                <div className="jpl-amount-badge">Registration Fee: ₹{paymentInfo.registrationFee}</div>
                
                <div className="jpl-qr-container">
                  <h3>Scan QR Code to Pay</h3>
                  
                  {paymentInfo.qrCodeUrl ? (
                    <img 
                      src={`${IMAGE_BASE_URL}${paymentInfo.qrCodeUrl}`} 
                      alt="Payment QR Code" 
                      className="jpl-qr-image" 
                      onError={(e) => {
                        console.error("Failed to load QR from URL");
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <img 
                      src={QR} 
                      alt="Payment QR Code" 
                      className="jpl-qr-image"
                      onError={(e) => {
                        console.error("Failed to load local QR image");
                      }}
                    />
                  )}
                  
                  <h3>Or<br />Pay on UPI:<br />9896474454@ptsbi</h3>
                  
                  <div className="jpl-payment-instructions">
                    <h4>How to Pay:</h4>
                    <ul>
                      <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                      <li>Scan the QR code above</li>
                      <li>Enter amount: ₹{paymentInfo.registrationFee}</li>
                      <li>Complete the payment</li>
                      <li>Save the UTR/Reference number</li>
                    </ul>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="jpl-registration-form">
                  <div className="jpl-form-group">
                    <label className="jpl-label">Enter UTR/Reference Number <span className="jpl-required">*</span></label>
                    <input
                      type="text"
                      name="utrNumber"
                      value={formData.utrNumber}
                      onChange={handleChange}
                      placeholder="Enter UTR number from your payment"
                      maxLength={16}
                      className="jpl-input"
                      disabled={loading}
                    />
                    <small className="jpl-help-text">Enter the UTR/Reference number you received after payment</small>
                  </div>

                  <div className="jpl-form-group">
                    <label className="jpl-label">Upload Payment Screenshot <span className="jpl-optional">(Optional)</span></label>
                    <div className="jpl-file-upload-container">
                      <label className="jpl-file-upload-label">
                        <div className="jpl-upload-icon">💰</div>
                        <div>
                          <div className="jpl-upload-text">
                            {paymentScreenshot ? 'Change Screenshot' : 'Upload Payment Screenshot'}
                          </div>
                          <div className="jpl-upload-subtext">
                            {paymentScreenshot ? `Selected: ${paymentScreenshot.name}` : 'Click to upload payment receipt screenshot'}
                          </div>
                          <div className="jpl-upload-subtext">Supports: JPG, PNG, GIF, WebP (Max 5MB)</div>
                        </div>
                        <input
                          type="file"
                          id="paymentScreenshot"
                          accept="image/*"
                          onChange={handlePaymentScreenshotChange}
                          className="jpl-file-input"
                          disabled={loading}
                        />
                      </label>
                      
                      {screenshotPreview && (
                        <div className="jpl-preview-container">
                          <img src={screenshotPreview} alt="Payment preview" className="jpl-preview-image" />
                          <button type="button" onClick={handleRemovePaymentScreenshot} className="jpl-remove-button">×</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="jpl-info-box">
                    <div className="jpl-info-title">
                      <span>ℹ️</span> Important Information
                    </div>
                    <p>
                      • Age Category: {formData.ageCategory || 'Will be auto-assigned based on DOB'}<br />
                      • <strong>Under 16 Category: Only players aged 10-16 years are eligible</strong><br />
                      • Aadhar card is mandatory for verification<br />
                      • Keep your UTR number safe for future reference.<br />
                      • Age categories: Under 16 (10-16 yrs), 16-22 Years, 22-35 Years, 35-40 Years
                    </p>
                  </div>

                  <div className="jpl-button-container">
                    <button type="button" className="jpl-nav-button back" onClick={handlePrevStep} disabled={loading}>
                      <span>←</span> Back
                    </button>
                    <button type="submit" className="jpl-submit-btn" disabled={loading}>
                      {loading ? (
                        <>Processing... <span className="jpl-spinner"></span></>
                      ) : (
                        <>{isMobile ? 'Submit' : 'Complete Registration'} <span>✅</span></>
                      )}
                    </button>
                  </div>
                </form>

                {registrationStatus && (
                  <div className="jpl-modal-overlay">
                    <div className="jpl-modal-box">
                      <button className="jpl-close-btn" onClick={() => setRegistrationStatus(null)}>✖</button>
                      <div className={`jpl-status-message ${registrationStatus.type}`}>
                        <div className="jpl-status-icon">{registrationStatus.type === 'success' ? '✅' : '❌'}</div>
                        <div className="jpl-status-content">
                          <h4>{registrationStatus.title}</h4>
                          <p>
                            {registrationStatus.message}
                            {registrationStatus.playerId && <><br /><strong>Player ID:</strong> {registrationStatus.playerId}</>}
                            {registrationStatus.ageCategory && <><br /><strong>Age Category:</strong> {registrationStatus.ageCategory}</>}
                            {registrationStatus.utrNumber && <><br /><strong>UTR Number:</strong> {registrationStatus.utrNumber}</>}
                            {registrationStatus.registrationDate && <><br /><strong>Date:</strong> {registrationStatus.registrationDate}</>}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JuniorPremierLeagueAmbala;
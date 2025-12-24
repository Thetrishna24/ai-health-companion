import React, { useState, useEffect } from 'react';
import { Calendar, Activity, Heart, MapPin, Clock, MessageSquare, Utensils, TrendingUp, Shield, Globe, Bell, User, LogOut, LogIn, Mail, Lock, UserCircle, Phone, MapPinIcon } from 'lucide-react';
import './App.css';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: "Hello! I'm your AI Health Assistant. How can I help you today?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dietGoal, setDietGoal] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [userProfile, setUserProfile] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Form states
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    gender: ''
  });

  // Secure API call helper
  const secureAPICall = async (endpoint, method = 'GET', body = null) => {
    const token = localStorage.getItem('authToken');
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  };

// Load user data from localStorage on mount (only token and profile, not password)
  useEffect(() => {
    const loadAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('userProfile');
        
        console.log('Loading auth:', { hasToken: !!token, hasUser: !!savedUser });
        
        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUserProfile(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading auth:', error);
      }
    };
    
    loadAuth();
  }, []);

  // Save authentication state to localStorage ONLY when logging in/out
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      try {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        console.log('Saved user profile');
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  }, [isAuthenticated, userProfile]);

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.9, experience: '15 years', available: 'Today 2:00 PM', location: 'Downtown Medical Center' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'General Physician', rating: 4.8, experience: '12 years', available: 'Tomorrow 10:00 AM', location: 'City Health Clinic' },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Dermatologist', rating: 4.9, experience: '10 years', available: 'Today 4:30 PM', location: 'Wellness Medical Plaza' }
  ];

  const mealPlan = {
    breakfast: { name: 'Greek Yogurt Bowl', calories: 350, protein: '20g', carbs: '45g', fat: '8g' },
    lunch: { name: 'Grilled Chicken Salad', calories: 450, protein: '35g', carbs: '30g', fat: '15g' },
    dinner: { name: 'Salmon with Quinoa', calories: 550, protein: '40g', carbs: '50g', fat: '18g' },
    snack: { name: 'Mixed Nuts & Apple', calories: 200, protein: '6g', carbs: '25g', fat: '10g' }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    
    try {
      if (authMode === 'signup') {
        // Validate passwords
        if (authForm.password !== authForm.confirmPassword) {
          throw new Error('Passwords do not match!');
        }
        if (authForm.password.length < 8) {
          throw new Error('Password must be at least 8 characters long!');
        }
        
        // Password strength check
        const hasUpperCase = /[A-Z]/.test(authForm.password);
        const hasLowerCase = /[a-z]/.test(authForm.password);
        const hasNumbers = /\d/.test(authForm.password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(authForm.password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
          throw new Error('Password must contain uppercase, lowercase, and numbers!');
        }
        
        // Call secure API for signup
        const response = await secureAPICall('/auth/signup', 'POST', {
          name: authForm.name,
          email: authForm.email.toLowerCase().trim(),
          password: authForm.password,
          phone: authForm.phone,
          location: authForm.location,
          dateOfBirth: authForm.dateOfBirth,
          gender: authForm.gender
        });
        
        // Store token securely
        localStorage.setItem('authToken', response.token);
        
        // Set user profile (password is never stored in frontend)
        setUserProfile(response.user);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setActiveTab('home');
        
      } else {
        // Sign in - call secure API
        const response = await secureAPICall('/auth/signin', 'POST', {
          email: authForm.email.toLowerCase().trim(),
          password: authForm.password
        });
        
        // Store token securely
        localStorage.setItem('authToken', response.token);
        
        // Set user profile (password is never stored in frontend)
        setUserProfile(response.user);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setActiveTab('home');
      }
      
      // Clear form
      setAuthForm({ 
        email: '', 
        password: '', 
        name: '', 
        confirmPassword: '',
        phone: '',
        location: '',
        dateOfBirth: '',
        gender: ''
      });
      
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    setIsAuthenticated(false);
    setUserProfile(null);
    setShowUserMenu(false);
    setActiveTab('home');
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setChatMessages([...chatMessages, 
        { type: 'user', text: userInput },
        { type: 'bot', text: "I understand you're looking for help with that. Let me connect you with the right specialist!" }
      ]);
      setUserInput('');
    }
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Complete AI Health Companion
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Revolutionizing healthcare access and personal wellness through AI-powered appointment booking, doctor discovery, and personalized nutrition & fitness planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('healthcare');
                } else {
                  setShowAuthModal(true);
                  setAuthMode('signin');
                }
              }}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Try Healthcare Demo
            </button>
            <button 
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('nutrition');
                } else {
                  setShowAuthModal(true);
                  setAuthMode('signin');
                }
              }}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl"
            >
              Try Nutrition Demo
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition">
            <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="text-blue-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Healthcare Appointment & Triage</h3>
            <p className="text-gray-600 mb-6">AI-powered front desk for clinics and personal assistant for patients</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Location & specialty-based doctor finder</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Automated appointment booking & reminders</span>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">AI chatbot for health queries</span>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Insurance compatibility checker</span>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Multi-language support</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-2">Model: B2B Subscription</p>
              <p className="text-sm text-gray-600">$0.50 per appointment + service charges</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition">
            <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Activity className="text-green-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nutrition & Fitness Planner</h3>
            <p className="text-gray-600 mb-6">Personalized AI-powered wellness and fitness planning</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Utensils className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Personalized diet & meal plans</span>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Custom workout routines</span>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Calorie tracking & progress monitoring</span>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Wearable device integration</span>
              </div>
              <div className="flex items-start gap-3">
                <Bell className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Habit coaching & meditation guides</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-2">Model: B2C & B2B</p>
              <p className="text-sm text-gray-600">$5/month (B2C) | $25/trainer (B2B)</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-xl p-8 md:p-12 text-white max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-6 text-center">Market Opportunity</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">$350B+</div>
              <div className="text-blue-100">Global Digital Health Market by 2027</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">70%</div>
              <div className="text-blue-100">of patients prefer online booking</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$72B</div>
              <div className="text-blue-100">Fitness app market by 2028</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthcare = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <button 
          onClick={() => setActiveTab('home')}
          className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
        >
          ← Back to Home
        </button>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Healthcare Appointment System</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Find a Doctor</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city or zip code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Specialty</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Specialties</option>
                    <option value="cardiologist">Cardiologist</option>
                    <option value="general">General Physician</option>
                    <option value="dermatologist">Dermatologist</option>
                    <option value="pediatrician">Pediatrician</option>
                  </select>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Search Doctors
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="text-blue-600" size={24} />
                AI Assistant
              </h3>
              <div className="h-64 overflow-y-auto mb-4 space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Doctors Near You</h3>
              
              <div className="space-y-4">
                {doctors.map(doctor => (
                  <div key={doctor.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{doctor.name}</h4>
                        <p className="text-blue-600 font-semibold">{doctor.specialty}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                          ★ {doctor.rating}
                        </div>
                        <p className="text-sm text-gray-600">{doctor.experience}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-gray-400" />
                        {doctor.location}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={16} className="text-gray-400" />
                        {doctor.available}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSelectedDoctor(doctor)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Book Appointment
                      </button>
                      <button className="px-6 border border-blue-600 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Book Appointment</h3>
              <p className="text-gray-600 mb-6">with {selectedDoctor.name}</p>
              
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  defaultValue={userProfile?.name || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  defaultValue={userProfile?.email || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <textarea
                  placeholder="Reason for visit (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-24"
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedDoctor(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNutrition = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <button 
          onClick={() => setActiveTab('home')}
          className="mb-6 text-green-600 hover:text-green-800 font-semibold flex items-center gap-2"
        >
          ← Back to Home
        </button>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Personalized Nutrition & Fitness</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Goal</label>
                  <select
                    value={dietGoal}
                    onChange={(e) => setDietGoal(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select goal</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="endurance">Endurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dietary Restrictions</label>
                  <div className="space-y-2">
                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dietaryRestrictions.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDietaryRestrictions([...dietaryRestrictions, option]);
                            } else {
                              setDietaryRestrictions(dietaryRestrictions.filter(r => r !== option));
                            }
                          }}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                  Generate Plan
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Calories</span>
                    <span className="font-semibold">1,550</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protein Target</span>
                    <span className="font-semibold">101g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly Workouts</span>
                    <span className="font-semibold">5 sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Today's Meal Plan</h3>
              
              <div className="space-y-4">
                {Object.entries(mealPlan).map(([meal, details]) => (
                  <div key={meal} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 capitalize">{meal}</h4>
                        <p className="text-green-600 font-semibold">{details.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{details.calories}</div>
                        <div className="text-xs text-gray-600">calories</div>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Protein: {details.protein}</span>
                      <span>Carbs: {details.carbs}</span>
                      <span>Fat: {details.fat}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Daily Intake</span>
                  <span className="text-2xl font-bold text-green-600">1,550 cal</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Today's Workout</h3>
              
              <div className="space-y-3">
                {[
                  { exercise: 'Warm-up: Light cardio', duration: '10 min', intensity: 'Low' },
                  { exercise: 'Strength: Upper body', duration: '25 min', intensity: 'High' },
                  { exercise: 'Core exercises', duration: '15 min', intensity: 'Medium' },
                  { exercise: 'Cool-down & stretching', duration: '10 min', intensity: 'Low' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.exercise}</h4>
                      <p className="text-sm text-gray-600">{item.duration}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.intensity === 'High' ? 'bg-red-100 text-red-700' :
                      item.intensity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.intensity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">7</div>
                  <div className="text-sm text-gray-600">Days Streak</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">-2.5kg</div>
                  <div className="text-sm text-gray-600">Weight Lost</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">12</div>
                  <div className="text-sm text-gray-600">Workouts Done</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Heart className="text-blue-600" size={32} />
              <span className="text-2xl font-bold text-gray-900">AI Health Companion</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('home')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'home' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    setActiveTab('healthcare');
                  } else {
                    setShowAuthModal(true);
                    setAuthMode('signin');
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'healthcare' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Healthcare
              </button>
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    setActiveTab('nutrition');
                  } else {
                    setShowAuthModal(true);
                    setAuthMode('signin');
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'nutrition' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Nutrition
              </button>

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={() => {
                      setShowAuthModal(true);
                      setAuthMode('signin');
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition"
                  >
                    <LogIn size={20} />
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      setShowAuthModal(true);
                      setAuthMode('signup');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="relative ml-4">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-green-50 hover:from-blue-100 hover:to-green-100 rounded-lg font-semibold transition border border-gray-200"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {userProfile?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-900">{userProfile?.name}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {userProfile?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{userProfile?.name}</p>
                            <p className="text-sm text-gray-600">{userProfile?.email}</p>
                          </div>
                        </div>
                        {userProfile?.phone && (
                          <div className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                            <Phone size={14} />
                            {userProfile?.phone}
                          </div>
                        )}
                        {userProfile?.location && (
                          <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <MapPinIcon size={14} />
                            {userProfile?.location}
                          </div>
                        )}
                      </div>
                      <button 
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                      >
                        <User size={18} />
                        My Profile
                      </button>
                      <button 
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                      >
                        <Calendar size={18} />
                        My Appointments
                      </button>
                      <button 
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                      >
                        <Activity size={18} />
                        Health Dashboard
                      </button>
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button 
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                        >
                          <LogOut size={18} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {authMode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
                </h3>
                <p className="text-gray-600">
                  {authMode === 'signin' 
                    ? 'Sign in to access your health companion' 
                    : 'Join us to start your personalized health journey'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError('');
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <Shield className="flex-shrink-0" size={20} />
                <span>{authError}</span>
              </div>
            )}

            {/* Security Notice
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-900">
                <strong>🔒 Your data is secure:</strong> We use industry-standard encryption (bcrypt + JWT) to protect your information. Your password is never stored in plain text.
              </div>
            </div> */}
            
            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {authMode === 'signup' ? (
                <>
                  {/* Sign Up Form */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <UserCircle className="inline mr-2" size={16} />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={authForm.name}
                        onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="inline mr-2" size={16} />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={authForm.email}
                        onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="inline mr-2" size={16} />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={authForm.phone}
                        onChange={(e) => setAuthForm({...authForm, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPinIcon className="inline mr-2" size={16} />
                        Location (City) *
                      </label>
                      <input
                        type="text"
                        required
                        value={authForm.location}
                        onChange={(e) => setAuthForm({...authForm, location: e.target.value})}
                        placeholder="New York, NY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        value={authForm.dateOfBirth}
                        onChange={(e) => setAuthForm({...authForm, dateOfBirth: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        required
                        value={authForm.gender}
                        onChange={(e) => setAuthForm({...authForm, gender: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="inline mr-2" size={16} />
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={authForm.password}
                        onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                        placeholder="Min 8 chars, uppercase, number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must contain: uppercase, lowercase, number
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="inline mr-2" size={16} />
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={authForm.confirmPassword}
                        onChange={(e) => setAuthForm({...authForm, confirmPassword: e.target.value})}
                        placeholder="Re-enter password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-gray-700">
                    <strong>Why we need this information:</strong>
                    <ul className="mt-2 ml-5 list-disc space-y-1">
                      <li>To personalize your health recommendations</li>
                      <li>To connect you with doctors in your area</li>
                      <li>To send appointment reminders and updates</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  {/* Sign In Form */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="inline mr-2" size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={authForm.email}
                      onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Lock className="inline mr-2" size={16} />
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={authForm.password}
                      onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Remember me</span>
                    </label>
                    <button type="button" className="text-blue-600 hover:text-blue-800 font-semibold">
                      Forgot password?
                    </button>
                  </div>
                </>
              )}
              
              <button 
                type="submit"
                disabled={authLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition text-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  authMode === 'signin' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                  setAuthError('');
                  setAuthForm({ 
                    email: '', 
                    password: '', 
                    name: '', 
                    confirmPassword: '',
                    phone: '',
                    location: '',
                    dateOfBirth: '',
                    gender: ''
                  });
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                {authMode === 'signin' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'home' && renderHome()}
      {activeTab === 'healthcare' && renderHealthcare()}
      {activeTab === 'nutrition' && renderNutrition()}

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="text-blue-400" size={24} />
                <span className="text-xl font-bold">AI Health Companion</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transforming healthcare access and personal wellness through AI innovation.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Healthcare</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Find Doctors</li>
                <li>Book Appointments</li>
                <li>AI Assistant</li>
                <li>Clinic Dashboard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Wellness</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Meal Planning</li>
                <li>Workout Routines</li>
                <li>Progress Tracking</li>
                <li>Habit Coaching</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Pricing</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 AI Health Companion. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

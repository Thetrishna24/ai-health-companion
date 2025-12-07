import React, { useState } from 'react';
import { Calendar, Activity, Heart, MapPin, Clock, MessageSquare, Utensils, TrendingUp, Shield, Globe, Bell } from 'lucide-react';
import './App.css';

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
          {/* <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🚀 AI Health Innovation
          </div> */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Complete AI Health Companion
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Revolutionizing healthcare access and personal wellness through AI-powered appointment booking, doctor discovery, and personalized nutrition & fitness planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => setActiveTab('healthcare')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Try Healthcare Demo
            </button>
            <button 
              onClick={() => setActiveTab('nutrition')}
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
              <p className="text-sm font-semibold text-gray-900 mb-2"> Model: B2B Subscription</p>
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
              <p className="text-sm font-semibold text-gray-900 mb-2"> Model: B2C & B2B</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
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
            <div className="flex gap-4">
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
                onClick={() => setActiveTab('healthcare')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'healthcare' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Healthcare
              </button>
              <button 
                onClick={() => setActiveTab('nutrition')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'nutrition' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Nutrition
              </button>
            </div>
          </div>
        </div>
      </nav>

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

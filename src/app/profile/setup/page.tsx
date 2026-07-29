'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Check, User, Target, Activity, 
  Apple, Dumbbell, Moon, Stethoscope, Sparkles, Heart
} from 'lucide-react';
import { useStore } from '@/lib/store';

const steps = [
  { title: 'Basic Info', icon: User, description: 'Tell us about yourself' },
  { title: 'Body Info', icon: Activity, description: 'Your current measurements' },
  { title: 'Goals', icon: Target, description: 'What do you want to achieve?' },
  { title: 'Activity Level', icon: Dumbbell, description: 'How active are you?' },
  { title: 'Diet', icon: Apple, description: 'Dietary preferences' },
  { title: 'Experience', icon: Sparkles, description: 'Workout experience' },
  { title: 'Medical', icon: Stethoscope, description: 'Health conditions' },
  { title: 'Sleep & Recovery', icon: Moon, description: 'Recovery habits' },
];

const goals = [
  'Lose Weight', 'Build Muscle', 'Stay Fit', 'Improve Endurance',
  'Better Sleep', 'Stress Management', 'Overall Health'
];

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
  { value: 'light', label: 'Lightly Active', desc: '1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', desc: '3-5 days/week' },
  { value: 'active', label: 'Active', desc: '6-7 days/week' },
  { value: 'very-active', label: 'Very Active', desc: 'Athlete level' },
];

const dietOptions = [
  'No Preference', 'Vegetarian', 'Vegan', 'Non-Vegetarian',
  'Keto', 'Paleo', 'Mediterranean'
];

const experienceLevels = [
  { value: 'beginner', label: 'Beginner', desc: 'New to fitness' },
  { value: 'intermediate', label: 'Intermediate', desc: '1-3 years experience' },
  { value: 'advanced', label: 'Advanced', desc: '3+ years experience' },
];

const medicalConditions = [
  'None', 'Diabetes', 'Hypertension', 'Heart Disease',
  'Asthma', 'Arthritis', 'Back Pain', 'PCOS', 'Thyroid'
];

export default function ProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '', gender: '', height: '', weight: '',
    targetWeight: '', goal: '',
    activityLevel: '', dietPreference: '',
    workoutExperience: '', medicalConditions: [] as string[],
    sleepHours: '', targetCalories: '',
  });
  const socialLogin = useStore((s) => s.socialLogin);

  const update = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMedical = (cond: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalConditions: prev.medicalConditions.includes(cond)
        ? prev.medicalConditions.filter((c) => c !== cond)
        : [...prev.medicalConditions, cond],
    }));
  };

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const complete = () => {
    socialLogin('email', 'User', 'user@vitalxai.com');
    window.location.href = '/dashboard';
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1.5 bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-between px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                {(() => {
                  const Icon = steps[currentStep].icon;
                  return <Icon className="w-5 h-5 text-white" />;
                })()}
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">{steps[currentStep].title}</h2>
                <p className="text-white/50 text-sm">{steps[currentStep].description}</p>
              </div>
            </div>
            <span className="text-white/40 text-sm">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Step dots */}
          <div className="flex gap-2 px-6 mt-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  i <= currentStep
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="p-6 min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 0: Basic Info */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-1.5">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => update('age', e.target.value)}
                          placeholder="25"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-1.5">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => update('gender', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="" className="bg-gray-900">Select</option>
                          <option value="male" className="bg-gray-900">Male</option>
                          <option value="female" className="bg-gray-900">Female</option>
                          <option value="other" className="bg-gray-900">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Body Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-1.5">Height (cm)</label>
                        <input
                          type="number"
                          value={formData.height}
                          onChange={(e) => update('height', e.target.value)}
                          placeholder="175"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-1.5">Weight (kg)</label>
                        <input
                          type="number"
                          value={formData.weight}
                          onChange={(e) => update('weight', e.target.value)}
                          placeholder="75"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1.5">Target Weight (kg)</label>
                      <input
                        type="number"
                        value={formData.targetWeight}
                        onChange={(e) => update('targetWeight', e.target.value)}
                        placeholder="70"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Goals */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-2 gap-3">
                    {goals.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => update('goal', goal)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.goal === goal
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Heart className={`w-4 h-4 ${formData.goal === goal ? 'text-purple-400' : 'text-white/30'}`} />
                          <span className="text-sm font-medium">{goal}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3: Activity Level */}
                {currentStep === 3 && (
                  <div className="space-y-3">
                    {activityLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => update('activityLevel', level.value)}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                          formData.activityLevel === level.value
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          formData.activityLevel === level.value ? 'bg-purple-500' : 'bg-white/10'
                        }`}>
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{level.label}</p>
                          <p className="text-sm opacity-60">{level.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 4: Diet */}
                {currentStep === 4 && (
                  <div className="grid grid-cols-2 gap-3">
                    {dietOptions.map((diet) => (
                      <button
                        key={diet}
                        onClick={() => update('dietPreference', diet)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          formData.dietPreference === diet
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <Apple className={`w-5 h-5 mx-auto mb-2 ${formData.dietPreference === diet ? 'text-purple-400' : 'text-white/30'}`} />
                        <span className="text-sm">{diet}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 5: Experience */}
                {currentStep === 5 && (
                  <div className="space-y-3">
                    {experienceLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => update('workoutExperience', level.value)}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                          formData.workoutExperience === level.value
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          formData.workoutExperience === level.value ? 'bg-purple-500' : 'bg-white/10'
                        }`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{level.label}</p>
                          <p className="text-sm opacity-60">{level.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 6: Medical */}
                {currentStep === 6 && (
                  <div className="grid grid-cols-3 gap-2">
                    {medicalConditions.map((cond) => (
                      <button
                        key={cond}
                        onClick={() => toggleMedical(cond)}
                        className={`p-3 rounded-xl border text-center text-sm transition-all ${
                          formData.medicalConditions.includes(cond)
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {formData.medicalConditions.includes(cond) && (
                          <Check className="w-3 h-3 text-purple-400 mx-auto mb-1" />
                        )}
                        {cond}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 7: Sleep */}
                {currentStep === 7 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-1.5">Average Sleep Hours</label>
                      <input
                        type="number"
                        value={formData.sleepHours}
                        onChange={(e) => update('sleepHours', e.target.value)}
                        placeholder="7"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1.5">Daily Target Calories</label>
                      <input
                        type="number"
                        value={formData.targetCalories}
                        onChange={(e) => update('targetCalories', e.target.value)}
                        placeholder="2200"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between px-6 pb-6">
            <button
              onClick={prev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-95"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={complete}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

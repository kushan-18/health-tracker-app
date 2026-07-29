import { User } from './types'

const COMPLETED_PROFILES_KEY = 'vitalx_completed_profiles'
const USER_PROFILES_KEY = 'vitalx_user_profiles'

const DEFAULT_PRESET_PROFILES: Record<string, Partial<User>> = {
  'kushandholiya@gmail.com': {
    name: 'Kushan Dholiya',
    email: 'kushandholiya@gmail.com',
    age: 24,
    gender: 'male',
    height: 178,
    weight: 72,
    targetWeight: 70,
    goal: 'Gain Muscle',
    activityLevel: 'active',
    dietPreference: 'High Protein',
    workoutExperience: 'Intermediate',
    medicalConditions: [],
    sleepSchedule: '23:00 - 07:00',
    waterIntake: 10,
    targetCalories: 2600,
  },
  'kushan23413@gmail.com': {
    name: 'Kushan',
    email: 'kushan23413@gmail.com',
    age: 24,
    gender: 'male',
    height: 175,
    weight: 70,
    targetWeight: 68,
    goal: 'Improve Fitness',
    activityLevel: 'moderate',
    dietPreference: 'None',
    workoutExperience: 'Beginner',
    medicalConditions: [],
    sleepSchedule: '22:30 - 06:30',
    waterIntake: 8,
    targetCalories: 2400,
  },
  'techexpertise26@gmail.com': {
    name: 'jeet',
    email: 'techexpertise26@gmail.com',
    age: 26,
    gender: 'male',
    height: 180,
    weight: 75,
    targetWeight: 72,
    goal: 'Athletic Performance',
    activityLevel: 'very_active',
    dietPreference: 'None',
    workoutExperience: 'Advanced',
    medicalConditions: [],
    sleepSchedule: '23:30 - 07:30',
    waterIntake: 12,
    targetCalories: 2800,
  },
}

export function hasCompletedSetup(email: string): boolean {
  if (!email) return false
  const normEmail = email.toLowerCase()
  if (DEFAULT_PRESET_PROFILES[normEmail]) return true
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(COMPLETED_PROFILES_KEY)
    if (!raw) return false
    const completedMap: Record<string, boolean> = JSON.parse(raw)
    return !!completedMap[normEmail]
  } catch (e) {
    return false
  }
}

export function getSavedProfile(email: string, defaultName?: string): User | null {
  if (!email) return null
  const normEmail = email.toLowerCase()

  if (typeof window !== 'undefined') {
    try {
      const rawProfiles = localStorage.getItem(USER_PROFILES_KEY)
      if (rawProfiles) {
        const profilesMap: Record<string, User> = JSON.parse(rawProfiles)
        if (profilesMap[normEmail]) {
          return profilesMap[normEmail]
        }
      }
    } catch (e) {}
  }

  if (DEFAULT_PRESET_PROFILES[normEmail]) {
    const preset = DEFAULT_PRESET_PROFILES[normEmail]
    return {
      id: 'user_' + normEmail.replace(/[^a-z0-9]/gi, ''),
      name: preset.name || defaultName || normEmail.split('@')[0],
      email: normEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${preset.name || normEmail}`,
      age: preset.age || 25,
      gender: preset.gender || 'male',
      height: preset.height || 175,
      weight: preset.weight || 70,
      targetWeight: preset.targetWeight || 68,
      goal: preset.goal || 'Improve Fitness',
      activityLevel: preset.activityLevel || 'moderate',
      medicalConditions: preset.medicalConditions || [],
      dietPreference: preset.dietPreference || 'None',
      workoutExperience: preset.workoutExperience || 'Intermediate',
      sportsPlayed: [],
      sleepSchedule: preset.sleepSchedule || '23:00 - 07:00',
      waterIntake: preset.waterIntake || 8,
      targetCalories: preset.targetCalories || 2200,
      bodyFat: 0,
      createdAt: new Date().toISOString(),
    }
  }

  return null
}

export function saveProfileSetup(email: string, userDetails: Partial<User>): User {
  const normEmail = email.toLowerCase()
  const existing = getSavedProfile(normEmail, userDetails.name)

  const updatedUser: User = {
    id: existing?.id || 'user_' + Date.now(),
    name: userDetails.name || existing?.name || normEmail.split('@')[0],
    email: normEmail,
    avatar: userDetails.avatar || existing?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${normEmail}`,
    age: userDetails.age ?? existing?.age ?? 25,
    gender: userDetails.gender || existing?.gender || 'male',
    height: userDetails.height ?? existing?.height ?? 175,
    weight: userDetails.weight ?? existing?.weight ?? 70,
    targetWeight: userDetails.targetWeight ?? existing?.targetWeight ?? 68,
    goal: userDetails.goal || existing?.goal || 'Improve Fitness',
    activityLevel: userDetails.activityLevel || existing?.activityLevel || 'moderate',
    medicalConditions: userDetails.medicalConditions || existing?.medicalConditions || [],
    dietPreference: userDetails.dietPreference || existing?.dietPreference || 'None',
    workoutExperience: userDetails.workoutExperience || existing?.workoutExperience || 'Intermediate',
    sportsPlayed: userDetails.sportsPlayed || existing?.sportsPlayed || [],
    sleepSchedule: userDetails.sleepSchedule || existing?.sleepSchedule || '23:00 - 07:00',
    waterIntake: userDetails.waterIntake ?? existing?.waterIntake ?? 8,
    targetCalories: userDetails.targetCalories ?? existing?.targetCalories ?? 2200,
    bodyFat: userDetails.bodyFat ?? existing?.bodyFat ?? 0,
    createdAt: existing?.createdAt || new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    try {
      const rawCompleted = localStorage.getItem(COMPLETED_PROFILES_KEY)
      const completedMap: Record<string, boolean> = rawCompleted ? JSON.parse(rawCompleted) : {}
      completedMap[normEmail] = true
      localStorage.setItem(COMPLETED_PROFILES_KEY, JSON.stringify(completedMap))

      const rawProfiles = localStorage.getItem(USER_PROFILES_KEY)
      const profilesMap: Record<string, User> = rawProfiles ? JSON.parse(rawProfiles) : {}
      profilesMap[normEmail] = updatedUser
      localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(profilesMap))
    } catch (e) {}
  }

  return updatedUser
}
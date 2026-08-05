'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ChevronDown, Eye, EyeOff, ArrowLeft, MinusCircle, Check } from 'lucide-react'

export interface GoogleAccount {
  name: string
  email: string
  initial: string
  color: string
  avatar?: string
}

export const defaultGoogleAccounts: GoogleAccount[] = [
  { name: 'Kushan Dholiya', email: 'kushandholiya@gmail.com', initial: 'K', color: 'bg-[#7e57c2]' },
  { name: 'jeet', email: 'techexpertise26@gmail.com', initial: 'j', color: 'bg-[#546e7a]' },
  { name: 'kushan', email: 'kushan23413@gmail.com', initial: 'k', color: 'bg-[#7e57c2]' },
  { name: '', email: 'r9590171@gmail.com', initial: 'r', color: 'bg-[#d84315]' },
  { name: '', email: 'v98625532@gmail.com', initial: 'v', color: 'bg-[#78909c]' },
]

const AVATAR_COLORS = [
  'bg-[#7e57c2]',
  'bg-[#546e7a]',
  'bg-[#d84315]',
  'bg-[#78909c]',
  'bg-[#00897b]',
  'bg-[#c2185b]',
  'bg-[#1976d2]',
]

function getAvatarColor(email: string) {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

interface GoogleAccountChooserModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectAccount: (account: { name: string; email: string }) => void
  appName?: string
}

export default function GoogleAccountChooserModal({
  isOpen,
  onClose,
  onSelectAccount,
  appName = 'vitalx-ai',
}: GoogleAccountChooserModalProps) {
  const [accounts, setAccounts] = useState<GoogleAccount[]>(defaultGoogleAccounts)
  const [googleStep, setGoogleStep] = useState<'choose' | 'password' | 'custom'>('choose')
  const [isRemoving, setIsRemoving] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<GoogleAccount | null>(null)
  const [password, setPassword] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  const [customName, setCustomName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load saved accounts from localStorage
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem('vitalx_google_accounts')
      const list: GoogleAccount[] = saved ? JSON.parse(saved) : defaultGoogleAccounts
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAccounts(list)
    } catch (e) {
      setAccounts(defaultGoogleAccounts)
    }
  }, [isOpen])

  const saveAccountsToStorage = (updated: GoogleAccount[]) => {
    setAccounts(updated)
    try {
      localStorage.setItem('vitalx_google_accounts', JSON.stringify(updated))
    } catch (e) {}
  }

  if (!isOpen) return null

  const handleAccountClick = (account: GoogleAccount) => {
    if (isRemoving) {
      // Remove this account from saved accounts
      const updated = accounts.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase())
      saveAccountsToStorage(updated)
      if (updated.length === 0) {
        setIsRemoving(false)
      }
      return
    }
    setSelectedAccount(account)
    setPassword('')
    setError('')
    setGoogleStep('password')
  }

  const handleCustomAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customEmail || !customEmail.includes('@')) {
      setError('Enter a valid email address')
      return
    }

    const nameFromEmail = customName || customEmail.split('@')[0]
    const customAcc: GoogleAccount = {
      name: nameFromEmail,
      email: customEmail,
      initial: (nameFromEmail[0] || 'U').toUpperCase(),
      color: getAvatarColor(customEmail),
    }

    // Save to list
    const updated = [customAcc, ...accounts.filter((a) => a.email.toLowerCase() !== customEmail.toLowerCase())]
    saveAccountsToStorage(updated)

    setSelectedAccount(customAcc)
    setPassword('')
    setError('')
    setGoogleStep('password')
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError('Enter a password')
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      if (selectedAccount) {
        // Save account to stored list
        const updated = [
          selectedAccount,
          ...accounts.filter((a) => a.email.toLowerCase() !== selectedAccount.email.toLowerCase()),
        ]
        saveAccountsToStorage(updated)

        onSelectAccount({
          name: selectedAccount.name || selectedAccount.email.split('@')[0],
          email: selectedAccount.email,
        })
      }
    }, 1000)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0e0f]/85 backdrop-blur-md p-4 overflow-y-auto font-sans"
      >
        {/* Main Card Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-[480px] w-full bg-[#1e1f20] text-gray-200 rounded-[28px] border border-[#2d2f31] p-8 shadow-2xl overflow-hidden"
        >
          {/* Google Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-gray-200 text-sm font-medium">Sign in with Google</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* STEP 1: Account Chooser */}
          {googleStep === 'choose' && (
            <div>
              <div className="mt-8">
                <h1 className="text-3xl font-normal text-white tracking-tight">
                  {isRemoving ? 'Remove an account' : 'Choose an account'}
                </h1>
                <p className="text-sm text-gray-300 mt-2 font-normal">
                  {isRemoving
                    ? 'Select an account to remove from this browser'
                    : `to continue to `}
                  {!isRemoving && <span className="font-semibold text-[#8ab4f8]">{appName}</span>}
                </p>
              </div>

              {/* Accounts List */}
              <div className="mt-8 space-y-1">
                {accounts.map((acc, index) => (
                  <button
                    key={acc.email + index}
                    onClick={() => handleAccountClick(acc)}
                    className="w-full flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-[#2a2b2e] transition-colors text-left border-b border-[#2d2f31]/60 last:border-b-0 group relative"
                  >
                    {acc.avatar ? (
                      <img src={acc.avatar} alt={acc.name} className="h-10 w-10 rounded-full bg-gray-700 shrink-0" />
                    ) : (
                      <div
                        className={`h-10 w-10 rounded-full ${acc.color || 'bg-purple-600'} flex items-center justify-center text-white text-base font-medium shrink-0 uppercase shadow-inner`}
                      >
                        {acc.initial || acc.email[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {acc.name ? (
                        <>
                          <p className="text-sm font-medium text-gray-100 group-hover:text-white transition-colors truncate">
                            {acc.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{acc.email}</p>
                        </>
                      ) : (
                        <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                          {acc.email}
                        </p>
                      )}
                    </div>
                    {isRemoving && (
                      <MinusCircle className="h-5 w-5 text-red-400 shrink-0 hover:scale-110 transition-transform" />
                    )}
                  </button>
                ))}

                {!isRemoving && (
                  <>
                    {/* Use another account */}
                    <button
                      onClick={() => {
                        setCustomEmail('')
                        setCustomName('')
                        setError('')
                        setGoogleStep('custom')
                      }}
                      className="w-full flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-[#2a2b2e] transition-colors text-left border-t border-[#2d2f31] mt-2 group"
                    >
                      <div className="h-10 w-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 shrink-0 group-hover:border-gray-400 group-hover:text-white transition-colors">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                        Use another account
                      </span>
                    </button>

                    {/* Remove an account button */}
                    {accounts.length > 0 && (
                      <button
                        onClick={() => setIsRemoving(true)}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#2a2b2e]/60 transition-colors text-left text-xs text-gray-400 hover:text-gray-200 mt-1"
                      >
                        <MinusCircle className="h-4 w-4 text-gray-400" />
                        <span>Remove an account from list</span>
                      </button>
                    )}
                  </>
                )}

                {isRemoving && (
                  <button
                    onClick={() => setIsRemoving(false)}
                    className="w-full mt-4 py-2.5 rounded-full bg-[#8ab4f8] text-[#040c1e] text-sm font-semibold hover:bg-[#a8c7fa] transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Done
                  </button>
                )}
              </div>

              {/* Disclaimer */}
              {!isRemoving && (
                <div className="mt-8 pt-6 border-t border-[#2d2f31]/60 text-xs text-gray-400 leading-relaxed">
                  Before using this app, you can review {appName}&apos;s{' '}
                  <a href="#" className="text-[#8ab4f8] font-medium hover:underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#8ab4f8] font-medium hover:underline">
                    Terms of Service
                  </a>
                  .
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Password Entry */}
          {googleStep === 'password' && selectedAccount && (
            <form onSubmit={handlePasswordSubmit} className="mt-6">
              <button
                type="button"
                onClick={() => setGoogleStep('choose')}
                className="flex items-center gap-1.5 text-xs text-[#8ab4f8] hover:underline mb-4"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Choose a different account
              </button>

              <h1 className="text-2xl font-normal text-white mb-2">Welcome</h1>

              {/* Selected account info box */}
              <div className="flex items-center gap-3 p-3 rounded-full bg-[#2a2b2e]/80 border border-[#3c4043] my-4">
                <div
                  className={`h-7 w-7 rounded-full ${selectedAccount.color || 'bg-purple-600'} flex items-center justify-center text-white text-xs font-semibold`}
                >
                  {selectedAccount.initial || selectedAccount.email[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium text-gray-200 truncate flex-1">{selectedAccount.email}</span>
                <ChevronDown className="h-4 w-4 text-gray-400 mr-1" />
              </div>

              <p className="text-sm text-gray-300 mt-6 mb-2">To continue, first verify it&apos;s you</p>

              <div className="relative my-3">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="w-full h-13 px-4 rounded-lg bg-transparent border border-gray-500 text-white text-sm focus:outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && <p className="text-xs text-red-400 mt-1 mb-2">{error}</p>}

              <div className="flex items-center justify-between mt-8">
                <button type="button" className="text-sm text-[#8ab4f8] font-medium hover:underline">
                  Forgot password?
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#8ab4f8] text-[#040c1e] text-sm font-semibold hover:bg-[#a8c7fa] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Signing in...' : 'Next'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Custom Account Email */}
          {googleStep === 'custom' && (
            <form onSubmit={handleCustomAccountSubmit} className="mt-6">
              <button
                type="button"
                onClick={() => setGoogleStep('choose')}
                className="flex items-center gap-1.5 text-xs text-[#8ab4f8] hover:underline mb-4"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to accounts
              </button>

              <h1 className="text-2xl font-normal text-white mb-2">Sign in with Google</h1>
              <p className="text-sm text-gray-300 mb-6">
                Enter your Google account details to continue to{' '}
                <span className="font-semibold text-[#8ab4f8]">{appName}</span>
              </p>

              <div className="space-y-4 my-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Your Name (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Kushan Dholiya"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg bg-transparent border border-gray-500 text-white text-sm focus:outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Google Email address</label>
                  <input
                    type="email"
                    placeholder="you@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    autoFocus
                    required
                    className="w-full h-12 px-4 rounded-lg bg-transparent border border-gray-500 text-white text-sm focus:outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] transition-all"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

              <div className="flex items-center justify-between mt-8">
                <button type="button" className="text-sm text-[#8ab4f8] font-medium hover:underline">
                  Create account
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#8ab4f8] text-[#040c1e] text-sm font-semibold hover:bg-[#a8c7fa] transition-colors"
                >
                  Next
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Footer info below card */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-6 max-w-[480px] w-full px-3">
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300">
            <span>English (United States)</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Help</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

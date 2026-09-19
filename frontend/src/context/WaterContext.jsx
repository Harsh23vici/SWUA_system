import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { INITIAL_ASSESSMENT_STATE, SAMPLE_PROFILES } from '../data/sampleProfiles';

const WaterContext = createContext();

export function WaterProvider({ children }) {
  const [formData, setFormData] = useState(INITIAL_ASSESSMENT_STATE);
  const [calculationResult, setCalculationResult] = useState(null);
  const [wastageAnalysis, setWastageAnalysis] = useState(null);
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'assessment' | 'dashboard' | 'chat'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am **Aqua Advisor**, your water conservation guide. Complete the quick usage assessment or ask me anything about reducing water waste at home!',
      sources: [],
      timestamp: new Date().toISOString(),
    }
  ]);

  // Check backend health on mount
  useEffect(() => {
    let isMounted = true;
    api.getHealth()
      .then((health) => {
        if (isMounted) setBackendStatus(health);
      })
      .catch((err) => {
        if (isMounted) setBackendStatus({ status: 'offline', error: err.message });
      });
    return () => { isMounted = false; };
  }, []);

  const updateFormData = useCallback((keyOrValues, value) => {
    if (typeof keyOrValues === 'object' && keyOrValues !== null) {
      setFormData((prev) => ({ ...prev, ...keyOrValues }));
    } else {
      setFormData((prev) => ({ ...prev, [keyOrValues]: value }));
    }
    setError(null);
  }, []);

  const loadSampleProfile = useCallback((profileId) => {
    const profile = SAMPLE_PROFILES.find((p) => p.id === profileId);
    if (profile) {
      setFormData({ ...profile.data });
      return profile;
    }
    return null;
  }, []);

  const runAssessment = useCallback(async (customData = null) => {
    setIsLoading(true);
    setError(null);
    const dataToSubmit = customData || formData;

    try {
      // Calculate and analyze concurrently
      const [calcData, analysisData] = await Promise.all([
        api.calculate(dataToSubmit),
        api.analyze(dataToSubmit),
      ]);

      setCalculationResult(calcData);
      setWastageAnalysis(analysisData);

      // Add contextual proactive note to chat history
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I've analyzed your water assessment! Your household consumes an estimated **${calcData.total_daily_liters} Liters/day** (~${calcData.per_person_daily_liters} L/person/day). Your top potential water saving is **${analysisData.top_wastage_points[0]?.category_name || 'shower/leak optimization'}**. Feel free to ask me how to tackle it!`,
          sources: [],
          timestamp: new Date().toISOString(),
        }
      ]);

      setActiveView('dashboard');
      return { calcData, analysisData };
    } catch (err) {
      setError(err.message || 'Failed to calculate water consumption.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const sendChatMessage = useCallback(async (text) => {
    if (!text || !text.trim()) return;

    const userMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare compact water profile for context
      const profileContext = calculationResult ? {
        num_people: formData.num_people,
        total_daily_liters: calculationResult.total_daily_liters,
        per_person_daily_liters: calculationResult.per_person_daily_liters,
        benchmark_status: calculationResult.benchmark_status,
        category_breakdown: calculationResult.category_breakdown,
        top_wastage_points: wastageAnalysis?.top_wastage_points || [],
      } : null;

      const historyToSend = chatMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.chat(text.trim(), profileContext, historyToSend);

      const assistantReply = {
        role: 'assistant',
        content: res.response,
        sources: res.sources || [],
        is_fallback: res.is_fallback,
        model_used: res.model_used,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, assistantReply]);
      return assistantReply;
    } catch (err) {
      const errorReply = {
        role: 'assistant',
        content: `I'm having difficulty connecting to my knowledge base right now (${err.message}). Please make sure your network and server are running.`,
        sources: [],
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  }, [calculationResult, wastageAnalysis, formData, chatMessages]);

  const resetAssessment = useCallback(() => {
    setFormData(INITIAL_ASSESSMENT_STATE);
    setCalculationResult(null);
    setWastageAnalysis(null);
    setActiveView('assessment');
    setError(null);
  }, []);

  return (
    <WaterContext.Provider
      value={{
        formData,
        updateFormData,
        calculationResult,
        wastageAnalysis,
        activeView,
        setActiveView,
        isLoading,
        error,
        setError,
        backendStatus,
        chatMessages,
        sendChatMessage,
        loadSampleProfile,
        runAssessment,
        resetAssessment,
      }}
    >
      {children}
    </WaterContext.Provider>
  );
}

export function useWater() {
  const context = useContext(WaterContext);
  if (!context) {
    throw new Error('useWater must be used within a WaterProvider');
  }
  return context;
}

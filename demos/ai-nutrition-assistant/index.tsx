'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { createNutritionAssistantSeed } from './seed';
import type {
  DemoChatMessage,
  DemoChatSession,
  DemoFoodLog,
  DemoGoal,
  DemoPage,
  DemoRecipe,
  DisplayUnits,
  NutritionAssistantDemoState,
} from './types';

const STORAGE_KEY = 'portfolio.nutripal.real-demo.v2';
const TODAY = '2026-04-20';

const MASTER_NUTRIENT_MAP: Record<string, { name: string; unit: string }> = {
  calories: { name: 'Calories', unit: 'kcal' },
  protein_g: { name: 'Protein', unit: 'g' },
  carbs_g: { name: 'Carbs', unit: 'g' },
  fat_total_g: { name: 'Total Fat', unit: 'g' },
  fat_saturated_g: { name: 'Saturated Fat', unit: 'g' },
  fiber_g: { name: 'Dietary Fiber', unit: 'g' },
  sugar_g: { name: 'Total Sugars', unit: 'g' },
  sodium_mg: { name: 'Sodium', unit: 'mg' },
  hydration_ml: { name: 'Water', unit: 'ml' },
};

const QUICK_ACTIONS = [
  { id: 'tuna-wrap', label: 'I just ate a tuna wrap' },
  { id: 'chicken-soup', label: 'Log my chicken soup' },
  { id: 'today-summary', label: 'How am I doing today?' },
  { id: 'donut', label: 'If I eat a donut will I be over my sugar limit?' },
  { id: 'audit', label: 'This seems off. Audit my sodium.' },
  { id: 'travel', label: 'Mark today as a travel day' },
] as const;

function loadInitialState() {
  if (typeof window === 'undefined') {
    return createNutritionAssistantSeed();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored
      ? (JSON.parse(stored) as NutritionAssistantDemoState)
      : createNutritionAssistantSeed();
  } catch {
    return createNutritionAssistantSeed();
  }
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getDateKey(logTime: string) {
  return logTime.slice(0, 10);
}

function getTodayLogs(logs: DemoFoodLog[]) {
  return logs.filter((log) => getDateKey(log.log_time) === TODAY);
}

function sumLogs(logs: DemoFoodLog[]) {
  return logs.reduce<Record<string, number>>((accumulator, log) => {
    Object.entries(log).forEach(([key, value]) => {
      if (typeof value === 'number') {
        accumulator[key] = (accumulator[key] || 0) + value;
      }
    });

    return accumulator;
  }, {});
}

function formatNumber(value: number | null | undefined, precision = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'N/A';
  }

  const effectivePrecision = precision === 0 && value > 0 && value < 10 ? 1 : precision;
  return value.toFixed(effectivePrecision);
}

function formatWeight(value: number, units: DisplayUnits) {
  if (units.weight === 'oz') return `${formatNumber(value / 28.3495)} oz`;
  if (units.weight === 'lb') return `${formatNumber(value / 453.592, 1)} lb`;
  return `${formatNumber(value)} g`;
}

function formatVolume(value: number, units: DisplayUnits) {
  if (units.volume === 'oz') return `${formatNumber(value / 29.5735)} oz`;
  if (units.volume === 'L') return `${formatNumber(value / 1000, 1)} L`;
  return `${formatNumber(value)} ml`;
}

function formatEnergy(value: number, units: DisplayUnits) {
  if (units.energy === 'kj') return `${formatNumber(value * 4.184)} kJ`;
  return `${formatNumber(value)} kcal`;
}

function formatNutrientValue(nutrient: string, value: number, units: DisplayUnits) {
  if (nutrient.endsWith('_mg')) return `${formatNumber(value)} mg`;
  if (nutrient.endsWith('_g')) return formatWeight(value, units);
  if (nutrient.endsWith('_ml')) return formatVolume(value, units);
  if (nutrient === 'calories') return formatEnergy(value, units);
  return formatNumber(value);
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function updateSession(
  sessions: DemoChatSession[],
  activeChatId: string,
  updater: (session: DemoChatSession) => DemoChatSession
) {
  return sessions.map((session) =>
    session.id === activeChatId
      ? updater({
          ...session,
          updated_at: new Date(`${TODAY}T19:00:00.000Z`).toISOString(),
        })
      : session
  );
}

function buildSummaryMessage(goals: DemoGoal[], todayLogs: DemoFoodLog[], dayType: string) {
  const totals = sumLogs(todayLogs);
  const calorieGoal = goals.find((goal) => goal.nutrient === 'calories')?.target_value || 0;
  const proteinGoal = goals.find((goal) => goal.nutrient === 'protein_g')?.target_value || 0;
  const waterGoal = goals.find((goal) => goal.nutrient === 'hydration_ml')?.target_value || 0;
  const sodiumGoal = goals.find((goal) => goal.nutrient === 'sodium_mg')?.target_value || 0;

  return [
    `1. Sodium: You're now at ${Math.round(totals.sodium_mg || 0)}mg, which is ${
      (totals.sodium_mg || 0) > sodiumGoal ? 'over' : 'still within'
    } your ${sodiumGoal}mg daily limit${dayType === 'travel' ? ' for a travel day' : ''}.`,
    `2. Water: Great progress with ${formatVolume(totals.hydration_ml || 0, {
      volume: 'oz',
      weight: 'g',
      energy: 'kcal',
    })} out of ${formatVolume(waterGoal, {
      volume: 'oz',
      weight: 'g',
      energy: 'kcal',
    })}.`,
    `3. Protein: Strong progress at ${formatNumber(totals.protein_g || 0)}g toward your ${proteinGoal}g goal.`,
    `4. Calories: ${Math.round(totals.calories || 0)} out of ${calorieGoal} kcal. The main lever left is still protein-dense food, not more snacks.`,
  ].join('\n');
}

function buildDonutMessage(goals: DemoGoal[], todayLogs: DemoFoodLog[]) {
  const totals = sumLogs(todayLogs);
  const sugarGoal = goals.find((goal) => goal.nutrient === 'sugar_g')?.target_value || 0;
  const calorieGoal = goals.find((goal) => goal.nutrient === 'calories')?.target_value || 0;
  const projectedSugar = (totals.sugar_g || 0) + 22;
  const projectedCalories = (totals.calories || 0) + 310;
  const overSugar = projectedSugar - sugarGoal;
  const overCalories = projectedCalories - calorieGoal;

  return [
    `1. If you add one donut, sugar moves to ${Math.round(projectedSugar)}g against a ${sugarGoal}g limit, so you'd be ${
      overSugar > 0 ? `${Math.round(overSugar)}g over` : `${Math.abs(Math.round(overSugar))}g under`
    }.`,
    `2. Calories would land at ${Math.round(projectedCalories)} kcal, which is ${
      overCalories > 0 ? `${Math.round(overCalories)} kcal over target` : 'still inside the daily target'
    }.`,
    '3. The bigger tradeoff is that the donut helps taste, not protein or hydration, so it makes the rest of the day more constrained.',
  ].join('\n');
}

function buildAuditMessage(todayLogs: DemoFoodLog[], dayType: string) {
  const salty = [...todayLogs].sort((left, right) => right.sodium_mg - left.sodium_mg).slice(0, 2);

  return [
    `1. The sodium number is mostly coming from ${salty.map((log) => `${log.food_name} (${Math.round(log.sodium_mg)}mg)`).join(' and ')}.`,
    '2. The likely uncertainty sources are broth concentration, sauce quantity, and prepared-food sodium, not a hidden math bug in the low-sodium items.',
    dayType === 'travel'
      ? '3. Because today is classified as travel, I would treat the overshoot as context first and only debug harder if the same shape repeats on normal days.'
      : '3. The log is internally coherent, so the right move is audit the dense items rather than second-guess the whole day.',
  ].join('\n');
}

function buildAnalyticsSeries(logs: DemoFoodLog[], nutrient: string) {
  const byDay = new Map<string, number>();

  logs.forEach((log) => {
    const key = getDateKey(log.log_time);
    const value = (log[nutrient as keyof DemoFoodLog] as number | undefined) || 0;
    byDay.set(key, (byDay.get(key) || 0) + value);
  });

  return [...byDay.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([date, total]) => ({
      date,
      total,
      short: new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
}

export default function NutritionAssistantDemo() {
  const [state, setState] = useState<NutritionAssistantDemoState>(loadInitialState);
  const [selectedLog, setSelectedLog] = useState<DemoFoodLog | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<DemoRecipe | null>(null);
  const [recipePreviewId, setRecipePreviewId] = useState<string | null>('recipe-soup');
  const [historyDate, setHistoryDate] = useState(TODAY);
  const [selectedAnalyticsNutrient, setSelectedAnalyticsNutrient] = useState('protein_g');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeSession =
    state.chatSessions.find((session) => session.id === state.activeChatId) || state.chatSessions[0];
  const previewRecipe =
    state.recipes.find((recipe) => recipe.id === recipePreviewId) || state.recipes[0] || null;
  const todayLogs = useMemo(() => getTodayLogs(state.logs), [state.logs]);
  const todayTotals = useMemo(() => sumLogs(todayLogs), [todayLogs]);
  const historyDates = useMemo(
    () => [...new Set(state.logs.map((log) => getDateKey(log.log_time)))].sort().reverse(),
    [state.logs]
  );
  const historyLogs = useMemo(
    () =>
      state.logs
        .filter((log) => getDateKey(log.log_time) === historyDate)
        .sort((left, right) => right.log_time.localeCompare(left.log_time)),
    [historyDate, state.logs]
  );

  const analyticsNutrients = ['calories', 'protein_g', 'sodium_mg', 'hydration_ml'];
  const analyticsSeries = useMemo(
    () => buildAnalyticsSeries(state.logs, selectedAnalyticsNutrient),
    [selectedAnalyticsNutrient, state.logs]
  );

  function setActivePage(page: DemoPage) {
    setState((current) => ({ ...current, activePage: page }));
  }

  function createNewChat() {
    const nextSession: DemoChatSession = {
      id: createId('chat'),
      title: 'New chat',
      updated_at: new Date(`${TODAY}T20:00:00.000Z`).toISOString(),
      messages: [
        {
          id: createId('msg'),
          sender: 'bot',
          text:
            'New session created. In the real app this would start a fresh Supabase chat thread. Use the quick actions below to replay logging, summaries, recipes, or audits.',
          message_type: 'analysis',
        },
      ],
    };

    setState((current) => ({
      ...current,
      activePage: 'chat',
      activeChatId: nextSession.id,
      chatSessions: [nextSession, ...current.chatSessions],
    }));
  }

  function appendMessages(messages: DemoChatMessage[]) {
    setState((current) => ({
      ...current,
      chatSessions: updateSession(current.chatSessions, current.activeChatId, (session) => ({
        ...session,
        messages: [...session.messages, ...messages],
      })),
    }));
  }

  function addLog(log: DemoFoodLog) {
    setState((current) => ({ ...current, logs: [log, ...current.logs] }));
  }

  function handleQuickAction(actionId: (typeof QUICK_ACTIONS)[number]['id']) {
    const userMessageBase: DemoChatMessage = {
      id: createId('msg-user'),
      sender: 'user',
      text: QUICK_ACTIONS.find((action) => action.id === actionId)?.label || actionId,
    };

    if (actionId === 'tuna-wrap') {
      const existing = todayLogs.find((log) => log.food_name === 'Tuna wrap');
      const logItem: DemoFoodLog = {
        id: createId('log'),
        log_time: `${TODAY}T17:40:00.000Z`,
        food_name: 'Tuna wrap',
        calories: 420,
        protein_g: 31,
        carbs_g: 34,
        fat_total_g: 18,
        fiber_g: 4,
        sugar_g: 5,
        sodium_mg: 670,
        hydration_ml: 0,
        serving_size: '1 deli wrap',
        portion: '1 wrap',
        confidence: 'medium',
        error_sources: ['vague_portion'],
      };

      appendMessages([
        userMessageBase,
        {
          id: createId('msg-bot'),
          sender: 'bot',
          text: existing
            ? 'That tuna wrap is already in today’s tracker, so I kept the log unchanged and just surfaced the existing nutrition card.'
            : "I've estimated one standard tuna wrap and logged it to your tracker. This is the same browser flow as the upstream app: chat creates the entry, and the dashboard updates immediately.",
          metadata: { nutrition: [existing || logItem] },
          message_type: 'food_logged',
        },
      ]);

      if (!existing) addLog(logItem);
      return;
    }

    if (actionId === 'chicken-soup') {
      const recipe = state.recipes.find((item) => item.id === 'recipe-soup');
      if (!recipe) return;

      appendMessages([
        userMessageBase,
        {
          id: createId('msg-bot'),
          sender: 'bot',
          text:
            'I found your saved Lemon-Dill Mediterranean Chicken Soup recipe, kept the stored serving definition, and prepared the same logged result the real app would show.',
          metadata: { recipe, nutrition: [state.logs.find((log) => log.id === 'log-soup')! ] },
          message_type: 'recipe_saved',
        },
      ]);

      return;
    }

    if (actionId === 'today-summary') {
      appendMessages([
        userMessageBase,
        {
          id: createId('msg-bot'),
          sender: 'bot',
          text: buildSummaryMessage(state.goals, todayLogs, state.profile.dayType),
          metadata: { progress_logs: todayLogs },
          message_type: 'summary',
        },
      ]);
      return;
    }

    if (actionId === 'donut') {
      appendMessages([
        userMessageBase,
        {
          id: createId('msg-bot'),
          sender: 'bot',
          text: buildDonutMessage(state.goals, todayLogs),
          message_type: 'analysis',
        },
      ]);
      return;
    }

    if (actionId === 'audit') {
      const saltyLogs = [...todayLogs].sort((left, right) => right.sodium_mg - left.sodium_mg).slice(0, 3);
      appendMessages([
        userMessageBase,
        {
          id: createId('msg-bot'),
          sender: 'bot',
          text: buildAuditMessage(todayLogs, state.profile.dayType),
          metadata: { progress_logs: saltyLogs },
          message_type: 'audit',
        },
      ]);
      return;
    }

    if (actionId === 'travel') {
      setState((current) => ({
        ...current,
        profile: { ...current.profile, dayType: 'travel' },
      }));
      appendMessages([
        userMessageBase,
        {
          id: createId('msg-bot'),
          sender: 'bot',
          text:
            "Marked today as a travel day. In the real NutriPal pipeline this comes from day classification, so summaries and audits stop treating higher sodium as a moral failure and treat it as context.",
          message_type: 'analysis',
        },
      ]);
    }
  }

  function logRecipe(recipe: DemoRecipe) {
    const perServing = recipe.per_serving_nutrition || {};
    const logItem: DemoFoodLog = {
      id: createId('log'),
      log_time: `${TODAY}T18:10:00.000Z`,
      food_name: recipe.recipe_name,
      calories: perServing.calories || Math.round(recipe.calories / recipe.servings),
      protein_g: perServing.protein_g || 0,
      carbs_g: perServing.carbs_g || 0,
      fat_total_g: perServing.fat_total_g || 0,
      fat_saturated_g: perServing.fat_saturated_g || 0,
      fiber_g: perServing.fiber_g || 0,
      sugar_g: perServing.sugar_g || 0,
      sodium_mg: perServing.sodium_mg || 0,
      hydration_ml: perServing.hydration_ml || 0,
      serving_size: recipe.serving_size,
      portion: '1 serving',
      confidence: 'high',
    };

    addLog(logItem);
    appendMessages([
      {
        id: createId('msg-user'),
        sender: 'user',
        text: `Log ${recipe.recipe_name}`,
      },
      {
        id: createId('msg-bot'),
        sender: 'bot',
        text: `${recipe.recipe_name} has been logged from your saved recipes.`,
        metadata: { nutrition: [logItem], recipe },
        message_type: 'food_logged',
      },
    ]);
    setState((current) => ({ ...current, activePage: 'chat' }));
    setSelectedRecipe(null);
  }

  function deleteLog(logId: string) {
    setState((current) => ({
      ...current,
      logs: current.logs.filter((log) => log.id !== logId),
    }));
    setSelectedLog(null);
  }

  function updateDisplayUnit(category: keyof DisplayUnits, value: string) {
    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        displayUnits: {
          ...current.profile.displayUnits,
          [category]: value,
        },
      },
    }));
  }

  return (
    <div className="overflow-x-auto rounded-[18px] border border-[#d7dde8] bg-[#edf2f8] shadow-[0_28px_60px_-40px_rgba(15,23,42,0.45)]">
      <div className="grid h-[860px] min-w-[1180px] grid-cols-[248px_minmax(0,1fr)] bg-white text-gray-900">
        <aside className="sidebar flex h-full flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-4">
            <p className="text-xl font-semibold text-gray-800">NutriPal</p>
            <p className="text-xs text-gray-400">Web App Demo</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <SidebarLink
              active={state.activePage === 'dashboard'}
              label="Dashboard"
              onClick={() => setActivePage('dashboard')}
            />
            <SidebarLink
              active={state.activePage === 'chat'}
              label="Chat"
              onClick={() => setActivePage('chat')}
            />
            <SidebarLink
              active={state.activePage === 'history'}
              label="History"
              onClick={() => setActivePage('history')}
            />
            <SidebarLink
              active={state.activePage === 'recipes'}
              label="Saved Recipes"
              onClick={() => setActivePage('recipes')}
            />
            <SidebarLink
              active={state.activePage === 'analytics'}
              label="Analytics"
              onClick={() => setActivePage('analytics')}
            />
            <SidebarLink
              active={state.activePage === 'settings'}
              label="Settings"
              onClick={() => setActivePage('settings')}
            />

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="mb-2 flex items-center justify-between px-3">
                <span className="text-sm font-semibold text-gray-700">Chats</span>
                <button
                  type="button"
                  onClick={createNewChat}
                  className="rounded bg-green-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-green-700"
                >
                  + New
                </button>
              </div>
              <div className="space-y-1">
                {state.chatSessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() =>
                      setState((current) => ({
                        ...current,
                        activeChatId: session.id,
                        activePage: 'chat',
                      }))
                    }
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                      session.id === state.activeChatId
                        ? 'bg-blue-100 font-semibold text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="block truncate">{session.title}</span>
                    <span className="block text-xs text-gray-400">{formatDateTime(session.updated_at)}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        <div className="grid min-w-0 grid-rows-[68px_minmax(0,1fr)]">
          <header className="flex items-center justify-between border-b border-gray-200 bg-white px-5">
            <h2 className="text-xl font-semibold text-gray-800">{getPageTitle(state.activePage)}</h2>
            <button
              type="button"
              onClick={() => {
                setState(createNutritionAssistantSeed());
                setRecipePreviewId('recipe-soup');
                setSelectedLog(null);
                setSelectedRecipe(null);
                setHistoryDate(TODAY);
                setSelectedAnalyticsNutrient('protein_g');
              }}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset Demo
            </button>
          </header>

          <main className="min-h-0 overflow-hidden bg-[#f6f8fb] p-4">
            {state.activePage === 'chat' ? (
              <div className="grid h-full grid-cols-[minmax(0,1.08fr)_420px] gap-4">
                <section className="grid min-h-0 grid-rows-[56px_minmax(0,1fr)_auto] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{activeSession.title}</p>
                      <p className="text-xs text-gray-400">Linked chat thread with dashboard context</p>
                    </div>
                    <p className="text-xs font-medium text-gray-400">{formatDateTime(activeSession.updated_at)}</p>
                  </div>

                  <div className="min-h-0 space-y-4 overflow-y-auto bg-gray-50 p-4">
                    {activeSession.messages.map((message) => (
                      <ChatBubble
                        key={message.id}
                        message={message}
                        units={state.profile.displayUnits}
                        onViewLog={setSelectedLog}
                        onViewRecipe={setSelectedRecipe}
                      />
                    ))}
                  </div>

                  <div className="border-t border-gray-200 bg-white p-4">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {QUICK_ACTIONS.map((action) => (
                        <button
                          key={action.id}
                          type="button"
                          onClick={() => handleQuickAction(action.id)}
                          className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        value=""
                        readOnly
                        placeholder="Typing is disabled in the portfolio demo. Use the preset actions above."
                        className="flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-black placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        className="rounded-full bg-blue-600 px-5 py-2 text-white opacity-60"
                        disabled
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </section>

                <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
                  <DashboardSummaryTable
                    userGoals={state.goals}
                    dailyTotals={todayTotals}
                    units={state.profile.displayUnits}
                  />
                  <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">Today&apos;s Log</p>
                      <p className="text-xs text-gray-400">Matches the right-side dashboard panel from the source layout</p>
                    </div>
                    <div className="min-h-0 divide-y divide-gray-100 overflow-y-auto">
                      {todayLogs.map((log) => (
                        <button
                          key={log.id}
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">{log.food_name}</p>
                            <p className="text-xs text-gray-400">{formatTime(log.log_time)}</p>
                          </div>
                          <span className="text-sm font-semibold text-blue-600">
                            {Math.round(log.calories)} kcal
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            ) : null}

            {state.activePage === 'dashboard' ? (
              <div className="grid h-full grid-cols-[minmax(0,1fr)_520px] gap-4">
                <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">Today&apos;s Log</p>
                    <p className="text-xs text-gray-400">Clickable entries open the same detailed nutrient modal style as the source app.</p>
                  </div>
                  <div className="min-h-0 divide-y divide-gray-100 overflow-y-auto">
                    {todayLogs.map((log) => (
                      <button
                        key={log.id}
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">{log.food_name}</p>
                          <p className="text-xs text-gray-400">{formatTime(log.log_time)}</p>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">
                          {Math.round(log.calories)} kcal
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="min-h-0">
                  <DashboardSummaryTable
                    userGoals={state.goals}
                    dailyTotals={todayTotals}
                    units={state.profile.displayUnits}
                  />
                </section>
              </div>
            ) : null}

            {state.activePage === 'history' ? (
              <div className="grid h-full grid-cols-[280px_minmax(0,1fr)] gap-4">
                <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Logged Day</label>
                  <select
                    value={historyDate}
                    onChange={(event) => setHistoryDate(event.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                  >
                    {historyDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </option>
                    ))}
                  </select>
                </section>

                <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">History Detail</p>
                    <p className="text-xs text-gray-400">Daily food logs and nutrition entries from the dummy account</p>
                  </div>
                  <div className="min-h-0 overflow-y-auto">
                    {historyLogs.length === 0 ? (
                      <div className="px-4 py-10 text-center text-sm text-gray-500">No logs found for this date.</div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {historyLogs.map((log) => (
                          <button
                            key={log.id}
                            type="button"
                            onClick={() => setSelectedLog(log)}
                            className="flex w-full items-center justify-between px-4 py-4 text-left hover:bg-gray-50"
                          >
                            <div>
                              <p className="text-sm font-medium text-blue-600">{log.food_name}</p>
                              <p className="mt-1 text-xs text-gray-500">{formatTime(log.log_time)}</p>
                            </div>
                            <span className="text-sm text-gray-600">{Math.round(log.calories)} kcal</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            ) : null}

            {state.activePage === 'recipes' ? (
              <div className="grid h-full grid-cols-[340px_minmax(0,1fr)] gap-4">
                <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">Saved Recipes</p>
                    <p className="text-xs text-gray-400">Source-inspired recipe library with nutrition and ingredients</p>
                  </div>
                  <div className="min-h-0 space-y-2 overflow-y-auto p-3">
                    {state.recipes.map((recipe) => (
                      <button
                        key={recipe.id}
                        type="button"
                        onClick={() => setRecipePreviewId(recipe.id)}
                        className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                          previewRecipe?.id === recipe.id
                            ? 'border-emerald-400 bg-emerald-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <p className="text-sm font-semibold text-gray-900">{recipe.recipe_name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {recipe.servings} servings
                          {recipe.serving_size ? ` • ${recipe.serving_size}` : ''}
                        </p>
                        <p className="mt-2 text-xs font-medium text-emerald-700">
                          {Math.round(recipe.calories / recipe.servings)} kcal per serving
                        </p>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="min-h-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  {previewRecipe ? (
                    <RecipeWorkspaceCard
                      recipe={previewRecipe}
                      goals={state.goals}
                      units={state.profile.displayUnits}
                      onLogRecipe={() => logRecipe(previewRecipe)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      Select a recipe to inspect it.
                    </div>
                  )}
                </section>
              </div>
            ) : null}

            {state.activePage === 'analytics' ? (
              <div className="flex h-full flex-col gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">Focus Item</p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900">Sodium control</h3>
                  <p className="mt-2 max-w-3xl text-sm text-gray-600">
                    Across the recent logs, sodium is the nutrient most likely to swing the day.
                    That matches the real app&apos;s analytics intent: highlight the one lever worth
                    caring about instead of flooding the user with noise.
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {analyticsNutrients.map((nutrient) => {
                    const series = buildAnalyticsSeries(state.logs, nutrient);
                    const latest = series[series.length - 1]?.total || 0;
                    const goal = state.goals.find((item) => item.nutrient === nutrient)?.target_value || 0;

                    return (
                      <button
                        key={nutrient}
                        type="button"
                        onClick={() => setSelectedAnalyticsNutrient(nutrient)}
                        className={`rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md ${
                          selectedAnalyticsNutrient === nutrient
                            ? 'border-blue-500 ring-2 ring-blue-100'
                            : 'border-gray-200'
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-600">
                          {MASTER_NUTRIENT_MAP[nutrient]?.name || nutrient}
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                          {formatNutrientValue(nutrient, latest, state.profile.displayUnits)}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Goal: {formatNutrientValue(nutrient, goal, state.profile.displayUnits)}
                        </p>
                        <MiniBarChart series={series.map((item) => item.total)} />
                      </button>
                    );
                  })}
                </div>

                <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_300px] gap-4">
                  <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {MASTER_NUTRIENT_MAP[selectedAnalyticsNutrient]?.name || selectedAnalyticsNutrient} Trend
                        </h3>
                        <p className="text-sm text-gray-500">Recent day-by-day dummy history rendered like the source analytics page</p>
                      </div>
                      <select
                        value={selectedAnalyticsNutrient}
                        onChange={(event) => setSelectedAnalyticsNutrient(event.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                      >
                        {analyticsNutrients.map((nutrient) => (
                          <option key={nutrient} value={nutrient}>
                            {MASTER_NUTRIENT_MAP[nutrient]?.name || nutrient}
                          </option>
                        ))}
                      </select>
                    </div>
                    <AnalyticsTrendChart
                      nutrient={selectedAnalyticsNutrient}
                      goal={state.goals.find((item) => item.nutrient === selectedAnalyticsNutrient)?.target_value || 0}
                      series={analyticsSeries}
                      units={state.profile.displayUnits}
                    />
                  </section>

                  <section className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Selected Nutrient</p>
                      <p className="mt-1 text-3xl font-semibold text-blue-600">
                        {formatNutrientValue(
                          selectedAnalyticsNutrient,
                          analyticsSeries[analyticsSeries.length - 1]?.total || 0,
                          state.profile.displayUnits
                        )}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Goal {formatNutrientValue(
                          selectedAnalyticsNutrient,
                          state.goals.find((item) => item.nutrient === selectedAnalyticsNutrient)?.target_value || 0,
                          state.profile.displayUnits
                        )}
                      </p>
                    </div>
                    <div className="mt-4 rounded-lg bg-blue-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Last recorded points</p>
                    </div>
                    <div className="min-h-0 space-y-2 overflow-y-auto pt-3">
                      {analyticsSeries.map((point) => (
                        <div key={point.date} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                          <span className="text-sm font-medium text-gray-700">{point.short}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatNutrientValue(selectedAnalyticsNutrient, point.total, state.profile.displayUnits)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            ) : null}

            {state.activePage === 'settings' ? (
              <div className="grid h-full grid-cols-[minmax(0,1fr)_360px] gap-4">
                <div className="space-y-4">
                  <SimpleCard title="Display Units" subtitle="This matches the real settings page behavior.">
                    <div className="space-y-4">
                      <UnitSelector
                        label="Volume"
                        value={state.profile.displayUnits.volume}
                        options={[
                          ['ml', 'Milliliters (ml)'],
                          ['oz', 'Fluid ounces (oz)'],
                          ['L', 'Liters (L)'],
                        ]}
                        onChange={(value) => updateDisplayUnit('volume', value)}
                      />
                      <UnitSelector
                        label="Weight"
                        value={state.profile.displayUnits.weight}
                        options={[
                          ['g', 'Grams (g)'],
                          ['oz', 'Ounces (oz)'],
                          ['lb', 'Pounds (lb)'],
                        ]}
                        onChange={(value) => updateDisplayUnit('weight', value)}
                      />
                      <UnitSelector
                        label="Energy"
                        value={state.profile.displayUnits.energy}
                        options={[
                          ['kcal', 'Calories (kcal)'],
                          ['kj', 'Kilojoules (kJ)'],
                        ]}
                        onChange={(value) => updateDisplayUnit('energy', value)}
                      />
                    </div>
                  </SimpleCard>

                  <SimpleCard title="Tracked Goals" subtitle="The source app stores goals in Supabase; this demo keeps them local.">
                    <div className="space-y-3">
                      {state.goals.map((goal) => (
                        <div
                          key={goal.nutrient}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {MASTER_NUTRIENT_MAP[goal.nutrient]?.name || goal.nutrient}
                            </p>
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                              {goal.goal_type === 'limit' ? 'Limit' : 'Goal'}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-700">
                            {formatNutrientValue(goal.nutrient, goal.target_value, state.profile.displayUnits)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </SimpleCard>
                </div>

                <SimpleCard title="Day Classification" subtitle="Exception handling is first-class in the actual product spec.">
                  <div className="flex flex-wrap gap-2">
                    {(['normal', 'travel', 'social', 'recovery'] as const).map((dayType) => (
                      <button
                        key={dayType}
                        type="button"
                        onClick={() =>
                          setState((current) => ({
                            ...current,
                            profile: { ...current.profile, dayType },
                          }))
                        }
                        className={`rounded-full px-3 py-2 text-sm font-medium ${
                          state.profile.dayType === dayType
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {capitalize(dayType)}
                      </button>
                    ))}
                  </div>
                </SimpleCard>
              </div>
            ) : null}
          </main>
        </div>
      </div>

      {selectedLog ? (
        <FoodLogDetailModal
          log={selectedLog}
          goals={state.goals}
          units={state.profile.displayUnits}
          onClose={() => setSelectedLog(null)}
          onDelete={() => deleteLog(selectedLog.id)}
        />
      ) : null}

      {selectedRecipe && state.activePage !== 'recipes' ? (
        <RecipeDetailModal
          recipe={selectedRecipe}
          goals={state.goals}
          units={state.profile.displayUnits}
          onClose={() => setSelectedRecipe(null)}
          onLogRecipe={() => logRecipe(selectedRecipe)}
        />
      ) : null}
    </div>
  );
}

function SidebarLink({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full rounded-md px-3 py-2 text-left ${
        active ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
}

function getPageTitle(page: DemoPage) {
  switch (page) {
    case 'dashboard':
      return 'Dashboard';
    case 'chat':
      return 'Chat & Dashboard';
    case 'history':
      return 'Log History';
    case 'recipes':
      return 'Saved Recipes';
    case 'analytics':
      return 'Nutrition Analytics';
    case 'settings':
      return 'Settings';
    default:
      return 'NutriPal';
  }
}

function SimpleCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ChatBubble({
  message,
  units,
  onViewLog,
  onViewRecipe,
}: {
  message: DemoChatMessage;
  units: DisplayUnits;
  onViewLog: (log: DemoFoodLog) => void;
  onViewRecipe: (recipe: DemoRecipe) => void;
}) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[92%] rounded-lg px-4 py-3 shadow ${
          isUser ? 'bg-blue-500 text-white' : 'border border-gray-200 bg-white text-gray-900'
        }`}
      >
        <div className="whitespace-pre-line text-sm font-medium leading-relaxed">{message.text}</div>

        {!isUser && message.metadata?.nutrition?.length ? (
          <div className="mt-3 border-t border-gray-100 pt-3">
            {message.metadata.nutrition.map((log) => (
              <button
                key={log.id}
                type="button"
                onClick={() => onViewLog(log)}
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-left hover:bg-gray-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{log.food_name}</p>
                    <p className="text-xs text-gray-500">
                      {log.portion || log.serving_size || '1 serving'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-blue-600">{Math.round(log.calories)} kcal</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {capitalize(log.confidence || 'high')} confidence
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  {['protein_g', 'carbs_g', 'fat_total_g', 'sodium_mg'].map((key) => (
                    <div key={key} className="rounded-md bg-white px-2 py-1.5">
                      <p className="font-semibold text-gray-500">
                        {MASTER_NUTRIENT_MAP[key]?.name || key}
                      </p>
                      <p className="font-bold text-gray-800">
                        {formatNutrientValue(key, (log[key as keyof DemoFoodLog] as number) || 0, units)}
                      </p>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {!isUser && message.metadata?.progress_logs?.length ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-blue-100 bg-blue-50 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-blue-900">
              Today&apos;s Log
            </div>
            {message.metadata.progress_logs.map((log) => (
              <button
                key={log.id}
                type="button"
                onClick={() => onViewLog(log)}
                className="flex w-full items-center justify-between border-b border-gray-100 px-3 py-2 text-left last:border-b-0 hover:bg-gray-50"
              >
                <span className="text-sm font-semibold text-gray-800">{log.food_name}</span>
                <span className="text-sm font-bold text-blue-600">{Math.round(log.calories)} kcal</span>
              </button>
            ))}
          </div>
        ) : null}

        {!isUser && message.metadata?.recipe ? (
          <button
            type="button"
            onClick={() => onViewRecipe(message.metadata!.recipe!)}
            className="mt-3 block w-full rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-left hover:bg-emerald-100"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg text-emerald-600">✓</span>
              <span className="font-semibold text-emerald-800">Recipe saved</span>
            </div>
            <p className="mt-2 text-sm font-bold text-gray-900">{message.metadata.recipe.recipe_name}</p>
            <p className="text-xs text-gray-600">
              {message.metadata.recipe.servings} servings •{' '}
              {Math.round(message.metadata.recipe.calories / message.metadata.recipe.servings)} kcal per serving
            </p>
          </button>
        ) : null}
      </div>
    </div>
  );
}

function DashboardSummaryTable({
  userGoals,
  dailyTotals,
  units,
}: {
  userGoals: DemoGoal[];
  dailyTotals: Record<string, number>;
  units: DisplayUnits;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {['Nutrient', 'Target', 'Consumed', 'Progress %', 'Delta'].map((label) => (
                <th
                  key={label}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {userGoals.map((goal) => (
              <SummaryRow key={goal.nutrient} goal={goal} current={dailyTotals[goal.nutrient] || 0} units={units} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryRow({
  goal,
  current,
  units,
}: {
  goal: DemoGoal;
  current: number;
  units: DisplayUnits;
}) {
  const ratio = goal.target_value > 0 ? current / goal.target_value : 0;
  const percentage = Math.round(ratio * 100);
  const delta = goal.target_value - current;
  const isLimit = goal.goal_type === 'limit';

  let textColor = 'text-gray-600';
  let barColor = 'bg-gray-300';
  let rowBg = 'bg-white hover:bg-gray-50';

  if (isLimit) {
    if (ratio > 1) {
      textColor = 'text-red-600 font-bold';
      barColor = 'bg-red-500';
      rowBg = 'bg-red-50 hover:bg-red-100';
    } else if (ratio >= 0.75) {
      textColor = 'text-amber-600 font-medium';
      barColor = 'bg-amber-500';
      rowBg = 'bg-amber-50 hover:bg-amber-100';
    } else {
      textColor = 'text-emerald-700 font-medium';
      barColor = 'bg-emerald-500';
      rowBg = 'bg-emerald-50 hover:bg-emerald-100';
    }
  } else {
    if (ratio >= 0.75) {
      textColor = 'text-emerald-700 font-bold';
      barColor = 'bg-emerald-500';
      rowBg = ratio >= 1 ? 'bg-emerald-100 hover:bg-emerald-200' : 'bg-emerald-50 hover:bg-emerald-100';
    } else if (ratio >= 0.5) {
      textColor = 'text-amber-600 font-medium';
      barColor = 'bg-amber-400';
      rowBg = 'bg-amber-50 hover:bg-amber-100';
    } else {
      textColor = 'text-red-600 font-medium';
      barColor = 'bg-red-500';
      rowBg = 'bg-red-50 hover:bg-red-100';
    }
  }

  return (
    <tr className={rowBg}>
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
        <div className="flex flex-col">
          <span>{MASTER_NUTRIENT_MAP[goal.nutrient]?.name || goal.nutrient}</span>
          <span className="text-[10px] uppercase tracking-tighter text-gray-400">
            {isLimit ? 'Limit' : 'Goal'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-500">
        {formatNutrientValue(goal.nutrient, goal.target_value, units)}
      </td>
      <td className={`px-6 py-4 text-sm ${textColor}`}>
        {formatNutrientValue(goal.nutrient, current, units)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-24 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            <div
              className={`h-full ${barColor}`}
              style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
            />
          </div>
          <span className={`w-10 text-xs font-bold ${textColor}`}>{percentage}%</span>
        </div>
      </td>
      <td className={`px-6 py-4 text-sm font-medium ${delta < 0 ? (isLimit ? 'text-red-500' : 'text-emerald-600') : 'text-gray-400'}`}>
        {delta < 0 ? '+' : ''}
        {formatNutrientValue(goal.nutrient, Math.abs(delta), units)}
      </td>
    </tr>
  );
}

function FoodLogDetailModal({
  log,
  goals,
  units,
  onClose,
  onDelete,
}: {
  log: DemoFoodLog;
  goals: DemoGoal[];
  units: DisplayUnits;
  onClose: () => void;
  onDelete: () => void;
}) {
  const trackedDetails = goals
    .filter((goal) => goal.nutrient !== 'calories')
    .map((goal) => ({
      key: goal.nutrient,
      name: MASTER_NUTRIENT_MAP[goal.nutrient]?.name || goal.nutrient,
      value: (log[goal.nutrient as keyof DemoFoodLog] as number | undefined) || 0,
      confidence: log.confidence_details?.[goal.nutrient] || log.confidence || 'high',
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-4 py-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">Log Details</span>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-blue-400 hover:text-blue-600">
            ×
          </button>
        </div>
        <div className="flex items-start justify-between p-5">
          <div className="min-w-0 flex-1 pr-4">
            <h3 className="text-xl font-bold leading-tight text-gray-900">{log.food_name}</h3>
            <p className="mt-1 text-sm font-medium text-gray-500">
              {log.portion || '1 serving'}
              {log.serving_size ? ` (${log.serving_size})` : ''}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black tracking-tight text-blue-600">
              {formatEnergy(log.calories, units)}
            </div>
            <div className="mt-1">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  log.confidence === 'low'
                    ? 'bg-red-100 text-red-700'
                    : log.confidence === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                }`}
              >
                {capitalize(log.confidence || 'high')} Confidence
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <div className="border-t border-gray-50 pt-4">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tracked Goals</span>
            </div>
            <div className="space-y-2.5 rounded-lg border border-gray-100 bg-gray-50 p-3">
              {trackedDetails.map((detail) => (
                <div key={detail.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-tight text-gray-500">
                      {detail.name}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        detail.confidence === 'low'
                          ? 'bg-red-400'
                          : detail.confidence === 'medium'
                            ? 'bg-yellow-400'
                            : 'bg-green-400'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-black text-gray-800">
                    {formatNutrientValue(detail.key, detail.value, units)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 border-t border-gray-100 bg-gray-50/50 p-4">
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
          >
            Delete Log
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipeDetailModal({
  recipe,
  goals,
  units,
  onClose,
  onLogRecipe,
}: {
  recipe: DemoRecipe;
  goals: DemoGoal[];
  units: DisplayUnits;
  onClose: () => void;
  onLogRecipe: () => void;
}) {
  const perServing =
    recipe.per_serving_nutrition ||
    Object.fromEntries(
      Object.entries(recipe.nutrition_data || {}).map(([key, value]) => [key, value / recipe.servings])
    );

  const tracked = goals
    .filter((goal) => goal.nutrient !== 'calories')
    .map((goal) => ({
      key: goal.nutrient,
      value: (perServing[goal.nutrient] as number | undefined) || 0,
      name: MASTER_NUTRIENT_MAP[goal.nutrient]?.name || goal.nutrient,
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50 px-4 py-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">Recipe Details</span>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-emerald-400 hover:text-emerald-600">
            ×
          </button>
        </div>
        <div className="flex items-start justify-between p-5">
          <div className="min-w-0 flex-1 pr-4">
            <h3 className="text-xl font-bold leading-tight text-gray-900">{recipe.recipe_name}</h3>
            <p className="mt-1 text-sm font-medium text-gray-500">
              {recipe.servings} servings
              {recipe.serving_size ? ` • ${recipe.serving_size}` : ''}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black tracking-tight text-emerald-600">
              {formatEnergy((perServing.calories as number) || recipe.calories / recipe.servings, units)}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Per serving</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {recipe.description ? (
            <p className="mb-6 border-l-2 border-emerald-100 pl-3 text-sm italic leading-relaxed text-gray-600">
              {recipe.description}
            </p>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ingredients</span>
              <div className="mt-3 space-y-2">
                {recipe.recipe_ingredients?.map((ingredient) => (
                  <div key={`${recipe.id}-${ingredient.ingredient_name}`} className="border-b border-gray-50 pb-1.5 last:border-b-0">
                    <span className="block text-xs font-bold leading-tight text-gray-800">
                      {ingredient.ingredient_name}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </div>
                )) || <div className="text-xs text-gray-500">{recipe.ingredients}</div>}
              </div>
            </div>
            <div className="border-l border-gray-100 pl-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nutrition</span>
              <div className="mt-3 space-y-2.5">
                {tracked.map((item) => (
                  <div key={item.key} className="border-b border-gray-50 pb-1.5 last:border-b-0">
                    <span className="text-[10px] font-semibold uppercase tracking-tight text-gray-400">
                      {item.name}
                    </span>
                    <span className="block text-xs font-black text-gray-800">
                      {formatNutrientValue(item.key, item.value, units)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {recipe.instructions ? (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Instructions</span>
              <div className="mt-3 whitespace-pre-wrap rounded-lg border border-gray-100 bg-gray-50/50 p-4 text-sm leading-relaxed text-gray-600">
                {recipe.instructions}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex gap-3 border-t border-gray-100 bg-gray-50/50 p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onLogRecipe}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            Log Recipe
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipeWorkspaceCard({
  recipe,
  goals,
  units,
  onLogRecipe,
}: {
  recipe: DemoRecipe;
  goals: DemoGoal[];
  units: DisplayUnits;
  onLogRecipe: () => void;
}) {
  const perServing =
    recipe.per_serving_nutrition ||
    Object.fromEntries(
      Object.entries(recipe.nutrition_data || {}).map(([key, value]) => [key, value / recipe.servings])
    );

  const tracked = goals
    .filter((goal) => goal.nutrient !== 'calories')
    .map((goal) => ({
      key: goal.nutrient,
      label: MASTER_NUTRIENT_MAP[goal.nutrient]?.name || goal.nutrient,
      value: (perServing[goal.nutrient] as number | undefined) || 0,
    }));

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]">
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{recipe.recipe_name}</p>
            <p className="mt-1 text-xs text-gray-400">
              {recipe.servings} servings
              {recipe.serving_size ? ` • ${recipe.serving_size}` : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black tracking-tight text-emerald-600">
              {formatEnergy((perServing.calories as number) || recipe.calories / recipe.servings, units)}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Per serving</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 overflow-y-auto px-5 py-4">
        {recipe.description ? (
          <p className="mb-6 border-l-2 border-emerald-100 pl-3 text-sm italic leading-relaxed text-gray-600">
            {recipe.description}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ingredients</span>
            <div className="mt-3 space-y-2">
              {recipe.recipe_ingredients?.map((ingredient) => (
                <div
                  key={`${recipe.id}-${ingredient.ingredient_name}`}
                  className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                >
                  <span className="block text-sm font-semibold text-gray-800">
                    {ingredient.ingredient_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </div>
              )) || (
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3 text-sm text-gray-600">
                  {recipe.ingredients}
                </div>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tracked Nutrition</span>
            <div className="mt-3 space-y-2">
              {tracked.map((item) => (
                <div
                  key={item.key}
                  className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-sm"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-tight text-gray-400">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm font-black text-gray-800">
                    {formatNutrientValue(item.key, item.value, units)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {recipe.instructions ? (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Instructions</span>
            <div className="mt-3 whitespace-pre-wrap rounded-lg border border-gray-100 bg-gray-50/70 p-4 text-sm leading-relaxed text-gray-600">
              {recipe.instructions}
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4">
        <button
          type="button"
          onClick={onLogRecipe}
          className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
        >
          Log Recipe
        </button>
      </div>
    </div>
  );
}

function AnalyticsTrendChart({
  nutrient,
  goal,
  series,
  units,
}: {
  nutrient: string;
  goal: number;
  series: Array<{ date: string; total: number; short: string }>;
  units: DisplayUnits;
}) {
  const width = 760;
  const height = 280;
  const paddingLeft = 44;
  const paddingRight = 20;
  const paddingTop = 18;
  const paddingBottom = 40;
  const maxValue = Math.max(goal, ...series.map((point) => point.total), 1);
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = series.map((point, index) => {
    const x =
      series.length === 1
        ? paddingLeft + chartWidth / 2
        : paddingLeft + (index / (series.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (point.total / maxValue) * chartHeight;

    return { ...point, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
  const areaPath =
    points.length > 0
      ? [
          `M ${points[0].x} ${paddingTop + chartHeight}`,
          ...points.map((point) => `L ${point.x} ${point.y}`),
          `L ${points[points.length - 1].x} ${paddingTop + chartHeight}`,
          'Z',
        ].join(' ')
      : '';
  const goalY = paddingTop + chartHeight - (goal / maxValue) * chartHeight;
  const yTicks = [0, maxValue * 0.33, maxValue * 0.66, maxValue];

  if (points.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-gray-500">No analytics data available.</div>;
  }

  return (
    <div className="min-h-0">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[320px] w-full">
        {yTicks.map((tick) => {
          const y = paddingTop + chartHeight - (tick / maxValue) * chartHeight;
          return (
            <g key={tick}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
              />
              <text x={8} y={y + 4} className="fill-gray-400 text-[11px]">
                {formatNutrientValue(nutrient, tick, units)}
              </text>
            </g>
          );
        })}

        <line
          x1={paddingLeft}
          y1={goalY}
          x2={width - paddingRight}
          y2={goalY}
          stroke="#f97316"
          strokeDasharray="6 6"
          strokeWidth="2"
        />

        <path d={areaPath} fill="#3b82f6" fillOpacity="0.12" />
        <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />

        {points.map((point) => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} r="5" fill="#2563eb" />
            <text x={point.x} y={height - 12} textAnchor="middle" className="fill-gray-500 text-[11px]">
              {point.short}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-2 flex items-center gap-4 text-xs font-medium text-gray-500">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
          Actual
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-[2px] w-4 bg-orange-500" />
          Goal
        </span>
      </div>
    </div>
  );
}

function MiniBarChart({ series }: { series: number[] }) {
  const maxValue = Math.max(...series, 1);

  return (
    <div className="mt-4 flex h-14 items-end gap-1">
      {series.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className="flex-1 rounded-t bg-blue-500/80"
          style={{ height: `${Math.max((value / maxValue) * 100, 14)}%` }}
        />
      ))}
    </div>
  );
}

function UnitSelector({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium capitalize text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

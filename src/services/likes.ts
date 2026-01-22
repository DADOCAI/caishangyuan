const NAMESPACE = (import.meta as any).env?.VITE_COUNTAPI_NAMESPACE || "dadooooo-tools";

function safeParseInt(v: string): number {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}

function hashUserId(id: string): string {
  try {
    return btoa(unescape(encodeURIComponent(id))).replace(/=+$/g, "");
  } catch {
    return id.replace(/[^a-zA-Z0-9_-]/g, "_");
  }
}

async function httpJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function createKey(key: string, value = 0) {
  const url = `https://api.countapi.xyz/create?namespace=${encodeURIComponent(NAMESPACE)}&key=${encodeURIComponent(key)}&value=${value}&enable_reset=1&update_lowerbound=-1000000&update_upperbound=1000000`;
  try { await httpJson(url); } catch {}
}

export async function getLikeCount(resourceId: number): Promise<number> {
  const key = `res-${resourceId}-likes`;
  try {
    const j = await httpJson(`https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(key)}`);
    return safeParseInt(String(j.value));
  } catch {
    await createKey(key, 0);
    try {
      const j = await httpJson(`https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(key)}`);
      return safeParseInt(String(j.value));
    } catch {
      try {
        const raw = localStorage.getItem(`likes_count_${resourceId}`);
        return raw ? safeParseInt(raw) : 0;
      } catch {
        return 0;
      }
    }
  }
}

export async function getUserLiked(resourceId: number, userId: string): Promise<boolean> {
  const key = `res-${resourceId}-liked-${hashUserId(userId)}`;
  try {
    const j = await httpJson(`https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(key)}`);
    return safeParseInt(String(j.value)) === 1;
  } catch {
    try {
      return localStorage.getItem(`liked_${resourceId}_${userId}`) === "1";
    } catch {
      return false;
    }
  }
}

export async function setUserLiked(resourceId: number, userId: string, liked: boolean): Promise<{ count: number }>{
  const likedKey = `res-${resourceId}-liked-${hashUserId(userId)}`;
  const countKey = `res-${resourceId}-likes`;
  try {
    await createKey(likedKey, 0);
    await createKey(countKey, 0);
    if (liked) {
      await httpJson(`https://api.countapi.xyz/set/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(likedKey)}?value=1`);
      const j = await httpJson(`https://api.countapi.xyz/update/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(countKey)}?amount=1`);
      const c = safeParseInt(String(j.value));
      return { count: c };
    } else {
      await httpJson(`https://api.countapi.xyz/set/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(likedKey)}?value=0`);
      const j = await httpJson(`https://api.countapi.xyz/update/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(countKey)}?amount=-1`);
      const c = safeParseInt(String(j.value));
      return { count: c };
    }
  } catch {
    try {
      if (liked) {
        localStorage.setItem(`liked_${resourceId}_${userId}`, "1");
        const c = safeParseInt(localStorage.getItem(`likes_count_${resourceId}`) || "0") + 1;
        localStorage.setItem(`likes_count_${resourceId}`, String(c));
        return { count: c };
      } else {
        localStorage.removeItem(`liked_${resourceId}_${userId}`);
        const current = safeParseInt(localStorage.getItem(`likes_count_${resourceId}`) || "0");
        const c = Math.max(0, current - 1);
        localStorage.setItem(`likes_count_${resourceId}`, String(c));
        return { count: c };
      }
    } catch {
      return { count: await getLikeCount(resourceId) };
    }
  }
}

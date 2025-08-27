const API = import.meta.env.VITE_API;


async function j(url, opts) {
const r = await fetch(url, opts);
if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
return r.json();
}


export const nlCandidateSearch = (query, filters = {}) =>
j(`${API}/api/candidates/search`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ query, filters })
});


export const nlJobSearch = (query, filters = {}) =>
j(`${API}/api/jobs/search`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ query, filters })
});


export const uploadResume = async (file) => {
const fd = new FormData();
fd.append("resume", file);
return j(`${API}/api/candidates/upload`, { method: "POST", body: fd });
};


export const createCandidate = (data) =>
j(`${API}/api/candidates`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(data)
});